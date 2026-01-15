import fs from "node:fs"
import path from "node:path"
import type MarkdownIt from "markdown-it"
import ts from "typescript"

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function resolveRepoPath(filePath: string) {
  const cleaned = filePath.trim().replace(/^['"]|['"]$/g, "")
  const abs = path.isAbsolute(cleaned)
    ? path.join(process.cwd(), cleaned.slice(1)) // "/src/..." -> "<cwd>/src/..."
    : path.join(process.cwd(), cleaned)
  return { cleaned, abs }
}

type DefRow = {
  key: string
  label?: string
  description?: string
  examples?: string[]
  antiExamples?: string[]
  deprecated?: boolean
}

function getString(node: ts.Expression | undefined, sf: ts.SourceFile): string | undefined {
  if (!node) return undefined
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text
  return undefined
}

function getBoolean(node: ts.Expression | undefined): boolean | undefined {
  if (!node) return undefined
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false
  return undefined
}

function getStringArray(node: ts.Expression | undefined, sf: ts.SourceFile): string[] | undefined {
  if (!node) return undefined
  if (!ts.isArrayLiteralExpression(node)) return undefined
  const out: string[] = []
  for (const el of node.elements) {
    const s = getString(el, sf)
    if (s != null) out.push(s)
  }
  return out.length ? out : []
}

function findExportedObjectLiteral(
  sf: ts.SourceFile,
  exportName: string
): ts.ObjectLiteralExpression | undefined {
  // Handles:
  // export const CATEGORY_DEFINITIONS = { ... } as const
  // export const CATEGORY_DEFINITIONS = { ... }
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const isExported = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    if (!isExported) continue

    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      if (decl.name.text !== exportName) continue
      if (!decl.initializer) continue

      // Peel "as const"
      let init: ts.Expression = decl.initializer
      if (ts.isAsExpression(init)) init = init.expression

      if (ts.isObjectLiteralExpression(init)) return init
    }
  }
  return undefined
}

function parseDefinitions(obj: ts.ObjectLiteralExpression, sf: ts.SourceFile): DefRow[] {
  const rows: DefRow[] = []

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue

    const key =
      ts.isIdentifier(prop.name)
        ? prop.name.text
        : ts.isStringLiteral(prop.name)
          ? prop.name.text
          : undefined

    if (!key) continue

    let valueExpr: ts.Expression = prop.initializer
    if (ts.isAsExpression(valueExpr)) valueExpr = valueExpr.expression
    if (!ts.isObjectLiteralExpression(valueExpr)) continue

    const row: DefRow = { key }

    for (const inner of valueExpr.properties) {
      if (!ts.isPropertyAssignment(inner)) continue

      const name =
        ts.isIdentifier(inner.name)
          ? inner.name.text
          : ts.isStringLiteral(inner.name)
            ? inner.name.text
            : ""

      if (!name) continue

      if (name === "label") row.label = getString(inner.initializer, sf)
      if (name === "description") row.description = getString(inner.initializer, sf)
      if (name === "examples") row.examples = getStringArray(inner.initializer, sf)
      if (name === "anti_examples") row.antiExamples = getStringArray(inner.initializer, sf)
      if (name === "deprecated") row.deprecated = getBoolean(inner.initializer)
    }

    rows.push(row)
  }

  // Stable order: by key
  rows.sort((a, b) => a.key.localeCompare(b.key))
  return rows
}

function renderDefinitionsTable(rows: DefRow[]) {
  if (!rows.length) return `<blockquote>No category definitions found.</blockquote>`

  const header = `
<table>
  <thead>
    <tr>
      <th>Key</th>
      <th>Label</th>
      <th>Description</th>
      <th>Examples</th>
      <th>Anti-examples</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
`

  const body = rows
    .map((r) => {
      const examples = r.examples?.length ? r.examples.join("; ") : "—"
      const anti = r.antiExamples?.length ? r.antiExamples.join("; ") : "—"
      const deprecated =
        r.deprecated === true ? "Yes" : r.deprecated === false ? "No" : "—"

      return `
    <tr>
      <td><code>${escapeHtml(r.key)}</code></td>
      <td>${r.label ? escapeHtml(r.label) : "—"}</td>
      <td>${r.description ? escapeHtml(r.description) : "—"}</td>
      <td>${examples !== "—" ? escapeHtml(examples) : "—"}</td>
      <td>${anti !== "—" ? escapeHtml(anti) : "—"}</td>
      <td>${deprecated}</td>
    </tr>
`
    })
    .join("")

  const footer = `
  </tbody>
</table>
`

  return header + body + footer
}

export function definitionsTablePlugin(md: MarkdownIt) {
  // Supports:
  // @definitionsTable(/path/to/definitions.ts, CONSTANT_NAME)
  const RE = /^@definitionsTable\(([^,]+),\s*([^)]+)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "category_definitions_table",
    (state, startLine, _endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("category_definitions_table", "", 0)
      token.meta = { 
        filePath: m[1].trim(),
        constantName: m[2].trim()
      }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.category_definitions_table = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const constantName = tokens[idx].meta?.constantName as string
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>DefinitionsTable error: file not found: <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const source = fs.readFileSync(abs, "utf8")
    const sf = ts.createSourceFile(
      abs,
      source,
      ts.ScriptTarget.Latest,
      true,
      abs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )

    const obj = findExportedObjectLiteral(sf, constantName)
    if (!obj) {
      return `<blockquote>DefinitionsTable error: could not find exported <code>${escapeHtml(
        constantName
      )}</code> object in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const rows = parseDefinitions(obj, sf)
    return renderDefinitionsTable(rows)
  }
}

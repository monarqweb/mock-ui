// docs/.vitepress/plugins/props-table.ts
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

type PropRow = {
  name: string
  type: string
  required: boolean
  default?: string
  options?: string[]
  interface?: string
  description?: string
}

function renderPropsTable(rows: PropRow[]) {
  if (!rows.length) {
    return `<blockquote>No props found for this component.</blockquote>`
  }

  const header = `
<table>
  <thead>
    <tr>
      <th>Prop</th>
      <th>Type</th>
      <th>Required</th>
      <th>Default</th>
      <th>Options</th>
      <th>Interface</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
`

  const body = rows
    .map((r) => {
      const options = r.options?.length ? r.options.join(", ") : "—"
      return `
    <tr>
      <td><code>${escapeHtml(r.name)}</code></td>
      <td><code>${escapeHtml(r.type)}</code></td>
      <td>${r.required ? "Yes" : "No"}</td>
      <td>${r.default ? `<code>${escapeHtml(r.default)}</code>` : "—"}</td>
      <td>${options !== "—" ? `<code>${escapeHtml(options)}</code>` : "—"}</td>
      <td>${r.interface ? `<code>${escapeHtml(r.interface)}</code>` : "—"}</td>
      <td>${r.description ? escapeHtml(r.description) : "—"}</td>
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

function getJsDocText(node: ts.Node, sourceFile: ts.SourceFile) {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined
  if (!jsDocs?.length) return undefined

  // If multiple JSDoc blocks exist, join them with a blank line.
  const parts: string[] = []
  for (const d of jsDocs) {
    const comment = d.comment
    if (typeof comment === "string") parts.push(comment.trim())
    else if (Array.isArray(comment)) {
      // Rare structured form; fallback to source slice.
      parts.push(d.getText(sourceFile))
    } else {
      parts.push(d.getText(sourceFile))
    }

    // Extract @default tag if present and append to allow parsing elsewhere if needed.
    if (d.tags?.length) {
      for (const tag of d.tags) {
        if (tag.tagName.getText(sourceFile) === "default") {
          const t = tag.comment ? String(tag.comment).trim() : ""
          if (t) parts.push(`@default ${t}`)
        }
      }
    }
  }

  const text = parts.join("\n\n").trim()
  return text.length ? text : undefined
}

function getJsDocDefault(node: ts.Node, sourceFile: ts.SourceFile) {
  const jsDocs = (node as any).jsDoc as ts.JSDoc[] | undefined
  if (!jsDocs?.length) return undefined
  for (const d of jsDocs) {
    if (!d.tags?.length) continue
    for (const tag of d.tags) {
      if (tag.tagName.getText(sourceFile) === "default") {
        const raw = tag.comment ? String(tag.comment).trim() : ""
        return raw || undefined
      }
    }
  }
  return undefined
}

function deriveOptionsFromTypeText(typeText: string) {
  // Only extract literal string unions for determinism.
  // Example: "left" | "right"
  const literals = [...typeText.matchAll(/"([^"]+)"/g)].map((m) => m[1])
  return literals.length >= 2 ? literals : undefined
}

function interfaceNameFromTypeNode(typeNode: ts.TypeNode | undefined, sourceFile: ts.SourceFile) {
  if (!typeNode) return undefined

  // FormField[] -> FormField
  if (ts.isArrayTypeNode(typeNode)) {
    const el = typeNode.elementType
    if (ts.isTypeReferenceNode(el) && ts.isIdentifier(el.typeName)) {
      return el.typeName.getText(sourceFile)
    }
  }

  // PropertySearchHeroForm -> PropertySearchHeroForm
  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    return typeNode.typeName.getText(sourceFile)
  }

  // { ... } inline types are not linked as interfaces
  return undefined
}

function findPropsInterface(
  sourceFile: ts.SourceFile,
  filePathHint?: string
): ts.InterfaceDeclaration | undefined {
  // Strategy (deterministic):
  // 1) Prefer "export interface <ComponentName>Props" where ComponentName matches the exported function/component
  // 2) Otherwise, first exported interface ending with "Props"
  // 3) Otherwise, first interface ending with "Props"
  //
  // You can tighten this later if you want.
  const exportedComponentNames: string[] = []

  const visitForExports = (node: ts.Node) => {
    // export function Foo() {}
    if (ts.isFunctionDeclaration(node) && node.name) {
      const isExported =
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
      if (isExported) exportedComponentNames.push(node.name.text)
    }

    // export const Foo = () => {}
    if (ts.isVariableStatement(node)) {
      const isExported =
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
      if (isExported) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) exportedComponentNames.push(decl.name.text)
        }
      }
    }

    ts.forEachChild(node, visitForExports)
  }
  visitForExports(sourceFile)

  const interfaces: ts.InterfaceDeclaration[] = []
  const exportedInterfaces: ts.InterfaceDeclaration[] = []

  const visitForInterfaces = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node)) {
      interfaces.push(node)
      const isExported =
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
      if (isExported) exportedInterfaces.push(node)
    }
    ts.forEachChild(node, visitForInterfaces)
  }
  visitForInterfaces(sourceFile)

  // 1) Match <ComponentName>Props
  for (const compName of exportedComponentNames) {
    const target = `${compName}Props`
    const found =
      exportedInterfaces.find((i) => i.name.text === target) ??
      interfaces.find((i) => i.name.text === target)
    if (found) return found
  }

  // 2) First exported interface ending with Props
  const exportedProps = exportedInterfaces.find((i) => i.name.text.endsWith("Props"))
  if (exportedProps) return exportedProps

  // 3) First interface ending with Props
  const anyProps = interfaces.find((i) => i.name.text.endsWith("Props"))
  if (anyProps) return anyProps

  return undefined
}

function extractPropsFromInterface(sourceFile: ts.SourceFile): PropRow[] {
  const iface = findPropsInterface(sourceFile)
  if (!iface) return []

  const rows: PropRow[] = []

  for (const member of iface.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue

    // prop name
    const name =
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(sourceFile)

    // required
    const required = !member.questionToken

    // type
    const typeText = member.type ? member.type.getText(sourceFile).trim() : "unknown"

    // description (from JSDoc on the property)
    const description = getJsDocText(member, sourceFile)

    // default (from @default tag on the property)
    const def = getJsDocDefault(member, sourceFile)

    // options (derived from union literal strings)
    const options = deriveOptionsFromTypeText(typeText)

    // interface hint (for object/array props)
    const ifaceName = interfaceNameFromTypeNode(member.type, sourceFile)

    rows.push({
      name,
      type: typeText,
      required,
      default: def,
      options,
      interface: ifaceName,
      description,
    })
  }

  return rows
}

export function propsTablePlugin(md: MarkdownIt) {
  const RE = /^@propsTable\(([^)]+)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "props_table",
    (state, startLine, _endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("props_table", "", 0)
      token.meta = { filePath: m[1].trim() }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.props_table = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>PropsTable error: file not found: <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const source = fs.readFileSync(abs, "utf8")
    const sourceFile = ts.createSourceFile(
      abs,
      source,
      ts.ScriptTarget.Latest,
      true,
      abs.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
    )

    const rows = extractPropsFromInterface(sourceFile)

    if (!rows.length) {
      return `<blockquote>PropsTable error: no <code>*Props</code> interface found in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    return renderPropsTable(rows)
  }
}

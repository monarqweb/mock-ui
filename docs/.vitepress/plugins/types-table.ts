// docs/.vitepress/plugins/types-table.ts
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
  description?: string
  type: string
  required: boolean
  default?: string
}

type TypeDecl =
  | { kind: "interface"; node: ts.InterfaceDeclaration }
  | { kind: "type"; node: ts.TypeAliasDeclaration }

const BUILTIN_TYPE_NAMES = new Set([
  "string",
  "number",
  "boolean",
  "any",
  "unknown",
  "never",
  "object",
  "Record",
  "Partial",
  "Required",
  "Pick",
  "Omit",
  "Readonly",
  "Exclude",
  "Extract",
  "NonNullable",
  "Parameters",
  "ReturnType",
  "Promise",
  "Array",
  "Map",
  "Set",
  "Date",
  "RegExp",
  "React",
  "ReactNode",
  "JSX",
])

function getJsDocDefault(node: ts.Node, sourceFile: ts.SourceFile) {
  const jsDocs = ((node as any).jsDoc as ts.JSDoc[] | undefined) ?? []
  for (const d of jsDocs) {
    if (!d.tags?.length) continue
    for (const tag of d.tags) {
      if (tag.tagName.getText(sourceFile) === "default") {
        const raw = (tag as any).comment ? String((tag as any).comment).trim() : ""
        return raw || undefined
      }
    }
  }
  return undefined
}

function getJsDocDescription(node: ts.Node, sourceFile: ts.SourceFile) {
  const jsDocs = ((node as any).jsDoc as ts.JSDoc[] | undefined) ?? []
  if (!jsDocs.length) return undefined

  // Prefer the last JSDoc block (closest to the member) for determinism.
  const d = jsDocs[jsDocs.length - 1]
  const c = (d as any).comment
  if (typeof c === "string") {
    const s = c.trim()
    return s.length ? s : undefined
  }

  // Fallback: extract text between /** */ if comment is structured
  const text = d.getText(sourceFile)
  const match = text.match(/\/\*\*([\s\S]*?)\*\//)
  if (!match) return undefined
  const normalized = match[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd())
    .join("\n")
    .trim()
  if (!normalized) return undefined

  // Strip tags if present
  const firstTag = normalized.split("\n").findIndex((l) => l.trim().startsWith("@"))
  const desc = (firstTag >= 0 ? normalized.split("\n").slice(0, firstTag) : normalized)
    .join("\n")
    .trim()
  return desc.length ? desc : undefined
}

export function findPropsInterface(sourceFile: ts.SourceFile): ts.InterfaceDeclaration | undefined {
  const exportedComponentNames: string[] = []

  const visitForExports = (node: ts.Node) => {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const isExported =
        node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
      if (isExported) exportedComponentNames.push(node.name.text)
    }

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

  for (const compName of exportedComponentNames) {
    const target = `${compName}Props`
    const found =
      exportedInterfaces.find((i) => i.name.text === target) ??
      interfaces.find((i) => i.name.text === target)
    if (found) return found
  }

  const exportedProps = exportedInterfaces.find((i) => i.name.text.endsWith("Props"))
  if (exportedProps) return exportedProps

  const anyProps = interfaces.find((i) => i.name.text.endsWith("Props"))
  if (anyProps) return anyProps

  return undefined
}

export function buildTypeIndex(sourceFile: ts.SourceFile) {
  const index = new Map<string, TypeDecl>()

  const visit = (node: ts.Node) => {
    if (ts.isInterfaceDeclaration(node)) {
      index.set(node.name.text, { kind: "interface", node })
    } else if (ts.isTypeAliasDeclaration(node)) {
      index.set(node.name.text, { kind: "type", node })
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)

  return index
}

function collectTypeRefsFromTypeNode(
  typeNode: ts.TypeNode | undefined,
  out: Set<string>,
  sourceFile: ts.SourceFile,
  exclude: Set<string>
) {
  if (!typeNode) return

  const walk = (n: ts.Node) => {
    if (ts.isTypeReferenceNode(n)) {
      const nameText = n.typeName.getText(sourceFile)
      const baseName = nameText.split(".").pop() ?? nameText // React.ReactNode -> ReactNode-ish, but we keep last part
      if (!exclude.has(nameText) && !exclude.has(baseName) && !BUILTIN_TYPE_NAMES.has(baseName)) {
        out.add(baseName)
      }
    }

    // Foo[] also can contain TypeReference under ArrayTypeNode elementType
    ts.forEachChild(n, walk)
  }

  walk(typeNode)
}

export function extractRowsFromInterface(
  iface: ts.InterfaceDeclaration,
  sourceFile: ts.SourceFile
): PropRow[] {
  const rows: PropRow[] = []

  for (const member of iface.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue

    const name =
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(sourceFile)

    const required = !member.questionToken
    const typeText = member.type ? member.type.getText(sourceFile).trim() : "unknown"
    const description = getJsDocDescription(member, sourceFile)
    const def = getJsDocDefault(member, sourceFile)

    rows.push({
      name,
      type: typeText,
      required,
      default: def,
      description,
    })
  }

  // Stable ordering: source order is fine, but to be deterministic across refactors,
  // you may prefer alphabetical. Keeping source order usually reads better.
  return rows
}

export function extractRowsFromTypeAlias(
  alias: ts.TypeAliasDeclaration,
  sourceFile: ts.SourceFile
): PropRow[] {
  // Only render object-like aliases deterministically
  // Example: type Foo = { a: string; b?: number }
  if (!alias.type || !ts.isTypeLiteralNode(alias.type)) return []

  const rows: PropRow[] = []
  for (const member of alias.type.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue

    const name =
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(sourceFile)

    const required = !member.questionToken
    const typeText = member.type ? member.type.getText(sourceFile).trim() : "unknown"
    const description = getJsDocDescription(member, sourceFile)
    const def = getJsDocDefault(member, sourceFile)

    rows.push({
      name,
      type: typeText,
      required,
      default: def,
      description,
    })
  }

  return rows
}

function renderPropsTable(rows: PropRow[]) {
  if (!rows.length) {
    return `<blockquote>No fields found.</blockquote>`
  }

  // Define column structure
  const columns = [
    { header: "Prop", getValue: (r: PropRow) => `<code>${escapeHtml(r.name)}</code>`, alwaysShow: true },
    { header: "Type", getValue: (r: PropRow) => `<code>${escapeHtml(r.type)}</code>`, alwaysShow: true },
    { header: "Required", getValue: (r: PropRow) => r.required ? "Yes" : "-", alwaysShow: true },
    { header: "Default", getValue: (r: PropRow) => r.default ? `<code>${escapeHtml(r.default)}</code>` : "—", alwaysShow: false },
    { header: "Description", getValue: (r: PropRow) => r.description ? escapeHtml(r.description) : "—", alwaysShow: false },
  ]

  // Determine which columns to show (always show columns marked as alwaysShow, or if any row has non-empty value)
  const visibleColumns = columns.map((col, index) => {
    if (col.alwaysShow) return true
    // Check if any row has a non-empty value for this column
    return rows.some((r) => {
      const value = col.getValue(r)
      return value !== "—"
    })
  })

  // Build header
  const headerCells = columns
    .filter((_, index) => visibleColumns[index])
    .map((col) => `<th>${col.header}</th>`)
    .join("")

  const header = `
<table>
  <thead>
    <tr>
      ${headerCells}
    </tr>
  </thead>
  <tbody>
`

  // Build body rows
  const body = rows
    .map((r) => {
      const cells = columns
        .filter((_, index) => visibleColumns[index])
        .map((col) => `<td>${col.getValue(r)}</td>`)
        .join("")
      return `
    <tr>
      ${cells}
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

export function renderTypeSectionHeader() {
  return `<h3>Types</h3>\n`
}

export function renderTypeBlock(
  typeName: string,
  kind: "interface" | "type",
  rows: PropRow[]
) {
  const anchor = `type-${typeName.toLowerCase()}`
  const title =
    kind === "interface" ? `Interface: ${typeName}` : `Type: ${typeName}`

  return `
<h4 id="${escapeHtml(anchor)}">${escapeHtml(title)}</h4>
${renderPropsTable(rows)}
`
}

export function parseDirectiveArgs(raw: string) {
  // Accept:
  // @typesTable(/path.tsx)
  // @typesTable(/path.tsx, depth=2)
  // @typesTable("/path.tsx", depth=2, include=Foo|Bar, exclude=ReactNode|Record)
  const parts = raw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)

  const filePath = (parts[0] ?? "").trim()
  const opts: Record<string, string> = {}

  for (const p of parts.slice(1)) {
    const eq = p.indexOf("=")
    if (eq === -1) continue
    const k = p.slice(0, eq).trim()
    const v = p.slice(eq + 1).trim()
    opts[k] = v
  }

  const depthRaw = opts.depth ? Number(opts.depth) : 1
  const depth = Number.isFinite(depthRaw) ? Math.max(0, Math.min(3, depthRaw)) : 1

  const splitList = (v?: string) =>
    (v ?? "")
      .replace(/^['"]|['"]$/g, "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)

  const include = new Set(splitList(opts.include))
  const exclude = new Set(splitList(opts.exclude))

  return { filePath, depth, include, exclude }
}

export function computeReferencedTypes(
  startTypeNames: string[],
  typeIndex: Map<string, TypeDecl>,
  sourceFile: ts.SourceFile,
  depth: number,
  include: Set<string>,
  exclude: Set<string>
) {
  const resultOrder: string[] = []
  const visited = new Set<string>()

  const enqueue = (name: string) => {
    if (visited.has(name)) return
    visited.add(name)
    resultOrder.push(name)
  }

  // Seed
  if (include.size) {
    for (const n of include) enqueue(n)
  } else {
    for (const n of startTypeNames) enqueue(n)
  }

  // BFS up to depth
  let frontier = [...resultOrder]
  for (let d = 0; d < depth; d++) {
    const next: string[] = []

    for (const typeName of frontier) {
      const decl = typeIndex.get(typeName)
      if (!decl) continue

      const refs = new Set<string>()
      if (decl.kind === "interface") {
        for (const m of decl.node.members) {
          if (!ts.isPropertySignature(m)) continue
          collectTypeRefsFromTypeNode(m.type, refs, sourceFile, exclude)
        }
      } else {
        // For type aliases, only follow refs if we can read its type node
        collectTypeRefsFromTypeNode(decl.node.type, refs, sourceFile, exclude)
      }

      for (const r of refs) {
        if (exclude.has(r) || BUILTIN_TYPE_NAMES.has(r)) continue
        if (!visited.has(r)) {
          visited.add(r)
          next.push(r)
          resultOrder.push(r)
        }
      }
    }

    frontier = next
    if (!frontier.length) break
  }

  // Filter to only types we can actually render from this file
  const filtered = resultOrder.filter((n) => typeIndex.has(n))

  // Stable sort? Keep discovery order (more useful), but ensure deterministic:
  // discovery order is deterministic given AST + traversal, so we keep it.
  return filtered
}

export function getStartTypeNamesFromPropsInterface(
  propsIface: ts.InterfaceDeclaration,
  sourceFile: ts.SourceFile,
  exclude: Set<string>
) {
  const refs = new Set<string>()
  for (const member of propsIface.members) {
    if (!ts.isPropertySignature(member)) continue
    collectTypeRefsFromTypeNode(member.type, refs, sourceFile, exclude)
  }
  // Stable ordering
  return [...refs].sort((a, b) => a.localeCompare(b))
}

export function typesTablePlugin(md: MarkdownIt) {
  // Supports:
  // @typesTable(/path.tsx)
  // @typesTable(/path.tsx, depth=2, include=Foo|Bar, exclude=ReactNode|Record)
  const RE = /^@typesTable\((.*)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "types_table",
    (state, startLine, _endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("types_table", "", 0)
      token.meta = { args: m[1] }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.types_table = (tokens, idx) => {
    const rawArgs = String(tokens[idx].meta?.args ?? "")
    const { filePath, depth, include, exclude } = parseDirectiveArgs(rawArgs)
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>TypesTable error: file not found: <code>${escapeHtml(
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

    const propsIface = findPropsInterface(sourceFile)
    if (!propsIface) {
      return `<blockquote>TypesTable error: no <code>*Props</code> interface found in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const typeIndex = buildTypeIndex(sourceFile)

    // Start from types referenced by Props (unless include=... is provided)
    const startTypeNames = getStartTypeNamesFromPropsInterface(propsIface, sourceFile, exclude)

    const namesToRender = computeReferencedTypes(
      startTypeNames,
      typeIndex,
      sourceFile,
      depth,
      include,
      exclude
    )

    if (!namesToRender.length) {
      return `<blockquote>No local types referenced by this component.</blockquote>`
    }

    let html = renderTypeSectionHeader()

    for (const name of namesToRender) {
      const decl = typeIndex.get(name)
      if (!decl) continue

      if (decl.kind === "interface") {
        const rows = extractRowsFromInterface(decl.node, sourceFile)
        html += renderTypeBlock(name, "interface", rows)
      } else {
        const rows = extractRowsFromTypeAlias(decl.node, sourceFile)
        if (!rows.length) {
          // Skip non-object aliases to keep output clean and predictable
          continue
        }
        html += renderTypeBlock(name, "type", rows)
      }
    }

    return html
  }
}

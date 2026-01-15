// docs/.vitepress/plugins/events-table.ts
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

type EventRow = {
  event: string
  description?: string
  listenVia: string
  when?: string
  payload?: string
}

export function renderEventsTable(rows: EventRow[]) {
  if (!rows.length) {
    return `<blockquote>No events found for this component.</blockquote>`
  }

  const header = `
<table>
  <thead>
    <tr>
      <th>Event</th>
      <th>Description</th>
      <th>Listen via</th>
      <th>When it fires</th>
      <th>Payload</th>
    </tr>
  </thead>
  <tbody>
`

  const body = rows
    .map((r) => {
      return `
    <tr>
      <td><code>${escapeHtml(r.event)}</code></td>
      <td>${r.description ? escapeHtml(r.description) : "—"}</td>
      <td><code>${escapeHtml(r.listenVia)}</code></td>
      <td>${r.when ? escapeHtml(r.when) : "—"}</td>
      <td>${r.payload ? `<code>${escapeHtml(r.payload)}</code>` : "—"}</td>
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

function findPropsInterface(sourceFile: ts.SourceFile): ts.InterfaceDeclaration | undefined {
  // Same deterministic strategy as props-table:
  // 1) Match <ExportedComponentName>Props
  // 2) First exported interface ending with Props
  // 3) First interface ending with Props
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

function getJsDocBlocks(node: ts.Node): ts.JSDoc[] {
  return ((node as any).jsDoc as ts.JSDoc[] | undefined) ?? []
}

function jsDocTagValue(doc: ts.JSDoc, tagName: string, sourceFile: ts.SourceFile) {
  if (!doc.tags?.length) return undefined
  for (const t of doc.tags) {
    if (t.tagName.getText(sourceFile) === tagName) {
      const comment = (t as any).comment
      if (comment == null) return ""
      return String(comment).trim()
    }
  }
  return undefined
}

function jsDocDescription(doc: ts.JSDoc): string | undefined {
  const c = (doc as any).comment
  if (typeof c === "string") {
    const s = c.trim()
    return s.length ? s : undefined
  }
  // If comment is structured array, fall back to undefined to keep deterministic.
  return undefined
}

export function extractEventsFromPropsInterface(sourceFile: ts.SourceFile): EventRow[] {
  const iface = findPropsInterface(sourceFile)
  if (!iface) return []

  const rows: EventRow[] = []

  for (const member of iface.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue

    // Only callback props can be events
    const isFunctionType =
      member.type &&
      (ts.isFunctionTypeNode(member.type) || ts.isTypeReferenceNode(member.type))

    // Still allow type references, but we only include if @event is present anyway.
    if (!isFunctionType) continue

    const propName =
      ts.isIdentifier(member.name) || ts.isStringLiteral(member.name)
        ? member.name.text
        : member.name.getText(sourceFile)

    // Aggregate all JSDoc blocks on this prop
    const docs = getJsDocBlocks(member)
    if (!docs.length) continue

    // Find first doc block that contains @event
    const docWithEvent = docs.find((d) => jsDocTagValue(d, "event", sourceFile) != null)
    if (!docWithEvent) continue

    const eventName = jsDocTagValue(docWithEvent, "event", sourceFile)
    if (!eventName) continue

    const when = jsDocTagValue(docWithEvent, "when", sourceFile)
    const payload = jsDocTagValue(docWithEvent, "payload", sourceFile)
    const description = jsDocDescription(docWithEvent)

    rows.push({
      event: eventName,
      listenVia: propName,
      when: when && when.length ? when : undefined,
      payload: payload && payload.length ? payload : undefined,
      description,
    })
  }

  // Stable output ordering: by event name, then prop name
  rows.sort((a, b) => {
    const e = a.event.localeCompare(b.event)
    if (e !== 0) return e
    return a.listenVia.localeCompare(b.listenVia)
  })

  return rows
}

export function eventsTablePlugin(md: MarkdownIt) {
  const RE = /^@eventsTable\(([^)]+)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "events_table",
    (state, startLine, _endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("events_table", "", 0)
      token.meta = { filePath: m[1].trim() }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.events_table = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>EventsTable error: file not found: <code>${escapeHtml(
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

    const rows = extractEventsFromPropsInterface(sourceFile)

    if (!rows.length) {
      return `<blockquote>No <code>@event</code> tags found on callback props in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    return renderEventsTable(rows)
  }
}

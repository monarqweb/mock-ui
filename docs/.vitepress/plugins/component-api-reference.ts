// docs/.vitepress/plugins/component-api-reference.ts
import fs from "node:fs"
import path from "node:path"
import type MarkdownIt from "markdown-it"
import ts from "typescript"
import { extractPropsFromInterface, renderPropsTable } from "./props-table"
import { extractEventsFromPropsInterface, renderEventsTable } from "./events-table"
import {
  findPropsInterface,
  buildTypeIndex,
  getStartTypeNamesFromPropsInterface,
  computeReferencedTypes,
  extractRowsFromInterface,
  extractRowsFromTypeAlias,
  renderTypeBlock,
} from "./types-table"

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

export function componentApiReferencePlugin(md: MarkdownIt) {
  const RE = /^@componentApiReference\(([^)]+)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "component_api_reference",
    (state, startLine, _endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("component_api_reference", "", 0)
      token.meta = { filePath: m[1].trim() }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.component_api_reference = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>ComponentApiReference error: file not found: <code>${escapeHtml(
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

    let html = `<h2>API Reference</h2>\n\n`

    // Props section
    const propsRows = extractPropsFromInterface(sourceFile)
    if (propsRows.length > 0) {
      html += `<h3>Props</h3>\n`
      html += renderPropsTable(propsRows)
      html += `\n\n`
    }

    // Events section
    const eventsRows = extractEventsFromPropsInterface(sourceFile)
    if (eventsRows.length > 0) {
      html += `<h3>Events</h3>\n`
      html += renderEventsTable(eventsRows)
      html += `\n\n`
    }

    // Types section
    const propsIface = findPropsInterface(sourceFile)
    if (propsIface) {
      const typeIndex = buildTypeIndex(sourceFile)
      const exclude = new Set<string>()
      const startTypeNames = getStartTypeNamesFromPropsInterface(propsIface, sourceFile, exclude)
      const namesToRender = computeReferencedTypes(
        startTypeNames,
        typeIndex,
        sourceFile,
        1, // default depth
        new Set<string>(), // include
        exclude
      )

      if (namesToRender.length > 0) {
        html += `<h3>Types</h3>\n`

        for (const name of namesToRender) {
          const decl = typeIndex.get(name)
          if (!decl) continue

          if (decl.kind === "interface") {
            const rows = extractRowsFromInterface(decl.node, sourceFile)
            html += renderTypeBlock(name, "interface", rows)
          } else {
            const rows = extractRowsFromTypeAlias(decl.node, sourceFile)
            if (rows.length > 0) {
              html += renderTypeBlock(name, "type", rows)
            }
          }
        }
      }
    }

    return html
  }
}

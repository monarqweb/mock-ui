import fs from "node:fs"
import path from "node:path"
import type MarkdownIt from "markdown-it"

function extractIntroFromJsdoc(source: string) {
  const jsdocMatch = source.match(/\/\*\*([\s\S]*?)\*\//)
  if (!jsdocMatch) return null

  const raw = jsdocMatch[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd())
    .join("\n")
    .trim()

  const lines = raw.split("\n").map((l) => l.trim())
  const title = lines.find((l) => l && !l.startsWith("@"))
  if (!title) return null

  const titleIndex = lines.findIndex((l) => l === title)
  const afterTitle = lines.slice(titleIndex + 1)

  const descLines: string[] = []
  for (const l of afterTitle) {
    if (l.startsWith("@")) break
    descLines.push(l)
  }

  const description = descLines
    .join("\n")
    .trim()
    .replace(/\n{3,}/g, "\n\n")

  return { title, description }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function componentIntroPlugin(md: MarkdownIt) {
  const RE = /^@componentIntro\(([^)]+)\)\s*$/

  md.block.ruler.before(
    "paragraph",
    "component_intro",
    (state, startLine, endLine, silent) => {
      const line = state.src
        .slice(state.bMarks[startLine], state.eMarks[startLine])
        .trim()

      const m = line.match(RE)
      if (!m) return false
      if (silent) return true

      const token = state.push("component_intro", "", 0)
      token.meta = { filePath: m[1].trim() }

      state.line = startLine + 1
      return true
    }
  )

  md.renderer.rules.component_intro = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const cleaned = filePath.replace(/^['"]|['"]$/g, "")

    const abs = path.isAbsolute(cleaned)
      ? path.join(process.cwd(), cleaned.slice(1)) // "/src/..." -> "<cwd>/src/..."
      : path.join(process.cwd(), cleaned)

    if (!fs.existsSync(abs)) {
      return `<blockquote>ComponentIntro error: file not found: <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const source = fs.readFileSync(abs, "utf8")
    const intro = extractIntroFromJsdoc(source)

    if (!intro) {
      return `<blockquote>ComponentIntro error: no JSDoc found in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const title = escapeHtml(intro.title)
    const desc = escapeHtml(intro.description || "")

    // Render as HTML so it is deterministic and not re-parsed
    return desc
      ? `<h1>${title}</h1>\n<p>${desc.replace(/\n\n+/g, "</p>\n<p>")}</p>\n`
      : `<h1>${title}</h1>\n`
  }
}

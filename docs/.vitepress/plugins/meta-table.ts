// docs/.vitepress/plugins/meta-table.ts
import fs from "node:fs"
import path from "node:path"
import type MarkdownIt from "markdown-it"

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

function extractFirstJsdocBlock(source: string) {
  const jsdocMatch = source.match(/\/\*\*([\s\S]*?)\*\//)
  if (!jsdocMatch) return null
  const raw = jsdocMatch[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, "").trimEnd())
    .join("\n")
    .trim()
  return raw
}

type Meta = {
  category?: string
  industry: string[]
  intent: string[]
  tone: string[]
}

function parseMetaFromJsdoc(jsdoc: string): Meta {
  const lines = jsdoc.split("\n").map((l) => l.trim()).filter(Boolean)

  const meta: Meta = {
    category: undefined,
    industry: [],
    intent: [],
    tone: [],
  }

  for (const line of lines) {
    const cat = line.match(/^@category\s+(.+)$/)
    if (cat) {
      meta.category = cat[1].trim()
      continue
    }

    const ind = line.match(/^@industry\s+(.+)$/)
    if (ind) {
      meta.industry.push(ind[1].trim())
      continue
    }

    const intent = line.match(/^@intent\s+(.+)$/)
    if (intent) {
      meta.intent.push(intent[1].trim())
      continue
    }

    const tone = line.match(/^@tone\s+(.+)$/)
    if (tone) {
      meta.tone.push(tone[1].trim())
      continue
    }
  }

  // Deduplicate while preserving stable order
  const dedupe = (arr: string[]) => {
    const seen = new Set<string>()
    const out: string[] = []
    for (const v of arr) {
      if (!seen.has(v)) {
        seen.add(v)
        out.push(v)
      }
    }
    return out
  }

  meta.industry = dedupe(meta.industry)
  meta.intent = dedupe(meta.intent)
  meta.tone = dedupe(meta.tone)

  return meta
}

function renderMetaTable(meta: Meta) {
  const category = meta.category ? `<code>${escapeHtml(meta.category)}</code>` : "—"
  const industry = meta.industry.length
    ? meta.industry.map((v) => `<code>${escapeHtml(v)}</code>`).join(" ")
    : "—"
  const intent = meta.intent.length
    ? meta.intent.map((v) => `<code>${escapeHtml(v)}</code>`).join(" ")
    : "—"
  const tone = meta.tone.length
    ? meta.tone.map((v) => `<code>${escapeHtml(v)}</code>`).join(" ")
    : "—"

  return `
<table>
  <thead>
    <tr>
      <th>Category</th>
      <th>Industry</th>
      <th>Intent</th>
      <th>Tone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${category}</td>
      <td>${industry}</td>
      <td>${intent}</td>
      <td>${tone}</td>
    </tr>
  </tbody>
</table>
`
}

export function metaTablePlugin(md: MarkdownIt) {
  const RE = /^@metaTable\(([^)]+)\)\s*$/

  md.block.ruler.before("paragraph", "meta_table", (state, startLine, _endLine, silent) => {
    const line = state.src.slice(state.bMarks[startLine], state.eMarks[startLine]).trim()
    const m = line.match(RE)
    if (!m) return false
    if (silent) return true

    const token = state.push("meta_table", "", 0)
    token.meta = { filePath: m[1].trim() }

    state.line = startLine + 1
    return true
  })

  md.renderer.rules.meta_table = (tokens, idx) => {
    const filePath = tokens[idx].meta?.filePath as string
    const { cleaned, abs } = resolveRepoPath(filePath)

    if (!fs.existsSync(abs)) {
      return `<blockquote>MetaTable error: file not found: <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const source = fs.readFileSync(abs, "utf8")
    const jsdoc = extractFirstJsdocBlock(source)

    if (!jsdoc) {
      return `<blockquote>MetaTable error: no JSDoc found in <code>${escapeHtml(
        cleaned
      )}</code></blockquote>`
    }

    const meta = parseMetaFromJsdoc(jsdoc)
    return renderMetaTable(meta)
  }
}

import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

/**
 * Configure these to match your repo.
 * Adjust paths if your definition files live elsewhere.
 */
const CONFIG = {
  blocksRoot: "src/components/blocks",

  taxonomies: [
    {
      name: "category",
      definitionFile: "src/components/blocks/definitions/category.ts",
      exportName: "CATEGORY_DEFINITIONS",
      tag: "@category",
      required: true,
      multi: false,
    },
    {
      name: "industry",
      definitionFile: "src/components/blocks/definitions/industry.ts",
      exportName: "INDUSTRY_DEFINITIONS",
      tag: "@industry",
      required: false,
      multi: true,
    },
    {
      name: "intent",
      definitionFile: "src/components/blocks/definitions/intent.ts",
      exportName: "INTENT_DEFINITIONS",
      tag: "@intent",
      required: true,
      multi: true,
    },
    {
      name: "tone",
      definitionFile: "src/components/blocks/definitions/tone.ts",
      exportName: "TONE_DEFINITIONS",
      tag: "@tone",
      required: true,
      multi: true,
    },
  ],
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      walkFiles(full, out)
    } else if (ent.isFile()) {
      if (full.endsWith(".tsx")) out.push(full)
    }
  }
  return out
}

function readFileUtf8(p) {
  return fs.readFileSync(p, "utf8")
}

function createSourceFile(absPath, source) {
  return ts.createSourceFile(
    absPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    absPath.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
}

function findExportedObjectLiteral(sf, exportName) {
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const isExported =
      stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ??
      false
    if (!isExported) continue

    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      if (decl.name.text !== exportName) continue
      if (!decl.initializer) continue

      let init = decl.initializer
      if (ts.isAsExpression(init)) init = init.expression
      if (ts.isObjectLiteralExpression(init)) return init
    }
  }
  return undefined
}

function parseDefinitionKeys(defAbsPath, exportName) {
  const src = readFileUtf8(defAbsPath)
  const sf = createSourceFile(defAbsPath, src)
  const obj = findExportedObjectLiteral(sf, exportName)

  if (!obj) {
    throw new Error(
      `Could not find exported object "${exportName}" in ${defAbsPath}`
    )
  }

  const keys = new Set()
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)) continue

    let key
    if (ts.isIdentifier(prop.name)) key = prop.name.text
    if (ts.isStringLiteral(prop.name)) key = prop.name.text
    if (!key) continue

    keys.add(key)
  }
  return keys
}

function extractFirstJsdocBlock(source) {
  const m = source.match(/\/\*\*[\s\S]*?\*\//)
  if (!m) return null
  return {
    text: m[0],
    index: m.index ?? 0,
  }
}

function normalizeJsdocBlockToLines(jsdocBlockText) {
  // strip /** and */
  const inner = jsdocBlockText.replace(/^\/\*\*/, "").replace(/\*\/$/, "")

  // normalize each line by removing leading "* "
  const lines = inner.split("\n").map((l) => {
    const trimmed = l.replace(/^\s*\*\s?/, "")
    return trimmed.trimEnd()
  })

  // remove leading/trailing blank lines
  while (lines.length && lines[0].trim() === "") lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop()

  return lines
}

function getLineNumber(sf, pos) {
  const lc = sf.getLineAndCharacterOfPosition(pos)
  return lc.line + 1 // 1-based
}

function parseTagsFromJsdocLines(lines, startLine, taxonomyConfig) {
  // Returns:
  // { values: string[], occurrences: [{ value, line }] }
  const out = { values: [], occurrences: [] }

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim()
    if (!raw.startsWith(taxonomyConfig.tag + " ")) continue

    const value = raw.slice(taxonomyConfig.tag.length).trim()
    if (!value) continue

    out.values.push(value)
    out.occurrences.push({ value, line: startLine + i })
  }

  return out
}

function closestMatches(target, candidates, limit = 5) {
  // Very small edit-distance-ish heuristic: sort by shared prefix length then length diff.
  const list = Array.from(candidates)
  const score = (cand) => {
    let prefix = 0
    for (let i = 0; i < Math.min(target.length, cand.length); i++) {
      if (target[i] !== cand[i]) break
      prefix++
    }
    return -(prefix * 10) + Math.abs(target.length - cand.length)
  }
  return list
    .map((c) => ({ c, s: score(c) }))
    .sort((a, b) => a.s - b.s)
    .slice(0, limit)
    .map((x) => x.c)
}

function validateBlockFile(absPath, allowedByTaxonomy) {
  const src = readFileUtf8(absPath)
  const sf = createSourceFile(absPath, src)

  const first = extractFirstJsdocBlock(src)
  if (!first) {
    return [
      {
        file: absPath,
        line: 1,
        kind: "missing_jsdoc",
        message:
          "Missing leading JSDoc block. Add a top-of-file /** ... */ block with @category, @intent, and @tone. @industry is optional.",
      },
    ]
  }

  const jsdocLines = normalizeJsdocBlockToLines(first.text)
  const jsdocStartLine = getLineNumber(sf, first.index)

  const issues = []

  for (const tax of CONFIG.taxonomies) {
    const parsed = parseTagsFromJsdocLines(jsdocLines, jsdocStartLine, tax)

    if (tax.required && parsed.values.length === 0) {
      issues.push({
        file: absPath,
        line: jsdocStartLine,
        kind: "missing_tag",
        message: `Missing ${tax.tag} in leading JSDoc block.`,
      })
      continue
    }

    if (!tax.multi && parsed.values.length > 1) {
      // Category should be singular, etc.
      const firstOcc = parsed.occurrences[1] // second one
      issues.push({
        file: absPath,
        line: firstOcc?.line ?? jsdocStartLine,
        kind: "duplicate_tag",
        message: `Only one ${tax.tag} is allowed, found ${parsed.values.length}.`,
      })
    }

    const allowed = allowedByTaxonomy[tax.name]
    for (const occ of parsed.occurrences) {
      if (!allowed.has(occ.value)) {
        const suggestions = closestMatches(occ.value, allowed, 6)
        const suggestionText = suggestions.length
          ? ` Did you mean: ${suggestions.map((s) => `"${s}"`).join(", ")}?`
          : ` Allowed values: ${Array.from(allowed).slice(0, 12).join(", ")}${
              allowed.size > 12 ? ", ..." : ""
            }`

        issues.push({
          file: absPath,
          line: occ.line,
          kind: "invalid_value",
          message: `Invalid ${tax.name} "${occ.value}".${suggestionText}`,
        })
      }
    }
  }

  return issues
}

function formatIssues(issues) {
  const byFile = new Map()
  for (const it of issues) {
    const arr = byFile.get(it.file) ?? []
    arr.push(it)
    byFile.set(it.file, arr)
  }

  let out = ""
  for (const [file, items] of byFile.entries()) {
    out += `\n${file}\n`
    out += `${"-".repeat(file.length)}\n`
    for (const it of items.sort((a, b) => a.line - b.line)) {
      out += `  Line ${it.line}: ${it.message}\n`
    }
  }
  return out.trim()
}

function main() {
  // Load allowed keys from registries
  const allowedByTaxonomy = {}
  for (const tax of CONFIG.taxonomies) {
    const defAbs = path.join(process.cwd(), tax.definitionFile)
    const keys = parseDefinitionKeys(defAbs, tax.exportName)
    allowedByTaxonomy[tax.name] = keys
  }

  // Scan blocks
  const blocksAbs = path.join(process.cwd(), CONFIG.blocksRoot)
  const files = walkFiles(blocksAbs)

  // Optional: skip obvious non-block files if you have them
  // const files = walkFiles(blocksAbs).filter((f) => !f.endsWith(".test.tsx"));

  const issues = []
  for (const fileAbs of files) {
    issues.push(...validateBlockFile(fileAbs, allowedByTaxonomy))
  }

  if (issues.length) {
    console.error("\nBlock taxonomy validation failed.\n")
    console.error(formatIssues(issues))
    console.error(
      `\nFound ${issues.length} issue${issues.length === 1 ? "" : "s"}.\n`
    )
    process.exit(1)
  }

  console.log(`Block taxonomy validation passed (${files.length} files).`)
}

main()

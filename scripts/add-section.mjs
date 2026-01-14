import { readFile, writeFile } from "fs/promises"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { execSync } from "child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")
const sectionsIndexPath = join(rootDir, "src/components/sections/index.ts")
const appTsxPath = join(rootDir, "src/App.tsx")

/**
 * Verify that a component exists in the sections index
 */
async function resolveComponentPath(componentName) {
  try {
    const content = await readFile(sectionsIndexPath, "utf-8")
    // Look for export { ComponentName } (not export type)
    // Match component exports but not type exports
    const exportRegex = new RegExp(
      `^export\\s+\\{\\s*${componentName}(?:\\s+as\\s+\\w+)?\\s*\\}\\s+from`,
      "m"
    )
    if (exportRegex.test(content)) {
      return componentName
    }
    throw new Error(
      `Component "${componentName}" not found in sections/index.ts`
    )
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`sections/index.ts not found at ${sectionsIndexPath}`)
    }
    throw error
  }
}

/**
 * Parse JSON props string and validate
 */
function parseProps(jsonString) {
  try {
    const props = JSON.parse(jsonString)
    if (typeof props !== "object" || props === null || Array.isArray(props)) {
      throw new Error("Props must be a JSON object")
    }
    return props
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format: ${error.message}`)
    }
    throw error
  }
}

/**
 * Convert props object to formatted JSX props string
 */
function convertPropsToJSX(props) {
  const entries = Object.entries(props)
  if (entries.length === 0) {
    return ""
  }

  const formattedProps = entries
    .map(([key, value]) => {
      if (value === null || value === undefined) {
        return null
      }

      if (typeof value === "string") {
        // Use curly braces with JSON.stringify to handle quotes properly
        if (value.includes('"') || value.includes("'")) {
          return `${key}={${JSON.stringify(value)}}`
        }
        return `${key}="${value}"`
      }

      if (typeof value === "boolean" || typeof value === "number") {
        return `${key}={${value}}`
      }

      if (Array.isArray(value)) {
        const arrayStr = JSON.stringify(value)
        return `${key}={${arrayStr}}`
      }

      if (typeof value === "object") {
        const objStr = JSON.stringify(value)
        return `${key}={${objStr}}`
      }

      return null
    })
    .filter(Boolean)

  // For simple props (all single-line), join with space; otherwise use newlines
  const hasComplexProps = formattedProps.some(
    (prop) => prop.includes("\n") || prop.length > 60
  )
  return hasComplexProps
    ? formattedProps.join("\n        ")
    : formattedProps.join(" ")
}

/**
 * Read App.tsx content
 */
async function readAppTsx() {
  try {
    return await readFile(appTsxPath, "utf-8")
  } catch (error) {
    throw new Error(`Failed to read App.tsx: ${error.message}`)
  }
}

/**
 * Add or update import statement
 */
function addImport(content, componentName) {
  // Match import statements from @/components/sections (may span multiple lines)
  const importRegex =
    /import\s+\{([^}]+)\}\s+from\s+["']@\/components\/sections["']/s
  const existingImportMatch = content.match(importRegex)

  // Check if component is already imported
  if (existingImportMatch) {
    const importBlock = existingImportMatch[0]
    const importsList = existingImportMatch[1]

    // Check if component is already in the import
    const importNames = importsList
      .split(",")
      .map((i) => i.trim().split(/\s+as\s+/)[0])
    if (importNames.includes(componentName)) {
      return content // Already imported
    }

    // Add component to existing import
    const importItems = importsList.split(",").map((i) => i.trim())
    importItems.push(componentName)
    // Sort imports alphabetically
    importItems.sort()

    const newImport = `import { ${importItems.join(", ")} } from "@/components/sections"`
    return content.replace(importRegex, newImport)
  }

  // Create new import statement - insert at the top of the file
  const newImport = `import { ${componentName} } from "@/components/sections"\n`
  return newImport + content
}

/**
 * Insert component JSX at the correct location (after the last inserted component)
 * Moves the insertion marker to below the newly inserted component
 */
function insertComponent(content, componentName, propsJsx) {
  const insertionMarker = "{/* Insert next section component here */}"
  const endMarker = "{/* Section end */}"

  const endIndex = content.indexOf(endMarker)
  if (endIndex === -1) {
    throw new Error("Could not find end marker in App.tsx")
  }

  // Find the last occurrence of the insertion marker before the end marker
  const sectionBeforeEnd = content.substring(0, endIndex)
  let lastMarkerIndex = -1
  let searchIndex = 0

  while (true) {
    const markerIndex = sectionBeforeEnd.indexOf(insertionMarker, searchIndex)
    if (markerIndex === -1) {
      break
    }
    lastMarkerIndex = markerIndex
    searchIndex = markerIndex + insertionMarker.length
  }

  if (lastMarkerIndex === -1) {
    throw new Error("Could not find insertion marker in App.tsx")
  }

  // Split content: everything before the marker, everything after the marker until end marker
  const beforeMarker = content.substring(0, lastMarkerIndex)
  const afterMarker = content.substring(
    lastMarkerIndex + insertionMarker.length,
    endIndex
  )
  const afterEnd = content.substring(endIndex)

  // Get the indentation level (6 spaces based on App.tsx structure)
  const indent = "      "

  // Build the component JSX
  let componentJsx
  if (propsJsx) {
    // Check if props are multi-line or single-line
    if (propsJsx.includes("\n")) {
      // Multi-line props
      componentJsx = `<${componentName}\n        ${propsJsx}\n      />`
    } else {
      // Single-line props
      componentJsx = `<${componentName} ${propsJsx} />`
    }
  } else {
    componentJsx = `<${componentName} />`
  }

  // Remove the old marker, insert component, then add marker after it (move the marker)
  // Clean up whitespace: remove leading whitespace from afterMarker
  const trimmedAfter = afterMarker.replace(/^\s*/, "")
  const contentAfterEndMarker = afterEnd.substring(endMarker.length)
  const newContent =
    beforeMarker +
    "\n" +
    indent +
    componentJsx +
    "\n" +
    indent +
    insertionMarker +
    (trimmedAfter ? "\n" + trimmedAfter : "") +
    "\n" +
    indent +
    endMarker +
    contentAfterEndMarker

  return newContent
}

/**
 * Run Biome formatter and import organizer
 */
function formatFile(filePath) {
  try {
    // Use biome check with organizeImports and formatter
    const relativePath = filePath.replace(rootDir + "/", "")
    execSync(
      `biome check --write ${relativePath}`,
      {
        cwd: rootDir,
        stdio: "inherit",
      }
    )
  } catch (error) {
    console.warn(`Warning: Biome formatting failed: ${error.message}`)
    console.warn("File was still updated, but may need manual formatting")
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error(
      'Usage: node scripts/add-section.mjs <ComponentName> \'{"prop": "value"}\''
    )
    process.exit(1)
  }

  const componentName = args[0]
  const propsJson = args[1]

  try {
    // Validate component exists
    await resolveComponentPath(componentName)
    console.log(`✓ Component "${componentName}" found in sections`)

    // Parse props
    const props = parseProps(propsJson)
    console.log(`✓ Props parsed successfully`)

    // Convert props to JSX
    const propsJsx = convertPropsToJSX(props)

    // Read App.tsx
    let content = await readAppTsx()

    // Add import
    content = addImport(content, componentName)
    console.log(`✓ Import added/updated`)

    // Insert component
    content = insertComponent(content, componentName, propsJsx)
    console.log(`✓ Component inserted`)

    // Write file
    await writeFile(appTsxPath, content, "utf-8")
    console.log(`✓ App.tsx updated`)

    // Format with Biome
    formatFile(appTsxPath)
    console.log(`✓ Formatted with Biome`)

    console.log("\n✅ Section added successfully!")
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`)
    process.exit(1)
  }
}

main()

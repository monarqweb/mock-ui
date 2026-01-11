import { readFile, readdir, stat, writeFile } from "fs/promises"
import { basename, dirname, join } from "path"
import { parse } from "react-docgen-typescript"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, "..")
const sectionsDir = join(rootDir, "src/components/sections")
const registryPath = join(rootDir, "section-registry.json")

// Configure parser options
const parserOptions = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  propFilter: (_prop) => {
    // Include all props
    return true
  },
}

/**
 * Extract @example blocks from JSDoc comment for the component
 */
function extractExamplesFromJSDoc(content, componentName) {
  const examples = []

  // First, find the JSDoc block for the component (same as description extraction)
  const propsInterfaceRegex = new RegExp(
    `export\\s+interface\\s+${componentName}Props`,
    "m"
  )
  const propsMatchIndex = content.search(propsInterfaceRegex)

  if (propsMatchIndex === -1) {
    return examples
  }

  // Find the JSDoc block before the Props interface
  const searchStart = Math.max(0, propsMatchIndex - 2000)
  const beforeProps = content.substring(searchStart, propsMatchIndex)

  // Find all JSDoc blocks and get the one for this component
  const allJsdocBlocks = [...beforeProps.matchAll(/(\/\*\*[\s\S]*?\*\/)/g)]

  let targetJsdoc = null
  for (let i = allJsdocBlocks.length - 1; i >= 0; i--) {
    const match = allJsdocBlocks[i]
    const jsdocText = match[1]
    if (
      jsdocText.includes(componentName + " -") ||
      jsdocText.includes("@param")
    ) {
      targetJsdoc = jsdocText
      break
    }
  }

  // If no specific match, use the last one
  if (!targetJsdoc && allJsdocBlocks.length > 0) {
    targetJsdoc = allJsdocBlocks[allJsdocBlocks.length - 1][1]
  }

  if (targetJsdoc) {
    // Extract @example blocks from the JSDoc
    // The JSDoc has * on each line, so we need to match that pattern
    const exampleStart = targetJsdoc.indexOf("@example")
    if (exampleStart !== -1) {
      const exampleSection = targetJsdoc.substring(exampleStart)
      // Find code block - look for ```tsx, ```ts, or ``` followed by content until closing ```
      // Handle both with and without language specifier
      const codeBlockPattern = /```(?:tsx|ts|jsx)?\s*\n([\s\S]*?)\n\s*\*\s*```/
      const codeBlockMatch = exampleSection.match(codeBlockPattern)

      if (codeBlockMatch?.[1]) {
        let exampleCode = codeBlockMatch[1]
        // Remove JSDoc * prefixes from each line and clean up
        exampleCode = exampleCode
          .split("\n")
          .map((line) => {
            // Remove leading whitespace, *, and trim
            const cleaned = line.replace(/^\s*\*\s?/, "").trim()
            return cleaned
          })
          .filter((line) => line && !line.match(/^```/)) // Filter out markdown code fences
          .join("\n")
          .trim()

        if (exampleCode && exampleCode.length > 10) {
          // Only add if substantial content
          examples.push(exampleCode)
        }
      }
    }
  }

  return examples
}

/**
 * Extract JSDoc description from interface/function
 */
function extractJSDocDescription(content, componentName) {
  // Look for the Props interface declaration
  const propsInterfaceRegex = new RegExp(
    `export\\s+interface\\s+${componentName}Props`,
    "m"
  )
  const propsMatchIndex = content.search(propsInterfaceRegex)

  if (propsMatchIndex === -1) {
    // Try to find JSDoc before the component function instead
    const functionRegex = new RegExp(
      `export\\s+function\\s+${componentName}\\s*\\(`,
      "m"
    )
    const funcMatchIndex = content.search(functionRegex)
    if (funcMatchIndex !== -1) {
      // Look backwards for JSDoc (within 1500 chars)
      const start = Math.max(0, funcMatchIndex - 1500)
      const beforeFunction = content.substring(start, funcMatchIndex)
      // Find the last complete JSDoc block before the function
      const jsdocMatches = [...beforeFunction.matchAll(/(\/\*\*[\s\S]*?\*\/)/g)]
      if (jsdocMatches.length > 0) {
        const lastMatch = jsdocMatches[jsdocMatches.length - 1]
        return extractDescriptionFromJSDoc(lastMatch[1])
      }
    }
    return { full: "", short: "" }
  }

  // Search backwards from the Props interface to find JSDoc that contains the component name
  // Look within 2000 characters before the Props interface
  const searchStart = Math.max(0, propsMatchIndex - 2000)
  const beforeProps = content.substring(searchStart, propsMatchIndex)

  // Find all JSDoc blocks in reverse order (from end to start)
  const allJsdocBlocks = [...beforeProps.matchAll(/(\/\*\*[\s\S]*?\*\/)/g)]

  // Look for the JSDoc block that contains the component name (most likely the correct one)
  for (let i = allJsdocBlocks.length - 1; i >= 0; i--) {
    const match = allJsdocBlocks[i]
    const jsdocText = match[1]

    // Check if this JSDoc is for the component by looking for:
    // 1. Component name in the first line
    // 2. @param tags (indicating it's for props)
    // 3. The word "props" in description
    if (
      jsdocText.includes(componentName + " -") ||
      jsdocText.includes("@param") ||
      (jsdocText.includes("props") && jsdocText.includes("Component"))
    ) {
      return extractDescriptionFromJSDoc(jsdocText)
    }
  }

  // If no match found with component name, use the last JSDoc block before Props interface
  if (allJsdocBlocks.length > 0) {
    const lastMatch = allJsdocBlocks[allJsdocBlocks.length - 1]
    return extractDescriptionFromJSDoc(lastMatch[1])
  }

  return { full: "", short: "" }
}

/**
 * Extract description text from JSDoc block
 */
function extractDescriptionFromJSDoc(jsdocBlock) {
  // Remove /** and */
  const text = jsdocBlock.replace(/^\/\*\*|\*\/$/g, "")
  // Remove leading * from each line
  const lines = text
    .split("\n")
    .map((line) => line.replace(/^\s*\*\s?/, ""))
    .filter((line) => line.trim())

  // Extract first line (brief description) - should be "ComponentName - Description"
  const shortLine = lines[0] || ""
  const short = shortLine.includes(" - ")
    ? shortLine.split(" - ")[1] || shortLine
    : shortLine

  // Extract full description (everything before @param or @example tags)
  const fullParts = []
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("@param") || trimmed.startsWith("@example")) {
      break
    }
    if (trimmed && !trimmed.startsWith("@")) {
      fullParts.push(trimmed)
    }
  }

  // Join and clean up multiple spaces
  const full = fullParts.join(" ").replace(/\s+/g, " ").trim()

  return { full: full || short, short: short }
}

/**
 * Extract all interfaces and types from a file
 */
async function extractAllTypesFromFile(filePath) {
  try {
    const content = await readFile(filePath, "utf-8")
    const types = {}

    // Find all interfaces
    const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*\{([\s\S]*?)\}/g
    let match = interfaceRegex.exec(content)

    while (match !== null) {
      const typeName = match[1]
      const typeBody = match[2]
      const properties = []

      // Extract properties
      const propLines = typeBody.split("\n")

      for (let i = 0; i < propLines.length; i++) {
        const line = propLines[i].trim()
        if (!line || line.startsWith("//")) continue

        // Check for inline comment on same line: /** comment */ prop: type
        const inlineCommentMatch = line.match(
          /\/\*\*\s*([^*]+)\s*\*\/\s*(\w+)\??\s*:\s*([^;,\n}]+)/
        )
        if (inlineCommentMatch) {
          properties.push({
            name: inlineCommentMatch[2],
            type: inlineCommentMatch[3].trim(),
            description: inlineCommentMatch[1].trim(),
            required: !line.includes("?"),
          })
        } else {
          // Regular property: prop?: type
          const propMatch = line.match(/^(\w+)\??\s*:\s*([^;,\n}]+)[;,]?/)
          if (propMatch) {
            // Try to find comment on previous line
            let propDescription = ""
            if (i > 0) {
              const prevLine = propLines[i - 1].trim()
              const commentMatch = prevLine.match(/\/\*\*\s*([^*]+)\s*\*\//)
              if (commentMatch) {
                propDescription = commentMatch[1].trim()
              }
            }

            properties.push({
              name: propMatch[1],
              type: propMatch[2].trim(),
              description: propDescription,
              required: !line.includes("?"),
            })
          }
        }
      }

      types[typeName] = {
        name: typeName,
        properties: properties,
        type: "interface",
      }
      match = interfaceRegex.exec(content)
    }

    return types
  } catch (error) {
    console.error(`Error extracting types from ${filePath}:`, error)
    return {}
  }
}

/**
 * Extract Props interface from a utils file
 */
async function extractPropsFromUtilsFile(filePath) {
  const types = await extractAllTypesFromFile(filePath)
  // Return the Props interface (e.g., BlogCardProps, PricingCardProps, etc.)
  const propsTypes = Object.keys(types).filter((name) => name.endsWith("Props"))
  if (propsTypes.length > 0) {
    return types[propsTypes[0]]
  }
  return null
}

/**
 * Extract related types/interfaces from file content
 */
function extractRelatedTypes(content, componentName) {
  const types = []

  // Find all interface and type declarations
  const interfaceRegex = /(?:export\s+)?interface\s+(\w+)\s*\{([\s\S]*?)\}/g
  const typeRegex =
    /(?:export\s+)?type\s+(\w+)\s*=\s*([\s\S]+?)(?=\n\nexport|\n\/\*\*|\ninterface|\ntype|$)/g

  let match = interfaceRegex.exec(content)

  // Process interfaces
  while (match !== null) {
    const typeName = match[1]
    const typeBody = match[2]
    const matchIndex = match.index

    // Skip the main component props interface
    if (typeName === `${componentName}Props`) {
      match = interfaceRegex.exec(content)
      continue
    }

    // Extract JSDoc comment before this interface
    const beforeText = content.substring(
      Math.max(0, matchIndex - 500),
      matchIndex
    )
    const jsdocMatch = beforeText.match(/(\/\*\*[\s\S]*?\*\/)\s*$/s)
    let description = ""
    if (jsdocMatch) {
      const jsdocContent = jsdocMatch[1]
      const firstLineMatch = jsdocContent.match(/\*\s*([^*\n]+)/)
      if (firstLineMatch) {
        description = firstLineMatch[1].trim()
      }
    }

    // Extract properties with their inline comments
    const properties = []
    const propLines = typeBody.split("\n")

    for (let i = 0; i < propLines.length; i++) {
      const line = propLines[i].trim()
      if (!line || line.startsWith("//")) continue

      // Check if previous line has a comment
      let propDescription = ""
      if (i > 0) {
        const prevLine = propLines[i - 1].trim()
        const commentMatch = prevLine.match(/\/\*\*\s*([^*]+)\s*\*\//)
        if (commentMatch) {
          propDescription = commentMatch[1].trim()
        }
      }

      // Check for inline comment on same line: /** comment */ prop: type
      const inlineCommentMatch = line.match(
        /\/\*\*\s*([^*]+)\s*\*\/\s*(\w+)\??\s*:\s*([^;,\n}]+)/
      )
      if (inlineCommentMatch) {
        properties.push({
          name: inlineCommentMatch[2],
          type: inlineCommentMatch[3].trim(),
          description: inlineCommentMatch[1].trim(),
          required: !line.includes("?"),
        })
      } else {
        // Regular property without comment: prop?: type
        const propMatch = line.match(/^(\w+)\??\s*:\s*([^;,\n}]+)[;,]?/)
        if (propMatch) {
          properties.push({
            name: propMatch[1],
            type: propMatch[2].trim(),
            description: propDescription || "",
            required: !line.includes("?"),
          })
        }
      }
    }

    types.push({
      name: typeName,
      type: "interface",
      description: description,
      properties: properties,
    })
    match = interfaceRegex.exec(content)
  }

  // Process type aliases (simpler, usually just aliases)
  match = typeRegex.exec(content)
  while (match !== null) {
    const typeName = match[1]

    // Skip if it's a type alias to Props (like PricingPlan = Omit<PricingCardProps, "className">)
    if (
      typeName.includes("Plan") ||
      typeName.includes("Member") ||
      typeName.includes("Post") ||
      typeName.includes("Testimonial")
    ) {
      // Extract JSDoc before type
      const beforeText = content.substring(
        Math.max(0, match.index - 500),
        match.index
      )
      const jsdocMatch = beforeText.match(/(\/\*\*[\s\S]*?\*\/)\s*$/s)
      let description = ""
      if (jsdocMatch) {
        const jsdocContent = jsdocMatch[1]
        const firstLineMatch = jsdocContent.match(/\*\s*([^*\n]+)/)
        if (firstLineMatch) {
          description = firstLineMatch[1].trim()
        }
      }

      types.push({
        name: typeName,
        type: "type",
        description: description,
        properties: [], // Type aliases don't have properties
      })
    }
    match = typeRegex.exec(content)
  }

  return types
}

/**
 * Extract exports from index.ts
 */
async function getExportsFromIndex() {
  const indexPath = join(sectionsDir, "index.ts")
  const content = await readFile(indexPath, "utf-8")
  const exports = {}

  // Parse export statements
  const exportRegex =
    /export\s+(?:type\s+)?\{([^}]+)\}\s+from\s+["']([^"']+)["']/g
  let match = exportRegex.exec(content)

  while (match !== null) {
    const exportList = match[1]
    const fromPath = match[2]

    // Extract individual exports
    exportList.split(",").forEach((exp) => {
      const trimmed = exp.trim()
      const parts = trimmed.split(/\s+as\s+/)
      const exportName = parts[parts.length - 1].trim()

      if (!exports[fromPath]) {
        exports[fromPath] = []
      }
      exports[fromPath].push(exportName)
    })
    match = exportRegex.exec(content)
  }

  return exports
}

/**
 * Extract default values from function parameters
 */
function extractDefaultValues(content, componentName) {
  const defaults = {}
  const functionRegex = new RegExp(
    `export\\s+function\\s+${componentName}\\s*\\(([^)]+)\\)`,
    "s"
  )
  const match = content.match(functionRegex)

  if (match) {
    const params = match[1]
    const paramRegex = /(\w+)\s*=\s*([^,)]+)/g
    let paramMatch = paramRegex.exec(params)

    while (paramMatch !== null) {
      const paramName = paramMatch[1].trim()
      const defaultValue = paramMatch[2].trim()
      defaults[paramName] = defaultValue
      paramMatch = paramRegex.exec(params)
    }
  }

  return defaults
}

/**
 * Process a single component file
 */
async function processComponentFile(filePath, category, exportsMap) {
  try {
    const fileName = basename(filePath, ".tsx")

    // Read raw file content first for JSDoc extraction
    const content = await readFile(filePath, "utf-8")

    // Parse component using react-docgen-typescript
    const parser = parse(filePath, parserOptions)

    if (parser.length === 0) {
      console.warn(`⚠️  No component found in ${filePath}`)
      return null
    }

    const componentDoc = parser[0]
    const componentName = componentDoc.displayName || fileName

    // Extract JSDoc description (from interface, not function)
    const jsdocInfo = extractJSDocDescription(content, componentName)

    // Extract examples from the JSDoc block
    const examples = extractExamplesFromJSDoc(content, componentName)

    // Extract related types
    const relatedTypes = extractRelatedTypes(content, componentName)

    // Extract default values
    const defaultValues = extractDefaultValues(content, componentName)

    // Get exports for this file
    const fileRelativePath = `./${category}/${fileName}`
    const exports = exportsMap[fileRelativePath] || []

    // Use JSDoc description if available, otherwise fallback to react-docgen description
    const fullDescription = jsdocInfo.full || componentDoc.description || ""
    const shortDescription =
      jsdocInfo.short ||
      componentDoc.description?.split("\n")[0] ||
      componentName

    // Helper function to recursively expand nested composite types
    const expandNestedTypes = async (
      properties,
      fileContent,
      relatedTypesMap,
      utilsImports,
      fileDir
    ) => {
      const expanded = []
      for (const prop of properties) {
        const expandedProp = { ...prop }

        // Check if this property has an array type that needs expansion
        const arrayMatch = prop.type.match(/^(\w+)\[\]$/)
        if (arrayMatch) {
          const baseTypeName = arrayMatch[1]

          // First, check related types in the same file
          let nestedType = relatedTypesMap[baseTypeName]

          // If not found, check utils files
          if (!nestedType) {
            for (const [_propsTypeName, importPath] of Object.entries(
              utilsImports
            )) {
              const utilsFilePath = join(
                fileDir,
                "utils",
                importPath.replace(/\.tsx?$/, "") + ".tsx"
              )
              const utilsTypes = await extractAllTypesFromFile(utilsFilePath)
              if (utilsTypes?.[baseTypeName]) {
                nestedType = utilsTypes[baseTypeName]
                break
              }
            }
          }

          // If found, expand it recursively
          if (nestedType?.properties && nestedType.properties.length > 0) {
            // Recursively expand nested properties
            const nestedExpanded = await expandNestedTypes(
              nestedType.properties,
              fileContent,
              relatedTypesMap,
              utilsImports,
              fileDir
            )
            expandedProp.expandedProperties = nestedExpanded
            expandedProp.baseType = baseTypeName
          }
        }

        expanded.push(expandedProp)
      }
      return expanded
    }

    // Build props array with expanded composite types
    const props = []
    if (componentDoc.props) {
      // Extract imports to find utils files
      const importRegex = /import\s+.*?\s+from\s+["']\.\/utils\/([^"']+)["']/g
      const utilsImports = {}
      let importMatch = importRegex.exec(content)
      while (importMatch !== null) {
        const importPath = importMatch[1]
        // Extract Props type name from import (e.g., "type BlogCardProps" or just "BlogCardProps")
        const typeMatch = content
          .substring(
            Math.max(0, importMatch.index - 100),
            importMatch.index + importMatch[0].length
          )
          .match(/type\s+(\w+Props)/)
        if (typeMatch) {
          const propsTypeName = typeMatch[1]
          utilsImports[propsTypeName] = importPath
        }
        importMatch = importRegex.exec(content)
      }

      // Create a map of related types for quick lookup
      const relatedTypesMap = {}
      for (const rt of relatedTypes) {
        relatedTypesMap[rt.name] = rt
      }

      for (const [propName, propInfo] of Object.entries(componentDoc.props)) {
        const propType = propInfo.type?.name || "unknown"
        const prop = {
          name: propName,
          type: propType,
          description: propInfo.description || "",
          required: propInfo.required || false,
          defaultValue:
            defaultValues[propName] || propInfo.defaultValue?.value || null,
        }

        // Expand composite types (arrays of interfaces/types)
        // Check if type ends with [] and extract the base type
        const arrayMatch = propType.match(/^(\w+)\[\]$/)
        if (arrayMatch) {
          const baseTypeName = arrayMatch[1]

          // First, look for the related type definition in the same file
          const relatedType = relatedTypes.find((t) => t.name === baseTypeName)

          if (relatedType?.properties && relatedType.properties.length > 0) {
            // Expand the properties directly into the prop, recursively expanding nested types
            const fileDir = dirname(filePath)
            prop.expandedProperties = await expandNestedTypes(
              relatedType.properties,
              content,
              relatedTypesMap,
              utilsImports,
              fileDir
            )
            prop.baseType = baseTypeName
          } else {
            // If not found in same file, check if it's a Props type from utils
            if (baseTypeName.endsWith("Props") && utilsImports[baseTypeName]) {
              const importPath = utilsImports[baseTypeName]
              const utilsFilePath = join(
                dirname(filePath),
                "utils",
                importPath.replace(/\.tsx?$/, "") + ".tsx"
              )
              const utilsProps = await extractPropsFromUtilsFile(utilsFilePath)
              if (utilsProps?.name === baseTypeName) {
                // Recursively expand nested types in utils props
                const fileDir = dirname(filePath)
                const allUtilsTypes =
                  await extractAllTypesFromFile(utilsFilePath)
                const utilsTypesMap = {}
                for (const [name, typeData] of Object.entries(allUtilsTypes)) {
                  utilsTypesMap[name] = typeData
                }
                prop.expandedProperties = await expandNestedTypes(
                  utilsProps.properties,
                  content,
                  utilsTypesMap,
                  utilsImports,
                  fileDir
                )
                prop.baseType = baseTypeName
              }
            } else {
              // Check if it's a type alias that references a Props type
              const typeAliasRegex = new RegExp(
                `export\\s+type\\s+${baseTypeName}\\s*=\\s*(?:Omit<)?(\\w+Props)`
              )
              const aliasMatch = content.match(typeAliasRegex)
              if (aliasMatch) {
                const propsTypeName = aliasMatch[1]
                // Try to find the Props type in utils files
                if (utilsImports[propsTypeName]) {
                  const importPath = utilsImports[propsTypeName]
                  const utilsFilePath = join(
                    dirname(filePath),
                    "utils",
                    importPath.replace(/\.tsx?$/, "") + ".tsx"
                  )
                  const utilsProps =
                    await extractPropsFromUtilsFile(utilsFilePath)
                  if (utilsProps?.name === propsTypeName) {
                    // Recursively expand nested types in utils props
                    const fileDir = dirname(filePath)
                    const allUtilsTypes =
                      await extractAllTypesFromFile(utilsFilePath)
                    const utilsTypesMap = {}
                    for (const [name, typeData] of Object.entries(
                      allUtilsTypes
                    )) {
                      utilsTypesMap[name] = typeData
                    }
                    prop.expandedProperties = await expandNestedTypes(
                      utilsProps.properties,
                      content,
                      utilsTypesMap,
                      utilsImports,
                      fileDir
                    )
                    prop.baseType = propsTypeName
                  }
                }
              }
            }
          }
        }

        props.push(prop)
      }
    }

    return {
      name: componentName,
      displayName: componentName.replace(/([A-Z])/g, " $1").trim(),
      category: category,
      path: `sections/${category}/${fileName}`,
      fullPath: `src/components/sections/${category}/${fileName}.tsx`,
      description: fullDescription,
      shortDescription: shortDescription,
      props: {
        properties: props,
      },
      relatedTypes: relatedTypes,
      exports: exports,
      examples: examples,
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return null
  }
}

/**
 * Get all main section component files (excluding utils/)
 */
async function getSectionFiles() {
  const files = []
  const entries = await readdir(sectionsDir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name !== "utils") {
      const categoryDir = join(sectionsDir, entry.name)
      const categoryEntries = await readdir(categoryDir)

      for (const file of categoryEntries) {
        if (file.endsWith(".tsx") && !file.includes("utils")) {
          const filePath = join(categoryDir, file)
          const statInfo = await stat(filePath)
          if (statInfo.isFile()) {
            files.push({
              path: filePath,
              category: entry.name,
            })
          }
        }
      }
    }
  }

  return files
}

/**
 * Main function to generate registry
 */
async function generateRegistry() {
  try {
    console.log("📦 Generating section registry...\n")

    // Get all section files
    const sectionFiles = await getSectionFiles()
    console.log(`Found ${sectionFiles.length} section components\n`)

    // Get exports from index.ts
    const exportsMap = await getExportsFromIndex()

    // Process each component
    const sections = []
    for (const file of sectionFiles) {
      console.log(`Processing: ${file.category}/${basename(file.path)}`)
      const sectionData = await processComponentFile(
        file.path,
        file.category,
        exportsMap
      )
      if (sectionData) {
        sections.push(sectionData)
      }
    }

    // Build registry object
    const registry = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      sections: sections.sort(
        (a, b) =>
          a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      ),
    }

    // Write registry file
    await writeFile(registryPath, JSON.stringify(registry, null, 2), "utf-8")

    console.log(`\n✅ Generated registry with ${sections.length} sections`)
    console.log(`📄 Registry saved to: ${registryPath}\n`)
  } catch (error) {
    console.error("Error generating registry:", error)
    process.exit(1)
  }
}

generateRegistry()

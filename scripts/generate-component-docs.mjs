import { readdir, readFile, writeFile, mkdir } from 'fs/promises'
import { join, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const componentsDir = join(rootDir, 'src/components/ui')
const docsDir = join(rootDir, 'docs/components')

// Component name mapping for better display names
const componentNames = {
  'alert-dialog': 'Alert Dialog',
  'button-group': 'Button Group',
  'input-group': 'Input Group',
  'input-otp': 'Input OTP',
  'dropdown-menu': 'Dropdown Menu',
  'context-menu': 'Context Menu',
  'navigation-menu': 'Navigation Menu',
  'radio-group': 'Radio Group',
  'scroll-area': 'Scroll Area',
  'toggle-group': 'Toggle Group',
  'native-select': 'Native Select',
  'aspect-ratio': 'Aspect Ratio',
}

function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function getDisplayName(fileName) {
  const baseName = basename(fileName, '.tsx')
  return componentNames[baseName] || toTitleCase(baseName)
}

async function extractComponentInfo(filePath) {
  const content = await readFile(filePath, 'utf-8')
  const fileName = basename(filePath, '.tsx')
  const displayName = getDisplayName(fileName)
  
  // Extract exports
  const exports = []
  const exportMatches = content.matchAll(/export\s+(?:function|const|type|interface|)\s+(\w+)/g)
  for (const match of exportMatches) {
    exports.push(match[1])
  }
  
  // Extract props from TypeScript interfaces/types
  const props = []
  const propsRegex = /(?:interface|type)\s+(\w+Props?)\s*[={][^}]+}/gs
  const propsMatches = content.matchAll(propsRegex)
  for (const match of propsMatches) {
    props.push(match[1])
  }
  
  // Extract variant props
  const variantMatches = content.matchAll(/variant:\s*\{[^}]+\}/gs)
  const variants = variantMatches ? Array.from(variantMatches).map(m => m[0]) : []
  
  return {
    fileName,
    displayName,
    exports,
    props,
    variants: variants.length > 0,
  }
}

function generateDocContent(info) {
  const { fileName, displayName, exports, variants } = info
  const mainExport = exports.find(e => e === displayName.replace(/\s+/g, '')) || exports[0] || displayName.replace(/\s+/g, '')
  
  return `# ${displayName}

${displayName} component from shadcn/ui.

## Import

\`\`\`tsx
import { ${mainExport} } from "@/components/ui/${fileName}"
\`\`\`

## Usage

### Basic Usage

\`\`\`tsx
<${mainExport}>Content</${mainExport}>
\`\`\`

${variants ? `### Variants

This component supports multiple variants. Check the source code for available options.

\`\`\`tsx
<${mainExport} variant="default">Default</${mainExport}>
\`\`\`

` : ''}## Props

See the component source file for full TypeScript prop definitions:
\`src/components/ui/${fileName}.tsx\`

## Examples

For detailed examples, refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components/${fileName}).

## Source

\`\`\`tsx:src/components/ui/${fileName}.tsx
// See src/components/ui/${fileName}.tsx for the full implementation
\`\`\`
`
}

async function generateDocs() {
  try {
    await mkdir(docsDir, { recursive: true })
    
    const files = await readdir(componentsDir)
    const componentFiles = files.filter(f => f.endsWith('.tsx') && !f.startsWith('_'))
    
    console.log(`Found ${componentFiles.length} components`)
    
    for (const file of componentFiles) {
      const filePath = join(componentsDir, file)
      const info = await extractComponentInfo(filePath)
      const docContent = generateDocContent(info)
      const docPath = join(docsDir, `${info.fileName}.md`)
      
      await writeFile(docPath, docContent, 'utf-8')
      console.log(`Generated: ${docPath}`)
    }
    
    console.log(`\n✅ Generated ${componentFiles.length} component documentation files`)
  } catch (error) {
    console.error('Error generating docs:', error)
    process.exit(1)
  }
}

generateDocs()


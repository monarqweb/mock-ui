<template>
  <div class="demo-container">
    <div class="demo-preview">
      <div class="demo-sandbox">
        <div ref="containerRef" class="demo-content"></div>
      </div>
    </div>
    <div class="demo-code" v-html="highlightedCodeHtml"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { createRoot, type Root } from 'react-dom/client'
import React from 'react'
import { transform } from '@babel/standalone'

const props = defineProps<{
  code: string
  highlighted?: string
  language?: string
}>()

const language = computed(() => props.language || 'tsx')

// Decode highlighted HTML if provided, otherwise fallback to plain code
const highlightedCodeHtml = computed(() => {
  if (props.highlighted) {
    // Decode from base64
    try {
      const decoded = typeof Buffer !== 'undefined'
        ? Buffer.from(props.highlighted, 'base64').toString('utf-8')
        : decodeURIComponent(escape(atob(props.highlighted)))
      return decoded
    } catch (e) {
      // Fallback: try as HTML entities (for backwards compatibility)
      return decodeHtmlEntities(props.highlighted)
    }
  }
  // Fallback: create basic code block structure
  return `<div class="language-${language.value} vp-adaptive-theme">
    <button title="Copy Code" class="copy"></button>
    <span class="lang">${language.value}</span>
    <pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code>${decodedCode.value}</code></pre>
  </div>`
})

// Decode HTML entities for display (works in both SSR and client)
function decodeHtmlEntities(html: string): string {
  // Use manual decoding to ensure all entities are properly decoded
  // This is important for HTML content (like highlighted code) that contains tags
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#10;/g, '\n')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
}

const decodedCode = computed(() => decodeHtmlEntities(props.code))

const containerRef = ref<HTMLElement>()
let reactRoot: Root | null = null

onMounted(() => {
  renderDemo()
})

watch(() => props.code, () => {
  renderDemo()
})

async function renderDemo() {
  if (!containerRef.value) return

  const externalModuleAllowlist: Record<string, () => Promise<any>> = {
  "react": () => import("react"),
  "lucide-react": () => import("lucide-react"),
  "@tabler/icons-react": () => import("@tabler/icons-react"),
  "recharts": () => import("recharts"),
  // add more as you need
}

  await nextTick()

  // Clear previous content
  if (reactRoot) {
    reactRoot.unmount()
    reactRoot = null
  }
  containerRef.value.innerHTML = ''

  try {
    // Use the decoded code
    const code = decodedCode.value
    
    // Extract imports from the code (named, namespace, and default)
    type ImportInfo = 
      | { kind: 'named'; path: string; names: Array<{ local: string; imported?: string }> }
      | { kind: 'namespace'; path: string; name: string }
      | { kind: 'default'; path: string; name: string }
    
    const imports: ImportInfo[] = []
    
    // Named imports: import { A, B as C } from "..."
    const namedImportRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g
    let match
    while ((match = namedImportRegex.exec(code)) !== null) {
      const namesStr = match[1]
      const path = match[2]
      const names = namesStr.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .filter(s => !s.startsWith('type '))
        .map(trimmed => {
          // Strip leading 'type ' defensively (shouldn't happen after filter, but be safe)
          const cleaned = trimmed.replace(/^type\s+/, '')
          const aliasMatch = cleaned.match(/^(.+?)\s+as\s+(.+)$/)
          if (aliasMatch) {
            return { imported: aliasMatch[1].trim(), local: aliasMatch[2].trim() }
          }
          return { local: cleaned }
        })
      imports.push({ kind: 'named', path, names })
    }
    
    // Namespace imports: import * as Name from "..."
    const namespaceImportRegex = /import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g
    while ((match = namespaceImportRegex.exec(code)) !== null) {
      imports.push({ kind: 'namespace', path: match[2], name: match[1] })
    }
    
    // Default imports: import Name from "..."
    const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g
    while ((match = defaultImportRegex.exec(code)) !== null) {
      imports.push({ kind: 'default', path: match[2], name: match[1] })
    }
    
    // Remove all imports from the code to get just the JSX (use fresh regex instances)
    const codeWithoutImports = code
      .replace(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g, '')
      .replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, '')
      .replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g, '')
      .trim()
    
    if (!codeWithoutImports) {
      throw new Error('No JSX code found in demo')
    }
    
    // Detect if this is a module-style demo (has exports)
    const hasExports = /export\s+(?:default\s+)?(?:function|const|class|\w+)/.test(codeWithoutImports)
    
    // Dynamically import all required modules (collect unique paths)
    const importedModules: Record<string, any> = {}
    const uniquePaths = new Set(imports.map(imp => imp.path))
    
    for (const path of uniquePaths) {
      if (path.startsWith('@/components/ui/')) {
        const componentName = path.replace('@/components/ui/', '').replace(/\.tsx$/, '')
        importedModules[path] = await import(`@/components/ui/${componentName}.tsx`)
        continue
      }

      if (path.startsWith('@/lib/')) {
        const filename = path.replace('@/lib/', '').replace(/\.ts$/, '')
        importedModules[path] = await import(`@/lib/${filename}.ts`)
        continue
      }

      if (path.startsWith('@/hooks/')) {
        const filename = path.replace('@/hooks/', '').replace(/\.ts$/, '')
        importedModules[path] = await import(`@/hooks/${filename}.ts`)
        continue
      }

      const loader = externalModuleAllowlist[path]
      if (loader) {
        importedModules[path] = await loader()
        continue
      }

      throw new Error(
        `Cannot resolve import: ${path}. Allowed: @/components/ui/* and ${Object.keys(externalModuleAllowlist).join(", ")}`
      )
    }
    
    // Build the imports context
    const importsContext: Record<string, any> = {}
    for (const imp of imports) {
      const module = importedModules[imp.path]
      
      if (imp.kind === 'named') {
        for (const { local, imported } of imp.names) {
          const exportName = imported || local
          if (!(exportName in module)) {
            throw new Error(`Export "${exportName}" not found in ${imp.path}`)
          }
          importsContext[local] = module[exportName]
        }
      } else if (imp.kind === 'namespace') {
        importsContext[imp.name] = module
      } else if (imp.kind === 'default') {
        if (!('default' in module)) {
          throw new Error(`Default export not found in ${imp.path}`)
        }
        importsContext[imp.name] = module.default
      }
    }
    
    // Rewrite exports to use exports object if module-style
    let codeToTransform = codeWithoutImports
    const exportsToAdd: string[] = []
    
    if (hasExports) {
      // export default function Name(...) { ... }
      codeToTransform = codeToTransform.replace(
        /export\s+default\s+function\s+(\w+)/g,
        (match, name) => {
          exportsToAdd.push(`exports.default = ${name};`)
          return `function ${name}`
        }
      )
      // export function Name(...) { ... }
      codeToTransform = codeToTransform.replace(
        /export\s+function\s+(\w+)/g,
        (match, name) => {
          exportsToAdd.push(`exports.${name} = ${name};`)
          return `function ${name}`
        }
      )
      // export const Name = ...
      codeToTransform = codeToTransform.replace(
        /export\s+const\s+(\w+)/g,
        (match, name) => {
          exportsToAdd.push(`exports.${name} = ${name};`)
          return `const ${name}`
        }
      )
      // export default Name (standalone, after a definition)
      codeToTransform = codeToTransform.replace(
        /export\s+default\s+(\w+)\s*;?/g,
        (match, name) => {
          exportsToAdd.push(`exports.default = ${name};`)
          return ''
        }
      )
      // Append all exports at the end
      if (exportsToAdd.length > 0) {
        codeToTransform = codeToTransform + '\n' + exportsToAdd.join('\n')
      }
    }
    
    // Transform JSX to React.createElement calls using Babel
    let transformedCode = codeToTransform
    try {
      const result = transform(transformedCode, {
        filename: 'demo.tsx',
        presets: ['typescript', 'react'],
      })
      transformedCode = result.code || transformedCode
    } catch (transformError: any) {
      throw new Error(`JSX transformation failed: ${transformError.message}`)
    }
    
    // Create eval function with imports in scope
    const importKeys = Object.keys(importsContext)
    const importValues = importKeys.map(key => importsContext[key])
    
    let element: any
    
    if (hasExports) {
      // Module-style: evaluate with exports object
      const exports: Record<string, any> = {}
      const evalCode = new Function(
        'React',
        ...importKeys,
        'exports',
        transformedCode + '; return exports;'
      )
      
      const exportsObj = evalCode(React, ...importValues, exports)
      
      // Choose component to render based on priority
      let component: any = null
      
      // 1. default export
      if (exportsObj.default) {
        component = exportsObj.default
      }
      // 2. named export "Demo"
      else if (exportsObj.Demo) {
        component = exportsObj.Demo
      }
      // 3. named export "Component"
      else if (exportsObj.Component) {
        component = exportsObj.Component
      }
      // 4. first named export ending with "Demo"
      else {
        const demoExports = Object.keys(exportsObj).filter(k => k.endsWith('Demo'))
        if (demoExports.length > 0) {
          component = exportsObj[demoExports[0]]
        }
      }
      // 5. if exactly one export, use it
      if (!component) {
        const exportKeys = Object.keys(exportsObj).filter(k => k !== 'default')
        if (exportKeys.length === 1) {
          component = exportsObj[exportKeys[0]]
        }
      }
      
      if (!component) {
        const allExports = Object.keys(exportsObj).filter(k => k !== 'default')
        throw new Error(
          `No suitable export found for module-style demo. Found exports: ${allExports.length > 0 ? allExports.join(', ') : 'none'}. ` +
          `Please export a component named "Demo" or ending with "Demo", or provide exactly one named export.`
        )
      }
      
      element = React.createElement(component)
    } else {
      // Expression-style: wrap in return statement if not already returning
      if (!transformedCode.trim().startsWith('return')) {
        transformedCode = `return ${transformedCode}`
      }
      
      const evalCode = new Function(
        'React',
        ...importKeys,
        transformedCode
      )
      
      element = evalCode(React, ...importValues)
    }
    
    if (!element) {
      throw new Error('Demo code did not return a valid React element')
    }
    
    reactRoot = createRoot(containerRef.value)
    reactRoot.render(element)
  } catch (error: any) {
    console.error('Error rendering demo:', error)
    if (containerRef.value) {
      containerRef.value.innerHTML = `<div style="color: #ef4444; padding: 1rem; font-family: ui-monospace, monospace; font-size: 0.875rem; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px;"><strong>Error:</strong> ${error.message}${error.stack ? `<br/><br/><pre style="margin-top: 0.5rem; font-size: 0.75rem; opacity: 0.8;">${error.stack}</pre>` : ''}</div>`
    }
  }
}
</script>

<style scoped>
.demo-container {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}


.demo-preview {
  position: relative;
  z-index: 1;
  padding: 5rem 1.5rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

/* Inside demos, undo unlayered VitePress element resets
and fall back to the layered Tailwind rules. */
.vp-doc .demo-sandbox,
.vp-doc .demo-sandbox :where(*:not(.demo-content)) {
  all: revert-layer;
}

.demo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
}

.demo-code {
  position: relative;
  z-index: 0;
  margin-top: -1px;
}

/* Remove top border radius from code block and ensure border matches */
.demo-code :deep(div[class*="language-"]) {
  border-radius: 0 0 8px 8px;
  border: none;
  border-top: 1px solid var(--vp-c-divider);
  margin: 0;
}
</style>
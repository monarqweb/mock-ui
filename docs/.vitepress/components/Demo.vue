<template>
  <div class="demo-container">
    <div class="demo-preview">
      <div ref="containerRef" class="demo-content"></div>
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
    
    // Extract imports from the code
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g
    const imports: Array<{ names: string[]; path: string }> = []
    let match
    
    // Reset regex
    importRegex.lastIndex = 0
    
    while ((match = importRegex.exec(code)) !== null) {
      const names = match[1].split(',').map(s => s.trim())
      const path = match[2]
      imports.push({ names, path })
    }
    
    // Remove imports from the code to get just the JSX
    const codeWithoutImports = code.replace(importRegex, '').trim()
    
    if (!codeWithoutImports) {
      throw new Error('No JSX code found in demo')
    }
    
    // Dynamically import all required modules
    const importedModules: Record<string, any> = {}
    for (const { path } of imports) {
      if (!importedModules[path]) {
        if (path.startsWith('@/components/ui/')) {
          const componentName = path.replace('@/components/ui/', '').replace(/\.tsx$/, '')
          try {
            importedModules[path] = await import(`@/components/ui/${componentName}.tsx`)
          } catch (importError: any) {
            throw new Error(`Failed to import from ${path}: ${importError.message}`)
          }
        } else {
          throw new Error(`Cannot resolve import: ${path}. Only @/components/ui/* imports are supported.`)
        }
      }
    }
    
    // Build the imports context
    const importsContext: Record<string, any> = {}
    for (const { names, path } of imports) {
      const module = importedModules[path]
      for (const name of names) {
        if (!(name in module)) {
          throw new Error(`Export "${name}" not found in ${path}`)
        }
        importsContext[name] = module[name]
      }
    }
    
    // Transform JSX to React.createElement calls using Babel
    let transformedCode = codeWithoutImports
    try {
      const result = transform(transformedCode, {
        presets: ['react'],
      })
      transformedCode = result.code || transformedCode
    } catch (transformError: any) {
      throw new Error(`JSX transformation failed: ${transformError.message}`)
    }
    
    // Wrap in return statement if not already returning
    if (!transformedCode.trim().startsWith('return')) {
      transformedCode = `return ${transformedCode}`
    }
    
    // Create eval function with imports in scope
    const importKeys = Object.keys(importsContext)
    const importValues = importKeys.map(key => importsContext[key])
    
    const evalCode = new Function(
      'React',
      ...importKeys,
      transformedCode
    )
    
    const element = evalCode(React, ...importValues)
    
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
  overflow: hidden;
}

.demo-preview {
  padding: 1.5rem;
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.demo-content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 60px;
}

.demo-code {
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
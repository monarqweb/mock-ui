import type MarkdownIt from 'markdown-it'

export function demoPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!
  
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx, options, env, self] = args
    const token = tokens[idx]
    
    // Check if this is a demo code block (any language + "demo")
    const tokenInfo = token.info.trim()
    if (tokenInfo.endsWith(' demo')) {
      const code = token.content.trim()
      // Extract the language (remove " demo" from the end)
      const language = tokenInfo.replace(/\s+demo$/, '') || 'tsx'
      
      // Temporarily modify the token to get highlighting
      const originalInfo = token.info
      token.info = language
      
      // Get the highlighted code from VitePress's default renderer
      let highlightedCode = ''
      try {
        highlightedCode = fence(tokens, idx, options, env, self)
      } finally {
        // Restore original token info
        token.info = originalInfo
      }
      
      // Escape the raw code for use in Vue template attribute
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '&#10;')
      
      // Encode highlighted HTML as base64 to avoid attribute truncation issues
      const encodedHighlighted = typeof Buffer !== 'undefined' 
        ? Buffer.from(highlightedCode).toString('base64')
        : btoa(unescape(encodeURIComponent(highlightedCode)))
      
      // Escape language for attribute
      const escapedLanguage = language
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
      
      // Return Vue component with both raw code and base64-encoded highlighted HTML
      return `<Demo code="${escapedCode}" highlighted="${encodedHighlighted}" language="${escapedLanguage}" />`
    }
    
    // Use default fence renderer for other code blocks
    return fence(...args)
  }
}

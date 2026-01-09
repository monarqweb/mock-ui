import { defineConfig } from 'vitepress'
import { readdirSync } from 'fs'
import { join } from 'path'

// Helper function to convert filename to title
function filenameToTitle(filename: string): string {
  // Remove .md extension
  const name = filename.replace(/\.md$/, '')
  
  // Handle special cases
  if (name === 'index') return 'Overview'
  
  // Convert kebab-case to Title Case
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Generate sidebar items from folder structure
function generateSidebarItems(basePath: string): Array<{ text: string; link: string }> {
  const componentsPath = join(process.cwd(), basePath)
  const files = readdirSync(componentsPath)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => {
      // Put index.md first
      if (a === 'index.md') return -1
      if (b === 'index.md') return 1
      // Sort alphabetically
      return a.localeCompare(b)
    })
  
  return files.map(file => {
    const name = file.replace(/\.md$/, '')
    const link = name === 'index' ? '/components/' : `/components/${name}`
    return {
      text: filenameToTitle(file),
      link,
    }
  })
}

export default defineConfig({
  title: 'Component Library',
  description: 'Documentation for UI components',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/components/' },
    ],
    sidebar: {
      '/components/': [
        {
          text: 'Components',
          items: generateSidebarItems('docs/components'),
        },
      ],
    },
  },
})


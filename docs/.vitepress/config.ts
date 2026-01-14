import { defineConfig } from "vitepress"
import { readdirSync, statSync } from "fs"
import { join, resolve, basename, relative } from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { demoPlugin } from "./plugins/demo"

// Helper function to convert filename to title
function filenameToTitle(filename: string): string {
  // Remove .md extension
  const name = filename.replace(/\.md$/, "")

  // Handle special cases
  if (name === "index") return "Overview"

  // Convert kebab-case to Title Case
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Generate sidebar items from folder structure (recursive)
function generateSidebarItems(
  basePath: string
): Array<{ text: string; link: string } | { text: string; items: Array<{ text: string; link: string }> }> {
  const componentsPath = join(process.cwd(), basePath)
  // Extract the directory name from basePath (e.g., "components" from "docs/components")
  const dirName = basename(basePath)
  const items: Array<{ text: string; link: string } | { text: string; items: Array<{ text: string; link: string }> }> = []

  // Collect all markdown files recursively
  function collectFiles(dirPath: string, relativePath: string = ""): Array<{ path: string; relativePath: string; name: string }> {
    const allFiles: Array<{ path: string; relativePath: string; name: string }> = []
    const entries = readdirSync(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)
      
      if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md") {
        const name = entry.name.replace(/\.md$/, "")
        allFiles.push({
          path: fullPath,
          relativePath: relativePath ? `${relativePath}/${name}` : name,
          name,
        })
      } else if (entry.isDirectory()) {
        // Recursively collect files from subdirectories
        const subRelativePath = relativePath ? `${relativePath}/${entry.name}` : entry.name
        allFiles.push(...collectFiles(fullPath, subRelativePath))
      }
    }

    return allFiles
  }

  const allFiles = collectFiles(componentsPath)

  // Group files by their immediate parent directory (relative to basePath)
  const rootFiles: Array<{ text: string; link: string }> = []
  const groupedFiles = new Map<string, Array<{ text: string; link: string }>>()

  for (const file of allFiles) {
    const pathParts = file.relativePath.split("/")
    
    if (pathParts.length === 1) {
      // File is at root level
      rootFiles.push({
        text: filenameToTitle(file.name),
        link: `/${dirName}/${file.relativePath}`,
      })
    } else {
      // File is in a subdirectory - group by first-level directory
      const groupName = pathParts[0]
      const filePath = pathParts.slice(1).join("/")
      
      if (!groupedFiles.has(groupName)) {
        groupedFiles.set(groupName, [])
      }
      
      groupedFiles.get(groupName)!.push({
        text: filenameToTitle(file.name),
        link: `/${dirName}/${file.relativePath}`,
      })
    }
  }

  // Add index.md link at the beginning if it exists
  const indexPath = join(componentsPath, "index.md")
  try {
    if (statSync(indexPath).isFile()) {
      items.push({
        text: "Overview",
        link: `/${dirName}/`,
      })
    }
  } catch {
    // index.md doesn't exist, skip
  }

  // Add root-level files
  rootFiles.sort((a, b) => a.text.localeCompare(b.text))
  items.push(...rootFiles)

  // Add grouped files
  const sortedGroups = Array.from(groupedFiles.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  for (const [groupName, groupItems] of sortedGroups) {
    groupItems.sort((a, b) => a.text.localeCompare(b.text))
    items.push({
      text: filenameToTitle(groupName),
      items: groupItems,
    })
  }

  return items
}

export default defineConfig({
  title: "Chrysalis",
  description: "UI components for Monarq Web Design",
  base: "/mock-ui/",

  vite: {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../src"),
      },
    },
  },

  markdown: {
    config: (md) => {
      md.use(demoPlugin)
    },
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: "Home", link: "/" },
      { text: "Components", link: "/components/" },
      { text: "Blocks", link: "/blocks/" },
      { text: "Demo", link: "/demo/" },
    ],
    sidebar: {
      "/components/": [
        {
          text: "Components",
          items: generateSidebarItems("docs/components"),
        },
      ],
      "/blocks/": generateSidebarItems("docs/blocks"),
    },
  },
})

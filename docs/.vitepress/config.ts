import { defineConfig } from "vitepress"
import { readdirSync } from "fs"
import { join, resolve, basename } from "path"
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

// Generate sidebar items from folder structure
function generateSidebarItems(
  basePath: string
): Array<{ text: string; link: string }> {
  const componentsPath = join(process.cwd(), basePath)
  // Extract the directory name from basePath (e.g., "components" from "docs/components")
  const dirName = basename(basePath)
  const files = readdirSync(componentsPath)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => {
      // Put index.md first
      if (a === "index.md") return -1
      if (b === "index.md") return 1
      // Sort alphabetically
      return a.localeCompare(b)
    })

  return files.map((file) => {
    const name = file.replace(/\.md$/, "")
    const link = name === "index" ? `/${dirName}/` : `/${dirName}/${name}`
    return {
      text: filenameToTitle(file),
      link,
    }
  })
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
      { text: "Sections", link: "/sections/" },
    ],
    sidebar: {
      "/components/": [
        {
          text: "Components",
          items: generateSidebarItems("docs/components"),
        },
      ],
      "/sections/": [
        {
          text: "Sections",
          items: generateSidebarItems("docs/sections"),
        },
      ],
    },
  },
})

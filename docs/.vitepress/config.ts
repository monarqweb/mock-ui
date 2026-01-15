import { defineConfig } from "vitepress"
import { resolve } from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

import { demoPlugin } from "./plugins/demo"
import { generateSidebarItems } from "./utils/sidebar"
import { componentIntroPlugin } from "./plugins/component-intro"
import { propsTablePlugin } from "./plugins/props-table"

export default defineConfig({
  title: "Chrysalis",
  description: "UI components for Monarq Web Design",
  base: "/chrysalis/",

  vite: {
    plugins: [
      react(),
      tailwindcss()
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "../../src"),
      },
    },
  },

  markdown: {
    config: (md) => {
      md.use(demoPlugin),
      md.use(componentIntroPlugin),
      md.use(propsTablePlugin)
    },
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: "Guide", link: "/guide/introduction/what-is-chrysalis" },
      { text: "Components", link: "/components/" },
      { text: "Blocks", link: "/blocks/introduction/what-are-blocks" },
    ],
    sidebar: {
      "/guide/": generateSidebarItems("docs/guide/"),
      "/components/": generateSidebarItems("docs/components/"),
      "/blocks/": generateSidebarItems("docs/blocks"),
      
    },
  },
})

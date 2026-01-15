import { defineConfig } from "vitepress"
import { resolve } from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// Component Plugins
import { demoPlugin } from "./plugins/demo"
import { generateSidebarItems } from "./utils/sidebar"
import { componentIntroPlugin } from "./plugins/component-intro"
import { propsTablePlugin } from "./plugins/props-table"
import { eventsTablePlugin } from "./plugins/events-table"
import { taxonomyTablePlugin } from "./plugins/taxonomy-table"
import { typesTablePlugin } from "./plugins/types-table"
import { componentApiReferencePlugin } from "./plugins/component-api-reference"

// Taxonomy Plugins
import { definitionsTablePlugin } from "./plugins/definitions-table"

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
      md.use(demoPlugin)
      md.use(componentIntroPlugin)
      md.use(propsTablePlugin)
      md.use(eventsTablePlugin)
      md.use(taxonomyTablePlugin)
      md.use(typesTablePlugin)
      md.use(componentApiReferencePlugin)
      md.use(definitionsTablePlugin)
    },
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: "Components", link: "/components/" },
      { text: "Blocks", link: "/blocks/introduction/what-are-blocks" },
      { text: "Taxonomy", link: "/taxonomy/" },
    ],
    sidebar: {
      "/components/": generateSidebarItems("docs/components/"),
      "/blocks/": generateSidebarItems("docs/blocks"),
      "/taxonomy/": generateSidebarItems("docs/taxonomy/"),
    },
  },
})

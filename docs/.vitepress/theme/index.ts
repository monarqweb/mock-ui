import DefaultTheme from "vitepress/theme"
import "vitepress/dist/client/theme-default/styles/fonts.css"
import "vitepress/dist/client/theme-default/styles/vars.css"
import "vitepress/dist/client/theme-default/styles/base.css"
import "vitepress/dist/client/theme-default/styles/icons.css"
import "vitepress/dist/client/theme-default/styles/utils.css"
import "vitepress/dist/client/theme-default/styles/components/custom-block.css"
import "vitepress/dist/client/theme-default/styles/components/vp-code.css"
import "vitepress/dist/client/theme-default/styles/components/vp-code-group.css"
import "vitepress/dist/client/theme-default/styles/components/vp-doc.css"
import "vitepress/dist/client/theme-default/styles/components/vp-sponsor.css"
import "./style.css" // your Tailwind + overrides load after

import Demo from "../components/Demo.vue"

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("Demo", Demo)
  },
}

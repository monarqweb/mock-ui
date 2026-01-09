import DefaultTheme from 'vitepress/theme'
import '../../../src/index.css'
import Demo from '../components/Demo.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('Demo', Demo)
  },
}

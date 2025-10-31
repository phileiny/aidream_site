import { h, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import type { Theme } from 'vitepress'

// @ts-ignore - Vue 組件導入
import VisitorCounter from '../components/VisitorCounter.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    const { frontmatter } = useData()
    const route = useRoute()
    
    // 檢查是否是首頁
    const isHome = computed(() => {
      return frontmatter.value.layout === 'home' || route.path === '/' || route.path === '/index.html'
    })
    
    return h(DefaultTheme.Layout, null, {
      // 只在 layout-bottom slot 中添加訪客計數器（避免重複）
      'layout-bottom': () => {
        if (isHome.value) {
          return h('div', { style: 'margin-top: 3rem;' }, [h(VisitorCounter)])
        }
        return null
      },
    })
  },
  enhanceApp({ app }) {
    // 全局註冊組件，以便在 markdown 中使用
    app.component('VisitorCounter', VisitorCounter)
  },
} satisfies Theme

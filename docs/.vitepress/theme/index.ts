import { h, computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useData, useRoute } from 'vitepress'
import type { Theme } from 'vitepress'

// @ts-ignore - Vue 組件導入

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
      // layout-bottom slot removed
    })
  },
  enhanceApp({ app }) {
    // 全局註冊組件，以便在 markdown 中使用
  },
} satisfies Theme

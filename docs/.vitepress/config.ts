import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '星智未來',
  description: '星智未來｜以 AI 與工程實踐創造價值',
  lang: 'zh-Hant',
  // 若部署在 GitHub Pages 子路徑（https://<user>.github.io/<repo>/），需設定 base
  // 將 <repo> 改為你的 Repo 名稱
  base: '/aidream_site/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://phileiny.github.io/aidream_site' }, // GitHub Pages 網址
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX' }],
    ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config','G-XXXXXXX');`],
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#111827' }],
    ['meta', { property: 'og:title', content: '星智未來' }],
    ['meta', { property: 'og:description', content: '星智未來｜以 AI 與工程實踐創造價值' }]
  ],
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'InsightCosmos' },
    nav: [
      { text: 'AI', link: '/ai/' },
      { text: '機器人', link: '/robot/' },
      { text: '專案', link: '/project/' },
      { text: '關於', link: '/about' }
    ],
    sidebar: {
      '/ai/': [
        {
          text: 'AI Articles',
          items: [
            { text: 'Index', link: '/ai/' },
            { text: 'Embedding Atlas：讓 AI 幫你把大量文字變成一張藏寶圖', link: '/ai/embedding-atlas-intro' },
            { text: 'Context7 MCP：讓 AI 程式助手不再寫出過時的程式碼', link: '/ai/context7-mcp-guide' },
            { text: 'Claude Opus 4.5 正式發布', link: '/ai/Claude-Opus-4.5-發布記錄' },
            { text: '5 天 Google AI Agent 學習旅程', link: '/ai/5D_AI_Agent_Summary' }
          ]
        }
      ],
      '/robot/': [
        {
          text: 'Robot Articles',
          items: [
            { text: 'Index', link: '/robot/' },
            { text: 'VLA 技術深度解析：從原理到 Mantis 實戰應用', link: '/robot/VLA技術深度解析_從原理到Mantis實戰應用' }
          ]
        }
      ],
      '/project/': [
        {
          text: 'Project Articles',
          items: [
            { text: 'Index', link: '/project/' },
            { text: '從單一 AI Agent 到專家團隊：咩猛Memo 架構演進之路', link: '/project/multi-agent-architecture' },
            { text: 'InsightCosmos 專案發想', link: '/project/InsightCosmos_Full_Writeup_FULL_zh_TW' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname' }
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: '© ' + new Date().getFullYear() + ' 星智未來'
    },
    search: { provider: 'local' }
  }
})
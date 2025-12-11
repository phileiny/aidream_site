import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '星智未來',
  description: '星智未來｜以 AI 與工程實踐創造價值',
  lang: 'zh-Hant',
  // 使用自訂網域時，base 設為 '/'
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: 'https://blog.aidream.com.tw' },
  head: [
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-LQETK33MRL' }],
    ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config','G-LQETK33MRL');`],
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
      { text: '學習', link: '/learning/' },
      { text: '關於', link: '/about' }
    ],
    sidebar: {
      '/ai/': [
        {
          text: 'AI Articles',
          items: [
            { text: 'Index', link: '/ai/' },
            { text: 'World Model：通往 AGI 的關鍵賽道', link: '/ai/world-model-agi-blog' },
            { text: '從《The Thinking Game》看 AGI：一場潛能的挖掘與覺醒', link: '/ai/agi-awakening-blog' },
            { text: '多代理系統架構設計與 A2A / MCP 協議:給 AI 應用開發團隊的實戰指南', link: '/ai/multi-agent-a2a-protocol-blog' },
            { text: 'Embedding Atlas:讓 AI 幫你把大量文字變成一張藏寶圖', link: '/ai/embedding-atlas-intro' },
            { text: 'Context7 MCP:讓 AI 程式助手不再寫出過時的程式碼', link: '/ai/context7-mcp-guide' },
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
            { text: '台灣 AI 機器人產業全景:從政策到落地的關鍵布局', link: '/robot/taiwan-ai-robotics-blog' },
            { text: 'VLA 技術深度解析:從原理到 Mantis 實戰應用', link: '/robot/VLA技術深度解析_從原理到Mantis實戰應用' }
          ]
        }
      ],
      '/project/': [
        {
          text: 'Project Articles',
          items: [
            { text: 'Index', link: '/project/' },
            { text: '破解配送機器人的 2.4G 本地通訊協議：一場逆向工程的冒險', link: '/project/yogo-2.4g-reverse-engineering-blog' },
            { text: '用滑鼠畫軌道，讓彈珠滾起來——我的彈珠雲霄飛車模擬器', link: '/project/marble-run-blog' },
            { text: 'Vibe Coding 實戰指南:PIV 框架與三大黃金法則', link: '/project/vibe-coding-piv-framework' },
            { text: '從單一 AI Agent 到專家團隊:咩猛Memo 架構演進之路', link: '/project/multi-agent-architecture' },
            { text: 'InsightCosmos 專案發想', link: '/project/InsightCosmos_Full_Writeup_FULL_zh_TW' }
          ]
        }
      ],
      '/learning/': [
        {
          text: '學習專區',
          items: [
            { text: 'Index', link: '/learning/' }
          ]
        },
        {
          text: 'CS336 學習筆記',
          collapsed: false,
          items: [
            { text: '總覽', link: '/learning/cs336/' },
            { text: '先修攻略：我的 LLM 自學先修計畫', link: '/learning/cs336/CS336_Learning_Path_Blog' },
            { text: 'Week 1：Micrograd 深度拆解', link: '/learning/cs336/CS336_Week1_Micrograd_Deep_Dive' }
          ]
        }
      ]
    },
    footer: {
      message: 'MIT Licensed',
      copyright: '© ' + new Date().getFullYear() + ' 星智未來'
    },
    search: { provider: 'local' }
  }
})
import { defineConfig, type HeadConfig } from 'vitepress'

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
    // Google Analytics
    ['script', { async: '', src: 'https://www.googletagmanager.com/gtag/js?id=G-LQETK33MRL' }],
    ['script', {}, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config','G-LQETK33MRL');`],

    // Basic SEO
    ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['meta', { name: 'author', content: '星智未來' }],
    ['meta', { name: 'keywords', content: 'AI, 人工智慧, 機器人, LLM, 大型語言模型, AI Agent, 機器學習, 深度學習, 星智未來' }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'googlebot', content: 'index, follow' }],

    // Favicon & Theme
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#111827' }],

    // Open Graph (default values, will be overridden per page)
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: '星智未來' }],
    ['meta', { property: 'og:locale', content: 'zh_TW' }],
    ['meta', { property: 'og:title', content: '星智未來' }],
    ['meta', { property: 'og:description', content: '星智未來｜以 AI 與工程實踐創造價值' }],
    ['meta', { property: 'og:url', content: 'https://blog.aidream.com.tw' }],
    ['meta', { property: 'og:image', content: 'https://blog.aidream.com.tw/og-image.png' }],

    // Twitter Card
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: '星智未來' }],
    ['meta', { name: 'twitter:description', content: '星智未來｜以 AI 與工程實踐創造價值' }],
    ['meta', { name: 'twitter:image', content: 'https://blog.aidream.com.tw/og-image.png' }],

    // JSON-LD Organization Schema
    ['script', { type: 'application/ld+json' }, JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': '星智未來',
      'url': 'https://blog.aidream.com.tw',
      'logo': 'https://blog.aidream.com.tw/logo.svg',
      'sameAs': [
        'https://aidream.com.tw'
      ],
      'description': '星智未來專注於 AI 應用工程、雲端與整合服務，以工程實踐創造價值。'
    })]
  ],
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'InsightCosmos' },
    nav: [
      { text: '官網', link: 'https://aidream.com.tw/' },
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
            { text: '當世界開始重新洗牌，台灣在哪裡？——風傳媒「劇變與解方」論壇現場筆記', link: '/ai/風傳媒論壇_部落格_20260311' },
            { text: 'AI 沒有任何東西是「人工的」——李飛飛 2018 國會聽證會的五大預言，八年後全部命中', link: '/ai/ai-nothing-artificial-feifei-li' },
            { text: '以易經八卦推演 AI 文明的前世今生與未來', link: '/ai/iching-framework-for-ai-evolution' },
            { text: 'AI 時代的哲學復興：當形上學走出象牙塔', link: '/ai/ai-philosophical-renaissance' },
            { text: '當 AI 飛向太空：nanoGPT 上軌道背後的科技巨頭競賽', link: '/ai/space-ai-race-blog' },
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
            { text: '中國具身智能的兩條路線:MotuBrain vs 自變量', link: '/robot/中國具身智能兩條路線' },
            { text: '機器人沒有 MMLU:當 Benchmark 還沒有共識的時候，我們該怎麼看「世界第一」？', link: '/robot/機器人沒有MMLU' },
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
            { text: '為什麼每天摸一下貓的頭，是一件宇宙學意義的事', link: '/project/migato-cosmic-ritual' },
            { text: '我把上一篇刪掉的那一步，加了回來', link: '/project/storyboard-before-render' },
            { text: '我刪掉了 AI 影片製作工作流裡最貴的那一步', link: '/project/minimax-h3-ref2va' },
            { text: '為什麼我花兩美金租 GPU，而不是花十二萬買一張', link: '/project/minimax-h3-third-path' },
            { text: '我的第一個 Upwork Proposal', link: '/project/my_first_upwork_post' },
            { text: '你不是在觀看這個世界，你是在渲染它', link: '/project/participatory-universe-v2' },
            { text: '從混沌到秩序：咩猛 Memo 開發實錄', link: '/project/memobot-development-journey' },
            { text: '從劇本到成品：我用 AI 工具打造動畫短影片的完整工作流', link: '/project/ai-animation-workflow-blog' },
            { text: '微微創公司的 AI 生存指南：不建護城河，建關係', link: '/project/micro-startup-ai-era' },
            { text: 'AI 時代的軟體開發革命：有經驗開發者的新機會', link: '/project/ai_software_development_blog' },
            { text: '從零開始搞懂 GitHub 協作：開源新手必讀的名詞大全', link: '/project/github-collaboration-blog' },
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
            { text: 'Index', link: '/learning/' },
            { text: 'Git × Claude Code — 版控入門指南', link: '/learning/git-claude-code-guide.html' },
            { text: '深度學習核心概念完全指南', link: '/learning/deep_learning_for_beginners' }
          ]
        },
        {
          text: '神經網路學習筆記',
          collapsed: false,
          items: [
            { text: '總覽', link: '/learning/micrograd_visualize/' },
            { text: '系列導覽', link: '/learning/micrograd_visualize/00-overview' },
            { text: '一個神經元是如何思考的？', link: '/learning/micrograd_visualize/01-multi-input-neuron' },
            { text: '為什麼激活函數如此重要？', link: '/learning/micrograd_visualize/02-activation-functions' },
            { text: '梯度下降——順著山坡找谷底', link: '/learning/micrograd_visualize/03-gradient-descent' },
            { text: '反向傳播——誰該為錯誤負責？', link: '/learning/micrograd_visualize/04-backpropagation' },
            { text: '計算圖——自動微分', link: '/learning/micrograd_visualize/05-computation-graph' },
            { text: '實戰——訓練神經網路', link: '/learning/micrograd_visualize/06-mlp-training' }
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
  },

  // Dynamic SEO per page
  transformPageData(pageData) {
    const canonicalUrl = `https://blog.aidream.com.tw/${pageData.relativePath}`
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')

    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: canonicalUrl }],
      ['meta', { property: 'og:url', content: canonicalUrl }]
    ]

    // Add page-specific title and description if available
    if (pageData.frontmatter.description) {
      head.push(['meta', { property: 'og:description', content: pageData.frontmatter.description }])
      head.push(['meta', { name: 'twitter:description', content: pageData.frontmatter.description }])
    }

    if (pageData.title) {
      const fullTitle = `${pageData.title} | 星智未來`
      head.push(['meta', { property: 'og:title', content: fullTitle }])
      head.push(['meta', { name: 'twitter:title', content: fullTitle }])
    }

    // Set og:type to article for blog posts and add Article JSON-LD
    if (pageData.relativePath.match(/^(ai|robot|project|learning)\//) && !pageData.relativePath.endsWith('index.md')) {
      head.push(['meta', { property: 'og:type', content: 'article' }])

      // Article JSON-LD schema
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': pageData.title || '',
        'description': pageData.frontmatter.description || '',
        'url': canonicalUrl,
        'author': {
          '@type': 'Organization',
          'name': '星智未來',
          'url': 'https://blog.aidream.com.tw'
        },
        'publisher': {
          '@type': 'Organization',
          'name': '星智未來',
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://blog.aidream.com.tw/logo.svg'
          }
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': canonicalUrl
        }
      }
      head.push(['script', { type: 'application/ld+json' }, JSON.stringify(articleSchema)])
    }

    pageData.frontmatter.head = head
  }
})

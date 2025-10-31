import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '星智未來 Aidream',
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
      ['script', { async: '', src: 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js' }],
      ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#111827' }],
    ['meta', { property: 'og:title', content: '星智未來 Aidream' }],
    ['meta', { property: 'og:description', content: '星智未來｜以 AI 與工程實踐創造價值' }]
  ],
  themeConfig: {
    logo: { src: '/logo.svg', alt: 'Aidream' },
    nav: [
        { text: '服務', link: '/services' },
        { text: '案例', link: '/cases' },
        { text: '文章', link: '/posts/' },
        { text: '關於', link: '/about' },
        { text: '聯絡', link: '/contact' }
      ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourname' }
    ],
    footer: {
      message: 'MIT Licensed',
      copyright: '© ' + new Date().getFullYear() + ' 星智未來 Aidream'
    },
    search: { provider: 'local' }
  }
})
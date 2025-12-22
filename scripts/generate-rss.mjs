
import fs from 'node:fs'
import path from 'node:path'

// Generate a minimal RSS feed from docs/posts/*.md
const postsDir = path.resolve('docs/posts')
const outFile = path.resolve('docs/.vitepress/dist/feed.xml')
const site = 'https://your-domain.example' // TODO: replace
const title = '星智未來 Aidream'
const desc = '星智未來｜以 AI 與工程實踐創造價值'

function mdToTitle(md) {
  const m = md.match(/^#\s+(.+)$/m)
  return m ? m[1].trim() : '未命名文章'
}

function mdToSummary(md) {
  const lines = md.split('\n')
  const content = lines.slice(0, 50).join(' ').replace(/<[^>]*>/g,'')
  return content.substring(0, 200)
}

function fileMTimeISO(p) {
  const st = fs.statSync(p)
  return new Date(st.mtime).toISOString()
}

function slugify(name) {
  return name.replace(/\.md$/, '')
}

const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
const items = files.map(f => {
  const full = path.join(postsDir, f)
  const md = fs.readFileSync(full, 'utf-8')
  const url = site + '/posts/' + slugify(f)
  return {
    url,
    title: mdToTitle(md),
    date: fileMTimeISO(full),
    summary: mdToSummary(md)
  }
})

const rssItems = items.map(it => `
  <item>
    <title><![CDATA[${it.title}]]></title>
    <link>${it.url}</link>
    <guid>${it.url}</guid>
    <pubDate>${new Date(it.date).toUTCString()}</pubDate>
    <description><![CDATA[${it.summary}]]></description>
  </item>
`).join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title><![CDATA[${title}]]></title>
    <link>${site}</link>
    <description><![CDATA[${desc}]]></description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`

fs.mkdirSync(path.dirname(outFile), { recursive: true })
fs.writeFileSync(outFile, rss, 'utf-8')
console.log('RSS generated at', outFile)

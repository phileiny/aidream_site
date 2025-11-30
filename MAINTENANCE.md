# 星智未來 Aidream 網站維護手冊

本文件提供網站維護、更新和故障排除的完整指南。

---

## 目錄

- [專案概述](#專案概述)
- [環境設置](#環境設置)
- [本地開發](#本地開發)
- [內容管理](#內容管理)
- [自定義與擴展](#自定義與擴展)
- [部署流程](#部署流程)
- [訪客計數器](#訪客計數器)
- [常見問題排查](#常見問題排查)
- [更新與升級](#更新與升級)

---

## 專案概述

### 技術棧
- **框架**: VitePress 1.3.4
- **語言**: TypeScript, Markdown
- **部署**: GitHub Pages
- **統計**: 不蒜子 (Busuanzi)

### 專案結構
```
aidream-site/
├── docs/                          # 網站內容目錄
│   ├── .vitepress/               # VitePress 配置
│   │   ├── config.ts             # 主要配置文件
│   │   ├── components/           # 自定義組件
│   │   ├── theme/                 # 自定義主題
│   │   │   ├── index.ts
│   │   │   └── components/
│   │   └── cache/                 # 構建緩存（自動生成）
│   ├── ai/                        # AI 文章分類
│   │   ├── index.md              # AI 分類索引頁
│   │   ├── context7-mcp-guide.md
│   │   ├── Claude-Opus-4.5-發布記錄.md
│   │   └── 5D_AI_Agent_Summary.md
│   ├── robot/                     # 機器人文章分類
│   │   └── index.md              # 機器人分類索引頁
│   ├── project/                   # 專案文章分類
│   │   ├── index.md              # 專案分類索引頁
│   │   └── InsightCosmos_Full_Writeup_FULL_zh_TW.md
│   ├── posts/                     # 舊文章目錄（保留相容性）
│   ├── public/                    # 靜態資源
│   │   ├── images/                # 圖片資源
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── index.md                   # 首頁
│   ├── about.md                   # 關於頁面
│   ├── services.md                # 服務頁面
│   ├── cases.md                   # 案例頁面
│   └── contact.md                # 聯絡頁面
├── scripts/                       # 構建腳本
│   └── generate-rss.mjs          # RSS 生成
├── .github/
│   └── workflows/
│       └── deploy.yml             # 自動部署工作流
├── package.json
├── MAINTENANCE.md                 # 本維護手冊
└── README.md
```

### 網站架構說明

本網站採用**分類架構**，主要內容分為三大分類：

1. **AI 分類** (`/ai/`)：人工智慧相關文章
2. **機器人分類** (`/robot/`)：機器人技術相關文章
3. **專案分類** (`/project/`)：專案發想與實作記錄

每個分類都有：
- 獨立的目錄結構 (`docs/ai/`, `docs/robot/`, `docs/project/`)
- 分類索引頁面 (`index.md`)
- 獨立的側邊欄配置 (在 `config.ts` 中設定)

---

## 環境設置

### 系統需求
- Node.js 18+ （推薦 20+）
- npm 或 yarn
- Git

### 初始設置

1. **克隆專案**
   ```bash
   git clone git@github.com:phileiny/aidream_site.git
   cd aidream-site
   ```

2. **安裝依賴**
   ```bash
   npm install
   ```

3. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   訪問 http://localhost:5173

---

## 本地開發

### 開發命令

```bash
# 啟動開發伺服器（支援熱重載）
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 生成 RSS feed
npm run rss
```

### 開發流程

1. 創建新分支進行開發
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 本地測試所有變更
   ```bash
   npm run dev  # 檢查開發環境
   npm run build && npm run preview  # 檢查生產構建
   ```

3. 提交並推送
   ```bash
   git add .
   git commit -m "描述你的變更"
   git push origin feature/your-feature-name
   ```

4. 合併到 main 後自動部署

---

## 內容管理

### 添加新文章到分類（AI / 機器人 / 專案）

本網站採用分類架構，文章分為三個主要分類：AI、機器人（Robot）、專案（Project）。以下以添加 AI 文章為例，其他分類流程相同。

#### 步驟 1：創建文章文件

在對應的分類目錄下創建 `.md` 文件：

```bash
# AI 文章
docs/ai/your-article.md

# 機器人文章
docs/robot/your-article.md

# 專案文章
docs/project/your-article.md
```

#### 步驟 2：撰寫文章內容

文章開頭使用標題（不需要 frontmatter）：

```markdown
# 文章標題

## 第一節

文章內容...
```

#### 步驟 3：更新分類索引頁面

編輯對應分類的 `index.md`，將新文章添加到 **Recent Posts 列表的最上方**：

**AI 文章：** 編輯 `docs/ai/index.md`
```markdown
## Recent Posts

- [新文章標題](./your-article)
- [Context7 MCP：讓 AI 程式助手不再寫出過時的程式碼](./context7-mcp-guide)
- [Claude Opus 4.5 正式發布](./Claude-Opus-4.5-發布記錄)
```

**機器人文章：** 編輯 `docs/robot/index.md`
```markdown
## Recent Posts

- [新文章標題](./your-article)
*Coming soon...*
```

**專案文章：** 編輯 `docs/project/index.md`
```markdown
## Recent Posts

- [新文章標題](./your-article)
- [InsightCosmos 專案發想](./InsightCosmos_Full_Writeup_FULL_zh_TW)
```

#### 步驟 4：更新側邊欄配置

編輯 `docs/.vitepress/config.ts`，在對應分類的 sidebar 中添加文章連結（添加在 Index 之後）：

**AI 文章：**
```typescript
sidebar: {
  '/ai/': [
    {
      text: 'AI Articles',
      items: [
        { text: 'Index', link: '/ai/' },
        { text: '新文章標題', link: '/ai/your-article' },  // 新增這行
        { text: 'Context7 MCP：讓 AI 程式助手不再寫出過時的程式碼', link: '/ai/context7-mcp-guide' },
        // ... 其他文章
      ]
    }
  ],
  // ...
}
```

**機器人文章：**
```typescript
sidebar: {
  '/robot/': [
    {
      text: 'Robot Articles',
      items: [
        { text: 'Index', link: '/robot/' },
        { text: '新文章標題', link: '/robot/your-article' },  // 新增這行
        // ... 其他文章
      ]
    }
  ],
  // ...
}
```

**專案文章：**
```typescript
sidebar: {
  '/project/': [
    {
      text: 'Project Articles',
      items: [
        { text: 'Index', link: '/project/' },
        { text: '新文章標題', link: '/project/your-article' },  // 新增這行
        { text: 'InsightCosmos 專案發想', link: '/project/InsightCosmos_Full_Writeup_FULL_zh_TW' },
        // ... 其他文章
      ]
    }
  ],
  // ...
}
```

#### 步驟 5：本地預覽

```bash
# 開發伺服器會自動重新載入
# 訪問 http://localhost:5173 檢查：
# 1. 分類索引頁面是否顯示新文章
# 2. 側邊欄是否顯示新文章連結
# 3. 文章內容是否正確顯示
```

#### 快速檢查清單

添加新文章時，確保完成以下三個步驟：

- [ ] 在 `docs/{分類}/` 目錄下創建文章 `.md` 文件
- [ ] 更新 `docs/{分類}/index.md` 的 Recent Posts 列表（添加到最上方）
- [ ] 更新 `docs/.vitepress/config.ts` 的 sidebar 配置（添加到 Index 之後）

### 添加新頁面

1. **創建頁面文件**
   在 `docs/` 目錄下創建新的 `.md` 文件，例如：
   ```bash
   docs/new-page.md
   ```

2. **更新導航**
   編輯 `docs/.vitepress/config.ts`，在 `themeConfig.nav` 中添加：
   ```typescript
   nav: [
     // ... 其他導航項
     { text: '新頁面', link: '/new-page' }
   ]
   ```

### 添加圖片

1. **上傳圖片**
   將圖片放入 `docs/public/images/` 目錄

2. **在 Markdown 中引用**
   ```markdown
   ![圖片描述](/images/your-image.png)
   ```

#### ⚠️ 圖片放置重要規則

**正確做法 ✅**：
- 所有圖片必須放在 `docs/public/images/` 目錄下
- 使用絕對路徑 `/images/filename.png` 引用圖片
- 圖片檔名使用小寫英文、數字和連字符（kebab-case）

**錯誤做法 ❌**：
- ❌ 使用相對路徑：`./image.png` 或 `../images/image.png`
- ❌ 將圖片放在文章同目錄：`docs/ai/image.png`
- ❌ 使用中文檔名或空格

**範例**：

```markdown
<!-- ✅ 正確：使用絕對路徑 -->
![Claude Opus 4.5 狀態](/images/claude-opus-4.5-status.png)

<!-- ❌ 錯誤：使用相對路徑 -->
![錯誤示範](./terminal-screenshot.png)

<!-- ❌ 錯誤：圖片不在 public/images 目錄 -->
![錯誤示範](/ai/screenshot.png)
```

**檢查清單**：
- [ ] 圖片已放入 `docs/public/images/` 目錄
- [ ] 使用 `/images/` 開頭的絕對路徑
- [ ] 檔名使用 kebab-case（小寫加連字符）
- [ ] 在本地開發環境測試圖片是否正常顯示
- [ ] 執行 `npm run build` 確認沒有構建錯誤


### 修改首頁

編輯 `docs/index.md` 的 frontmatter：
```yaml
---
layout: home
title: 星智未來 Aidream
hero:
  name: 星智未來 Aidream
  text: 你的標語
  tagline: 你的副標語
  actions:
    - theme: brand
      text: 按鈕文字
      link: /posts/
features:
  - title: 特色1
    details: 描述1
  - title: 特色2
    details: 描述2
---
```

---

## 自定義與擴展

### 修改主題配置

編輯 `docs/.vitepress/config.ts`：

```typescript
export default defineConfig({
  title: '你的網站標題',
  description: '網站描述',
  base: '/aidream_site/',  // GitHub Pages 子路徑
  themeConfig: {
    nav: [/* 導航配置 */],
    footer: { /* 頁腳配置 */ },
    // ... 其他配置
  }
})
```

### 自定義組件

1. **創建組件**
   在 `docs/.vitepress/components/` 創建 `.vue` 文件

2. **在 Markdown 中使用**
   ```markdown
   <script setup>
   import MyComponent from './.vitepress/components/MyComponent.vue'
   </script>
   
   <MyComponent />
   ```

3. **全局註冊組件**
   在 `docs/.vitepress/theme/index.ts` 中：
   ```typescript
   enhanceApp({ app }) {
     app.component('MyComponent', MyComponent)
   }
   ```

### 自定義主題

修改 `docs/.vitepress/theme/` 目錄下的文件：

- `index.ts`: 主題入口，配置 Layout 和組件
- `components/Home.vue`: 自定義首頁組件

---

## 部署流程

### 自動部署

專案已配置自動部署，流程如下：

1. **推送到 main 分支**
   ```bash
   git add .
   git commit -m "更新內容"
   git push origin main
   ```

2. **GitHub Actions 自動執行**
   - 安裝依賴
   - 構建網站
   - 部署到 `gh-pages` 分支

3. **等待部署完成**
   - 前往 GitHub → Actions 查看進度
   - 通常 2-5 分鐘完成

4. **網站自動更新**
   - 訪問 https://phileiny.github.io/aidream_site/
   - 更新可能需要幾分鐘生效（CDN 緩存）

### 手動部署

如果需要手動觸發部署：

1. 前往 GitHub → Actions
2. 選擇 "Deploy VitePress to GitHub Pages"
3. 點擊 "Run workflow"

### GitHub Pages 設置

首次部署前確保設置正確：

1. 前往 GitHub 專案 → Settings → Pages
2. Source: 選擇 "Deploy from a branch"
3. Branch: 選擇 `gh-pages` / `(root)`
4. 點擊 Save

---

## 訪客計數器

### 工作原理

網站使用「不蒜子」服務統計訪客數：
- 總訪問量 (PV): 頁面瀏覽總數
- 在線人數 (UV): 當前同時在線的訪客數

### 組件位置

- 組件文件: `docs/.vitepress/components/VisitorCounter.vue`
- 主題集成: `docs/.vitepress/theme/index.ts`

### 顯示位置

訪客計數器自動顯示在首頁 features 區塊下方（僅首頁）。

### 本地開發注意事項

- 在本地環境（localhost）可能無法正確顯示統計數字
- 這是正常現象，不蒜子基於域名統計
- 部署到線上環境後會正常顯示

### 異常數字處理

組件已內建異常數字檢測：
- 如果數字超過 1000 萬，會自動重置為 0
- 這是為了避免繼承其他網站的統計數據

---

## 常見問題排查

### 問題 1: 本地開發伺服器無法啟動

**解決方案：**
```bash
# 清除 node_modules 和鎖定文件
rm -rf node_modules package-lock.json
npm install

# 重新啟動
npm run dev
```

### 問題 2: 構建失敗

**檢查：**
- Node.js 版本是否為 18+
- 所有依賴是否正確安裝
- Markdown 語法是否有錯誤

**解決方案：**
```bash
npm run build  # 查看具體錯誤訊息
```

### 問題 3: 部署後網站顯示 404

**檢查：**
1. GitHub Pages 設置是否正確（Settings → Pages）
2. `base` 配置是否與 repo 名稱一致
3. Actions 工作流是否成功執行

**解決方案：**
- 確認 `docs/.vitepress/config.ts` 中的 `base` 為 `/aidream_site/`
- 檢查 `gh-pages` 分支是否存在且包含內容

### 問題 4: 訪客計數器不顯示

**檢查：**
- 組件文件是否存在
- 主題配置是否正確
- 瀏覽器控制台是否有錯誤

**解決方案：**
```bash
# 確認文件結構
ls -la docs/.vitepress/components/VisitorCounter.vue
ls -la docs/.vitepress/theme/index.ts

# 檢查配置
cat docs/.vitepress/theme/index.ts
```

### 問題 5: 樣式或布局異常

**解決方案：**
```bash
# 清除構建緩存
rm -rf docs/.vitepress/cache
npm run dev
```

### 問題 6: RSS 生成失敗

**檢查：**
```bash
# 手動運行 RSS 生成
npm run rss
```

確保 `scripts/generate-rss.mjs` 文件存在且可執行。

---

## 更新與升級

### 更新 VitePress

1. **檢查最新版本**
   ```bash
   npm outdated vitepress
   ```

2. **更新到最新版本**
   ```bash
   npm install vitepress@latest
   ```

3. **檢查破壞性變更**
   查看 [VitePress 更新日誌](https://github.com/vuejs/vitepress/blob/main/CHANGELOG.md)

4. **測試構建**
   ```bash
   npm run build
   npm run preview
   ```

### 更新依賴

```bash
# 檢查過時的依賴
npm outdated

# 更新所有依賴（謹慎使用）
npm update

# 更新單個依賴
npm install package-name@latest
```

### 升級 Node.js

如果升級 Node.js 版本：
1. 清除 `node_modules` 和 `package-lock.json`
2. 重新安裝依賴
3. 測試所有功能

---

## 最佳實踐

### 提交訊息規範

使用清晰的提交訊息：
- `feat:` 新功能
- `fix:` 修復問題
- `docs:` 文檔更新
- `style:` 代碼格式調整
- `refactor:` 重構
- `chore:` 構建/工具變更

範例：
```bash
git commit -m "feat: 添加新文章 - AI 應用案例"
git commit -m "fix: 修正訪客計數器重複顯示問題"
```

### 內容管理建議

1. **定期備份**
   - 使用 Git 提交所有變更
   - 定期推送到遠端倉庫

2. **內容審查**
   - 發布前在本地預覽
   - 檢查拼寫和格式
   - 測試所有連結

3. **圖片優化**
   - 使用適當的圖片格式（WebP, PNG, JPG）
   - 控制圖片大小以提高加載速度
   - 使用描述性的文件名

### 安全注意事項

1. **不要提交敏感信息**
   - API 密鑰
   - 個人隱私信息
   - 內部文件路徑

2. **定期更新依賴**
   - 修復安全漏洞
   - 保持依賴最新

---

## 參考資源

- [VitePress 官方文檔](https://vitepress.dev/)
- [Markdown 語法指南](https://www.markdownguide.org/)
- [GitHub Pages 文檔](https://docs.github.com/pages)
- [不蒜子統計說明](https://ibruce.info/busuanzi/)

---

## 聯絡與支援

如有問題或建議：
- 開 Issue: GitHub 專案 Issues
- 查看日誌: GitHub Actions 執行記錄

---

**最後更新**: 2024-10-31
**維護者**: 星智未來 Aidream 團隊


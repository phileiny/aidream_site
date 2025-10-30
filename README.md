# 星智未來 Aidream Website (VitePress)

一個可直接部署的 VitePress 靜態網站樣板。支援圖文寫作、內建本地搜尋、可佈署到 GitHub Pages 或 Vercel。

## 快速開始
```bash
npm install
npm run dev
# 開啟 http://localhost:5173
```

## 正式建置
```bash
npm run build
# 產出在 docs/.vitepress/dist
```

## 部署到 GitHub Pages（建議）
- 新增 GitHub Repo，推上去後於「Settings → Pages」設定部署來源。
- 也可用 gh-pages Action（之後可提供 workflow 檔）。

## 寫作
- 文章放在 `docs/posts/` 。
- 圖片放在 `docs/public/images/`，用 `/images/...` 方式引用。
- 語言：zh-Hant。

---

## GitHub Pages 自動部署

1. 在 GitHub 建一個 Repository（預設分支 `main`）。  
2. 把這個專案推上去，然後到「Actions」頁籤，啟用 `Deploy VitePress to GitHub Pages`。  
3. 每次對 `main` 推送就會：安裝 → 建置 → 發佈到 `gh-pages` 分支。  
4. 到「Settings → Pages」選擇 `gh-pages` 做為來源，等待幾分鐘即可線上。

> 專案若部署在 **子路徑**（如 `https://user.github.io/aidream-site`），請在 `docs/.vitepress/config.ts` 設定：
>
> ```ts
> export default defineConfig({
>   base: '/aidream-site/'
> })
> ```
>
> 並更新 `sitemap.hostname` 為你的網域。

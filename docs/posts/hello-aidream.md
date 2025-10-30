# 網站上線：架構與寫作流程

歡迎來到 **星智未來 Aidream** 的新官網與部落格！

## 寫作方式
- 在 `docs/posts/` 目錄新增 Markdown 檔案（例如：`2025-01-first.md`）。
- 文章中的圖片請放到 `docs/public/images/`，在文中以相對路徑引用：
  ```md
  ![說明文字](/images/sample.png)
  ```

## 部署
- 本地建置：`npm install` → `npm run dev`
- 正式建置：`npm run build`，輸出會在 `docs/.vitepress/dist/`

## 目錄設計建議
- `posts/ai-engineering/xxx.md`
- `posts/web-rtc/xxx.md`
- `posts/iso-27001/xxx.md`

祝寫作順利！
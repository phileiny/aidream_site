# 文章上架指令

當使用者說「把 xxx.md 上架到 xx 類別」時，自動執行以下步驟：

## 類別對應

| 類別 | 目錄 | 索引頁 |
|------|------|--------|
| AI | `docs/ai/` | `docs/ai/index.md` |
| 機器人 / robot | `docs/robot/` | `docs/robot/index.md` |
| 專案 / project | `docs/project/` | `docs/project/index.md` |

## 上架步驟（自動執行）

1. **讀取文章**：讀取指定的 `.md` 文件，提取標題（第一個 `# ` 開頭的行）
2. **確認文章位置**：確保文章已在正確的分類目錄下（如 `docs/ai/xxx.md`）
3. **更新分類索引頁**：在 `docs/{分類}/index.md` 的 `## Recent Posts` 下方第一行加入連結
4. **更新側邊欄**：在 `docs/.vitepress/config.ts` 對應分類的 sidebar items 中，Index 之後加入文章
5. **更新首頁**：在 `docs/index.md` 的 `## 📝 最新文章` 區塊最上方加入文章（需提供日期和摘要）
6. **本地預覽驗證**：執行 `npm run build` 確認無錯誤

## 上架格式範例

**分類索引頁格式**：
```markdown
- [文章標題](./文章檔名)
```

**側邊欄格式**：
```typescript
{ text: '文章標題', link: '/分類/文章檔名' }
```

**首頁格式**：
```markdown
### [文章標題](/分類/文章檔名)
**分類標籤** · YYYY-MM-DD

文章摘要（1-2 句話）

---
```

## 注意事項

- 首頁最新文章區塊只保留最新 5 篇，超過的移除
- 日期格式統一使用 `YYYY-MM-DD`
- 分類標籤使用：`AI`、`機器人`、`專案`
- 若使用者未提供日期和摘要，需詢問

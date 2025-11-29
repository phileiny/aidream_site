# Context7 MCP：讓 AI 程式助手不再寫出過時的程式碼

## 痛點：LLM 的訓練資料跟不上技術更新

使用 Claude Code、Cursor 或其他 AI 程式助手時，你是否遇過這些情況？

- AI 建議的 API 方法根本不存在
- 產生的程式碼用了舊版語法，跑起來一堆 deprecation warning
- 查了半天才發現 AI 給的範例是兩年前的版本

這不是 AI 不夠聰明，而是 LLM 的訓練資料有時間差。像 Next.js、React Query、Tailwind 這類快速迭代的框架，官方文件可能每週都在更新，但 AI 學到的可能還是半年前的版本。

## Context7 MCP 如何解決這個問題

Context7 是由 Upstash 開發的 MCP（Model Context Protocol）Server，它的做法很直接：

**在你發問的當下，即時抓取該函式庫的最新官方文件，注入到 AI 的 context 中。**

這意味著：

- 文件版本對應你實際使用的版本
- 範例程式碼來自官方文件，不是 AI 自己編的
- 不需要切換視窗查文件，也不用擔心 hallucination

## 在 Claude Code 中設定 Context7

Claude Code 提供了簡潔的 CLI 指令來管理 MCP Server。以下是完整的操作流程：

### 新增 Context7 MCP Server

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

執行後會看到類似這樣的輸出：

```
Added stdio MCP server context7 with command: npx -y @upstash/context7-mcp@latest to local config
File modified: /Users/ray/.claude.json [project: /Users/ray/sides/memobot]
```

這會將 Context7 加入到當前專案的 local config 中。

### 確認 MCP Server 狀態

```bash
claude mcp list
```

系統會檢查 MCP Server 的健康狀態：

```
Checking MCP server health...
context7: npx -y @upstash/context7-mcp@latest - ✓ Connected
```

看到 `✓ Connected` 就表示設定成功。

### 移除 MCP Server

如果需要移除：

```bash
claude mcp remove "context7" -s local
```

`-s local` 參數表示只從當前專案的設定中移除，不影響全域設定。

![Context7 MCP 運作示意圖](/images/context7_mcp.png)
*圖：Context7 MCP 即時抓取最新文件並注入到 AI context 中*

![Claude Code MCP 操作示範](./terminal-screenshot.png)
*圖：在 Claude Code 中管理 Context7 MCP 的完整操作流程*

## 實際使用方式

設定完成後，在 Claude Code 中使用時只需要加上 `use context7`：

```
幫我用 Next.js 15 的 App Router 建立一個有 JWT 驗證的 middleware，use context7
```

Context7 會自動：
1. 解析你提到的函式庫（Next.js）
2. 抓取對應的最新文件
3. 將相關文件注入到 prompt context 中

你也可以設定 Claude Code 的規則，讓它自動在需要時使用 Context7：

```
Always use context7 when I need code generation, setup or configuration steps, or library/API documentation.
```

## Context7 提供的 MCP Tools

Context7 MCP Server 提供兩個主要工具：

| Tool | 功能 | 參數 |
|------|------|------|
| `resolve-library-id` | 將函式庫名稱解析為 Context7 相容的 ID | `libraryName`（必填） |
| `get-library-docs` | 取得特定函式庫的文件 | `context7CompatibleLibraryID`（必填）、`topic`（選填）、`tokens`（選填，預設 5000） |

## 進階設定：使用 API Key

免費版有使用次數限制。如果需要更高的 rate limit 或存取私有 repository，可以到 [context7.com/dashboard](https://context7.com/dashboard) 申請 API Key：

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest --api-key YOUR_API_KEY
```

## 支援的開發環境

除了 Claude Code，Context7 MCP 也支援：

- Cursor
- Windsurf
- VS Code (Copilot)
- Claude Desktop
- Zed
- Amazon Q Developer CLI
- 任何支援 MCP 協議的 AI 工具

## 小結

Context7 MCP 解決了 AI 程式助手最常被詬病的問題：過時的訓練資料導致的錯誤建議。透過即時注入最新文件，它讓 AI 產生的程式碼更可靠、更符合當前版本的最佳實踐。

對於經常使用快速迭代框架的開發者來說，這是一個值得加入工具箱的 MCP Server。設定只需要一行指令，卻能省下大量 debug 和查文件的時間。

---

**相關連結：**
- [Context7 GitHub Repository](https://github.com/upstash/context7)
- [Claude Code MCP 文件](https://docs.anthropic.com/en/docs/claude-code)
- [Upstash 官方部落格](https://upstash.com/blog/context7-mcp)

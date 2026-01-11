# 從混沌到秩序：咩猛 Memo 開發實錄 — 一個 AI 助理專案的重生之路

> 這不是一篇成功學文章。這是一篇關於如何從「快速開發、緩慢 Debug」的泥沼中爬出來，最終找到可持續開發節奏的真實紀錄。

**作者**：Ray
**日期**：2026 年 1 月 11 日 

## TL;DR

咩猛 Memo 是一款 LINE AI 個人助理，整合 Google Calendar 提供行程管理服務。開發初期使用 Cursor + GPT 快速推進，卻陷入 Debug 地獄。後來引入 Claude Code + Opus 4.5，搭配 PIV、TDD 等軟體工程實踐，才讓專案重回正軌。本文分享這段從混亂走向有序的開發歷程。

---

## 專案背景：為什麼要做咩猛？

咩猛 Memo 是我的夥伴 Mona 規劃的產品，商業模式很清楚：

- **免費層**：行程管理（與 Google Calendar 雙向同步）
- **付費層**：專案管理 + 人脈管理訂閱制

目標是打造一個「活在 LINE 裡的個人助理」，讓使用者用自然語言就能管理生活中的大小事。

技術架構上，我們採用前後端分離：

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (Webhook)                        │
│  LINE Bot Webhook → LLM Agent → 使用者意圖判斷 → 功能路由   │
└─────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────┐
│                        後端 (Backend)                        │
│  Google Calendar 認證 → 資料同步 → MongoDB → Pinecone RAG   │
└─────────────────────────────────────────────────────────────┘
```

兩邊都部署在 Heroku，使用 TypeScript 開發。看起來很標準，對吧？

問題出在「怎麼開發」。

---

## 第一階段：蜜月期的幻覺

我們最初使用 ChatGPT 協助規劃系統架構，再用 Cursor 進行開發。

初期進展神速。

- 第一週：LINE Webhook 串接完成
- 第二週：Google OAuth 流程搞定
- 第三週：基本的行程 CRUD 可以動了

Mona 很開心，我也很開心。AI 輔助開發果然是生產力倍增器。

然後，Debug 開始了。

---

## 第二階段：Debug 地獄

當功能開始交互，問題如雨後春筍般冒出：

1. **Google Calendar Webhook 回調不穩定** — 有時觸發、有時沒有
2. **Token 刷新邏輯有 race condition** — 同時有兩個請求刷新 Token，資料庫狀態混亂
3. **LLM 意圖判斷飄忽不定** — 同樣的句子，今天能判斷成「新增行程」，明天就變成「查詢行程」
4. **前後端 API 契約不一致** — 前端期待 `startTime`，後端傳回 `start_time`

每解決一個 Bug，就冒出三個新的。

更糟的是，Cursor 在這個階段顯得力不從心。它擅長「從零生成」，但不擅長「理解脈絡、追蹤問題」。當 codebase 膨脹到一定程度，它給的建議常常是「砍掉重練」，而不是「精準修復」。

時間一週週過去，功能幾乎沒有推進。

Mona 開始不耐煩了：「為什麼開發進度嚴重落後？」

我很難解釋。在她眼裡，我每天都在寫 code，怎麼東西就是做不出來？

這是 AI 輔助開發最危險的陷阱：**速度的幻覺**。

前期的快速產出給人一種「這個專案很快就能完成」的錯覺。但那只是冰山一角。真正的開發工作量藏在整合、除錯、邊界處理、錯誤恢復這些不性感但必要的細節裡。

---

## 轉折點：引入 Claude Code + 軟體工程實踐

我意識到需要改變。

不是換一個更強的 AI，而是**改變開發方法論**。

### 換工具：Claude Code + Opus 4.5

Claude Code 最大的優勢不是生成速度，而是**脈絡理解能力**。它能夠：

- 閱讀整個 codebase 結構
- 理解前後端的 API 契約
- 追蹤問題的 root cause
- 在修改時考慮連鎖影響

這正是 Debug 階段最需要的能力。

### 引入方法論：PIV + TDD + YAGNI

光換工具不夠，我開始系統性地引入軟體工程實踐：

#### PIV (Plan → Implement → Verify)

每次開發新功能，強制自己走完三步：

1. **Plan**：先寫清楚要做什麼、為什麼、有什麼風險
2. **Implement**：小步快跑，頻繁 commit
3. **Verify**：寫測試驗證，不是「跑起來就好」

這個框架讓 Claude Code 的產出變得可控。AI 不再是亂槍打鳥，而是根據明確計畫行動。

#### TDD (Test-Driven Development)

我開始先寫測試，再寫實作。

聽起來老派，但 TDD 在 AI 輔助開發中有特殊價值：**它提供了明確的驗收標準**。

當我告訴 Claude「請實作一個函數，讓這五個測試通過」，它的產出品質遠高於「請幫我寫一個處理行程衝突的函數」。

#### YAGNI (You Aren't Gonna Need It)

這是最難執行的一條。

AI 很擅長過度設計。你問它「怎麼處理行程」，它會給你一個支援 17 種日曆格式、考慮 23 個邊界條件的方案。

我學會了說「不」。

先做最小可用版本。真的需要再擴展。

> 延伸閱讀：我把這套方法論整理成了 [Vibe Coding: PIV Framework](https://blog.aidream.com.tw/project/vibe-coding-piv-framework)

---

## 架構演進：從單體 Agent 到 Multi-Agent

另一個關鍵轉變發生在 LINE Bot 的 Agent 架構上。

### 初版：單一 Agent

最初的設計是一個巨大的 Agent，負責處理所有使用者意圖：

```javascript
// 偽代碼
async function handleMessage(message) {
  const intent = await detectIntent(message);
  
  switch(intent) {
    case 'create_event': return createEvent(message);
    case 'query_event': return queryEvent(message);
    case 'create_project': return createProject(message);
    case 'add_contact': return addContact(message);
    // ... 越來越多的 case
  }
}
```

問題很快浮現：

1. **單一 Prompt 越來越長** — LLM 的表現隨 prompt 長度下降
2. **不同功能互相干擾** — 專案管理的 few-shot 範例影響行程判斷
3. **難以獨立迭代** — 改一個功能要擔心影響其他功能

### 演進版：Router Agent + 專業 Agent

我們重構為 Multi-Agent 架構：

```
使用者訊息
    │
    ▼
┌─────────────┐
│ Router Agent │  ← 輕量級，只負責意圖分類
└──────┬──────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       ▼             ▼             ▼             ▼
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│ Calendar  │ │  Project  │ │  Contact  │ │  Default  │
│   Agent   │ │   Agent   │ │   Agent   │ │   Agent   │
└───────────┘ └───────────┘ └───────────┘ └───────────┘
```

好處立竿見影：

1. **Router Agent 可以很小** — 只需判斷大類，不需理解細節
2. **專業 Agent 各司其職** — prompt 短而精準，效果更好
3. **獨立部署與測試** — 改 Calendar Agent 不影響 Contact Agent

這個架構也更容易加入新功能。需要支援「提醒事項」？加一個 Reminder Agent 就好。

---

## 實戰心得：成本控制的藝術

開發 AI 應用，成本控制是隱藏 Boss。

咩猛 Memo 在成本優化上有幾個值得分享的做法：

### LINE Push Message 的陷阱

LINE Messaging API 的 Reply Message 免費，但 Push Message 要錢。

我們最初的設計是：Google Calendar 更新 → 後端處理 → Push 通知使用者。

這會燒錢。如果使用者頻繁修改行程，每月 Push 費用可能超過基礎建設成本。

解法是「延遲通知 + Reply Token」：

1. Google Calendar 更新時，記錄到資料庫，標記「有未讀更新」
2. 使用者下次與 Bot 互動時，用 Reply Token（免費）順便告知
3. 使用者也可以主動問「有什麼更新」

Push Message 歸零，使用者體驗維持。

### OpenAI Token 的分級使用

不是每個請求都需要 GPT-4。

- **意圖識別**：GPT-4（需要高準確度）
- **回覆生成**：GPT-4-mini（成本低 10 倍，品質可接受）
- **Embedding**：text-embedding-3-small（最便宜）

這個分級策略讓 OpenAI 月費從預估的 $60 降到 $20-30。

---

## 文檔驅動開發：給未來的自己一份禮物

最後想聊聊文檔。

咩猛專案現在有一個完整的 `docs/` 目錄：

```
docs/
├── architecture/       # 系統架構
├── api/                # API 文檔
├── features/           # 功能說明
├── guides/             # 操作指南
├── development/        # 開發規範
├── changelog/          # 變更記錄
└── analysis/           # 狀態分析
```

這不是「有空再補」的文檔，而是**開發流程的一部分**。

每次新 Claude 會話開始，第一件事就是讀 `SYSTEM_OVERVIEW.md` 和 `CURRENT_STATE.md`。

每次功能完成，必須更新對應文檔和 CHANGELOG。

這個習慣有兩個效果：

1. **降低 AI 的幻覺** — 它有明確的脈絡可以參考
2. **加速未來開發** — 兩週後回來，不需要重新 reverse engineer 整個專案

---

## 結語：最大的收穫不是產品，是工作流

咩猛 Memo 現在終於進入穩定迭代的狀態。

但回顧這段歷程，我發現最大的收穫不是這個產品本身，而是**建立了一套穩定可控的 AI 輔助開發工作流**。

這套工作流讓我面對各種專案時，有了「可以完整交付」的底氣。

不再是碰運氣式的開發——今天狀態好就產出多，明天卡住就停滯不前。而是有明確的步驟、可預期的節奏、可追蹤的進度。

**AI 是強力放大器，但它放大的是你的開發習慣——好的和壞的。**

如果你的開發流程混亂，AI 會讓你更快地製造技術債。
如果你有清晰的方法論，AI 會讓你飛速前進。

工具不是重點。Claude 也好、Cursor 也好、ChatGPT 也好，它們都只是工具。

重點是你怎麼使用它們。

---

## 想聊聊 AI 輔助開發？

這套工作流我正在持續打磨，也在幫助其他團隊導入。

如果你正在考慮：
- 如何讓團隊有效運用 AI 工具
- 怎麼建立可持續的 AI 輔助開發流程
- 或者只是想聊聊你遇到的開發痛點

歡迎到 **[星智未來](https://aidream.com.tw)** 找我聊聊。

我們專注於 AI 應用落地，從概念驗證到產品交付，陪你走完全程。

---

*本文為 aidream 部落格原創內容，作者 Ray 是「星智未來」創辦人，專注於 AI 應用工程與技術顧問服務。*

*更多 AI 實戰心得 → [blog.aidream.com.tw](https://blog.aidream.com.tw)*
*合作洽談 → [aidream.com.tw](https://aidream.com.tw)*

---

## 附錄：咩猛 Memo 技術規格速覽

| 項目 | 技術選擇 |
|------|----------|
| 前端 | LINE OA + LIFF |
| 後端 | Node.js 20 + TypeScript + Hono |
| 資料庫 | MongoDB Atlas M2 |
| 向量搜尋 | Pinecone Starter |
| AI | OpenAI GPT-4 / GPT-4-mini |
| 行事曆 | Google Calendar API |
| 部署 | Heroku |

預估月費（1,000 MAU）：$36-66 USD

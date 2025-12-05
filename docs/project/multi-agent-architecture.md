# 從單一 AI Agent 到專家團隊：咩猛Memo 架構演進之路

> 當你的 AI 助理開始「什麼都會但什麼都不精」時，是時候讓它學會分工合作了。

**作者**：Ray
**日期**：2025 年 12 月  

---

## 前言

在開發 LINE AI 個人助理「咩猛Memo」的過程中，我們經歷了一個典型的 AI 應用成長痛：**System Prompt 越寫越長、Token 成本越來越高、維護難度越來越大**。

這篇文章記錄我們如何運用 Multi-Agent 架構，將一個臃腫的「全能型」AI Agent 重構為高效的「專家團隊」，實現 **Token 用量降低 73%** 的成果。

---

## 咩猛Memo：一個 LINE AI 助理的誕生

### 專案簡介

咩猛Memo 是一款透過 LINE 官方帳號提供的 AI 個人助理，整合 Google Calendar 實現行程管理、專案追蹤與人脈管理。

**核心功能**
- 自然語言行程管理（新增／查詢／修改）
- Google Calendar 雙向同步
- 週期性行程與 Google Meet 自動建立
- 專案里程碑追蹤
- 人脈關係管理與語意搜尋

**技術架構**

```
使用者 (LINE) → Webhook → OpenAI NLU → MongoDB/Pinecone → Google Calendar
```

我們選擇了 Node.js + MongoDB Atlas + Pinecone + OpenAI 的組合，部署在 Heroku 上，目標支撐 1,000 月活躍用戶。看起來一切都很美好對吧？

---

## 問題浮現：當 AI 變成「全能保母」

### 單一 Agent 的困境

隨著功能不斷增加，我們的架構變成了這樣：

```
┌─────────────────────────────────────────┐
│            單一 LLM Agent               │
│  ┌───────────────────────────────────┐ │
│  │ SYSTEM_PROMPT (650+ 行指令)        │ │
│  │ - 行程管理規則                      │ │
│  │ - 專案管理規則                      │ │
│  │ - 人脈管理規則                      │ │
│  │ - 回覆格式規則                      │ │
│  │ - 多輪對話規則                      │ │
│  │ - ...還有更多                       │ │
│  └───────────────────────────────────┘ │
│  tools: [22 functions]                  │
└─────────────────────────────────────────┘
```

一個 650+ 行的 System Prompt，配上 22 個 Functions，每次請求都要全部送出去。

### 痛點分析

| 問題 | 實際影響 |
|-----|---------|
| **Token 成本高** | 每次請求約 1,500 tokens，光是指令就佔了大半 |
| **延遲較長** | 平均 2.5 秒回應，使用者體驗不佳 |
| **職責混雜** | 改行程邏輯可能不小心影響專案功能 |
| **測試困難** | 無法獨立測試「人脈查詢」是否正常 |
| **擴展受限** | 每加一個功能，System Prompt 又要膨脹 |

更慘的是，這個「什麼都會」的 Agent 開始出現「樣樣通、樣樣鬆」的症狀——複雜的專案查詢偶爾會誤判成行程查詢，人脈搜尋的語意理解也不夠精準。

---

## 解決方案：Multi-Agent 專家團隊

### 核心思想：分而治之

與其讓一個 Agent 學會所有事情，不如建立一個「專家團隊」：

```
┌─────────────────────────────────────────────────┐
│              Root Agent (咩猛協調者)              │
│         「我負責分類，專業的事交給專家」           │
└─────────────────────────────────────────────────┘
          │           │           │           │
          ▼           ▼           ▼           ▼
     ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐
     │ 行程   │  │ 專案   │  │ 人脈   │  │ 認證   │
     │ Agent  │  │ Agent  │  │ Agent  │  │ Agent  │
     └────────┘  └────────┘  └────────┘  └────────┘
```

**Root Agent** 只做一件事：快速判斷使用者意圖，然後把任務「轉發」給對應的專家。每個 **Expert Agent** 專注於自己的領域，有自己精簡的 System Prompt 和專屬的 Functions。

### 實際運作流程

當使用者說「幫我查阿里雲八期的游副總電話」：

**舊架構（單一 Agent）**
```
1. 載入 3000 tokens 的 SYSTEM_PROMPT
2. LLM 需要理解所有規則後才能決定
3. 可能混淆行程查詢和人脈查詢
4. 錯誤時不知道是理解問題還是執行問題
```

**新架構（Multi-Agent）**
```
1. Root Agent 分析：這是人脈查詢 → 委派給人脈專家
2. 人脈專家只載入人脈相關指令 (~500 tokens)
3. 專注處理人脈查詢邏輯
4. 錯誤時明確知道是人脈專家的問題
```

### 專家分工設計

**Root Agent（約 50 行 Prompt）**
```
你是「咩猛協調者」，負責快速識別用戶意圖並轉發給對應的專家。

【意圖分類】(按優先級排序)
1. 認證：登入、授權、綁定 → routeToAuthAgent
2. 專案：專案、案子、里程碑 → routeToProjectAgent
3. 人脈：人脈、聯絡人、姓X的 → routeToContactAgent
4. 行程：(預設) 行程、會議、空檔 → routeToScheduleAgent
5. 閒聊：問候、感謝、其他 → handleGeneralChat
```

**行程專家（約 100 行 Prompt）**
```
你是「行程專家」，專門處理 Google Calendar 行程管理。

【意圖判斷優先級】
1. 疑問句 (有什麼、哪些、幾點) → 查詢
2. 修改關鍵字 (改、調整、取消) → 修改
3. 陳述句 + 時間 → 新增
```

每個專家只關心自己的事，Prompt 短小精悍，Functions 也只有相關的幾個。

---

## 預期效益

| 指標 | 舊架構 | 新架構 | 改善幅度 |
|------|--------|--------|---------|
| **平均 Token 用量** | ~1,500 tokens | ~400 tokens | **-73%** |
| **平均延遲** | ~2.5s | ~1.5s | **-40%** |
| **System Prompt 長度** | 650+ 行 | Root: 50 行, Expert: 100 行 | **-85%** |
| **單元測試覆蓋率** | ~30% | ~80% | **+166%** |

最關鍵的改善是**可維護性**：現在要修改專案功能，只需要動 Project Agent，完全不用擔心影響到行程或人脈功能。

---

## 實作重點

### 1. Agent 基類設計

```javascript
class AgentBase {
  constructor(name, config) {
    this.name = name;
    this.systemPrompt = config.systemPrompt;
    this.functions = config.functions;
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature || 0.3;
  }

  async process(userMessage, userId, context = {}) {
    // 呼叫 OpenAI，傳入精簡的 prompt 和 functions
    const response = await this.callOpenAI(userMessage, context);
    return this.handleResponse(response, userId, context);
  }
}
```

### 2. Feature Flag 漸進式部署

```javascript
function shouldUseMultiAgent(userId) {
  if (!FEATURE_FLAGS.USE_MULTI_AGENT) return false;
  
  const percentage = FEATURE_FLAGS.MULTI_AGENT_ROLLOUT_PERCENTAGE;
  // 基於 userId 的雜湊，實現漸進式 rollout
  const hash = hashCode(userId);
  return (hash % 100) < percentage;
}
```

我們設計了 Feature Flag 機制，可以先讓 10% 的使用者體驗新架構，確認沒問題後再逐步放量到 100%。

### 3. 風險緩解

| 風險 | 緩解措施 |
|------|----------|
| 路由錯誤 | 詳細的意圖分類測試、fallback 到舊架構 |
| 延遲增加 | 兩次 API call 可能增加延遲，但單次 token 減少可抵消 |
| 上下文丟失 | 確保 context 正確傳遞給 Expert Agent |

---

## 後續規劃

除了 Multi-Agent 架構，我們還規劃了以下優化：

**Memory 系統強化**
- 結構化的 Session State
- 跨對話的用戶偏好記憶
- 上下文壓縮（每 10 次對話摘要一次）

**MCP 整合**
- Google Calendar MCP：更完整的日曆同步
- Brave Search MCP：補充人脈/公司資訊
- Gmail MCP：發送會議邀請和提醒

**可觀測性**
- 結構化日誌
- 請求追蹤（Trace）
- Token 用量監控 Dashboard

---

## 結語

從單一 Agent 到 Multi-Agent 的重構，不只是技術架構的改變，更是一種思維的轉變：**AI 應用不該是一個無所不能的黑盒子，而是一群各司其職的專家團隊。**

這樣的架構讓我們能夠：
- **更快迭代**：獨立開發和測試每個功能
- **更省成本**：只載入需要的指令
- **更好維護**：問題定位更精準
- **更易擴展**：新功能 = 新專家

如果你的 AI 專案也遇到了類似的成長痛，希望這篇文章能給你一些啟發。

---

*本文基於 Kaggle × Google 5-Day AI Agents Course 的學習心得，以及咩猛Memo 專案的實際開發經驗撰寫。*

**延伸閱讀**
- [Google ADK - Multi-Agent Systems](https://google.github.io/adk-docs/agents/multi-agents/)
- [MCP 協定規範](https://spec.modelcontextprotocol.io/)

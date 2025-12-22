# 多代理系統架構設計與 A2A / MCP 協議：給 AI 應用開發團隊的實戰指南

> 當你的 AI 應用需要串接多個系統、協調多個 Agent 時，架構設計就成了關鍵。本文為小型開發團隊解析多代理系統的架構模式、A2A 與 MCP 協議的技術細節，以及如何用這些標準打造更強大的 AI 產品。

**作者**：Ray
**日期**：2025 年 12 月  

---

## 前言：為什麼開發團隊要關注多代理系統？

如果你正在開發 AI 應用，很可能已經遇到這些瓶頸：

- 單一 LLM 呼叫無法完成複雜任務，需要多步驟編排
- 想讓 AI 存取外部工具（資料庫、API、檔案系統），但每個整合都要寫一堆膠水程式碼
- 產品需要跟用戶現有的工具（Slack、Notion、Google Drive）對話
- 隨著功能增加，程式碼變得難以維護，Agent 之間的互動邏輯越來越混亂

2025 年，產業界開始收斂到兩個關鍵協議：Google 主導的 **Agent2Agent (A2A)** 和 Anthropic 主導的 **Model Context Protocol (MCP)**。這不只是大廠的遊戲——對小型開發團隊來說，採用這些標準意味著更少的重複工作、更好的互操作性，以及更容易維護的程式碼。

這篇文章會帶你了解：多代理系統的架構選擇、A2A/MCP 的技術設計、以及如何在你的產品中實際運用這些協議。

---

## 第一章：AI Agent 的演進歷史

### 1.1 從規則到智能：七十年的發展軌跡

AI Agent 的概念並非一夕之間出現，而是經歷了數十年的技術積累：

**1950-1960 年代：理論奠基期**

1950 年 Alan Turing 提出圖靈測試，開啟了機器智能的哲學討論。1956 年達特茅斯會議正式確立「人工智慧」一詞。這個時期的代表作包括 1966 年 Joseph Weizenbaum 開發的 ELIZA——一個模擬心理治療師的對話程式，可視為最早期的 AI Agent 雛形。

**1970-1980 年代：專家系統崛起**

這個時期以規則導向的專家系統為主流。MYCIN（醫療診斷）、DENDRAL（化學分析）等系統展示了 AI 在特定領域的專業能力。1972 年 PROLOG 語言的出現，為邏輯推理型 AI 提供了重要工具。1988 年 Sutton 與 Barto 發表的時序差分學習（Temporal Difference Learning），則為後來的強化學習奠定了基礎。

**1990 年代：Agent 導向程式設計**

Agent-Oriented Programming (AOP) 典範在這個時期成形。1995 年 Russell 與 Norvig 出版的經典教科書《Artificial Intelligence: A Modern Approach》以 Agent 為核心定義 AI，確立了 Agent 在 AI 領域的中心地位。多代理系統（MAS）的研究也開始受到關注。

**2000-2010 年代：機器學習與虛擬助理**

機器學習與大數據的興起，讓 AI Agent 具備了從資料中學習的能力。Siri（2011）、Alexa（2014）等虛擬助理進入消費市場，AI 開始融入日常生活。2016 年 AlphaGo 擊敗李世乭的 Move 37，展示了 AI 超越人類既定思維的創造力。

**2020 年代至今：生成式 AI 與 Agentic AI**

2022 年 ChatGPT 的發布引爆生成式 AI 熱潮。2024-2025 年，產業焦點轉向 Agentic AI——具備自主決策、任務規劃與跨系統執行能力的智能代理。多代理協作成為新的技術前沿。

### 1.2 從 Chatbot 到 AI Agent：關鍵差異

許多人容易混淆 AI Agent 與聊天機器人，但兩者有本質差異：

| 面向 | 傳統 Chatbot | AI Agent |
|------|-------------|----------|
| 運作模式 | 被動回應、規則驅動 | 主動執行、目標導向 |
| 決策能力 | 依預設腳本 | 自主推理與規劃 |
| 系統整合 | 單一介面 | 跨系統協作 |
| 學習能力 | 有限或無 | 持續學習與適應 |
| 任務範疇 | 問答為主 | 複雜工作流程執行 |

簡單來說，Chatbot 是「會說話的介面」，而 AI Agent 是「會辦事的數位員工」。

---

## 第二章：多代理系統架構設計

### 2.1 為什麼需要多代理架構？

單一 Agent 面臨幾個根本限制：

1. **專業化瓶頸**：一個模型難以在所有領域都表現優異
2. **上下文限制**：Token 數量有限，無法同時處理海量資訊
3. **任務複雜度**：跨領域任務需要不同專長的協作
4. **可擴展性**：單點架構難以水平擴展

多代理系統的解法是：讓多個專業化的 Agent 各司其職，透過協調機制完成複雜任務。這就像企業組織——有人負責業務、有人負責財務、有人負責技術，透過分工合作達成共同目標。

### 2.2 主流架構模式

目前業界主要有三種多代理架構模式：

**模式一：階層式（Hierarchical）**

```
          [Supervisor Agent]
               ↓
    ┌──────────┼──────────┐
    ↓          ↓          ↓
[Agent A]  [Agent B]  [Agent C]
```

由一個主管 Agent 負責任務分解與分派，下屬 Agent 執行具體任務後回報結果。適合任務流程明確、需要中央控制的場景。

**模式二：協作式（Collaborative）**

```
[Agent A] ←──→ [Agent B]
    ↑              ↑
    └──────┬───────┘
           ↓
       [Agent C]
```

各 Agent 以對等方式互相溝通協調，沒有明確的上下級關係。適合需要多方討論、迭代優化的創意型任務。

**模式三：圖狀工作流（Graph-based）**

```
[Start] → [Agent A] → [Decision Node] → [Agent B] → [End]
                           ↓
                       [Agent C]
```

將 Agent 視為節點，以有向圖定義執行路徑與條件分支。適合複雜業務流程，需要精確控制流程走向的場景。

### 2.3 主流框架比較

2025 年最受關注的多代理框架包括：

**LangGraph**
- 架構特色：圖狀工作流設計，每個 Agent 是節點，邊定義執行路徑
- 優勢：精確的流程控制、完整的狀態管理、與 LangChain 生態整合
- 適用場景：複雜的多步驟任務、需要條件分支的工作流

**CrewAI**
- 架構特色：角色導向設計，每個 Agent 有明確的角色與職責
- 優勢：直覺易用、模擬人類團隊協作模式、快速上手
- 適用場景：任務分工明確的團隊協作、內容生產流程

**AutoGen（Microsoft）**
- 架構特色：對話式協作，Agent 之間以訊息交換方式互動
- 優勢：彈性高、支援人機協作（Human-in-the-loop）
- 適用場景：需要動態角色扮演的對話型應用

**Google ADK (Agent Development Kit)**
- 架構特色：開源框架，原生支援 A2A 協議
- 優勢：與 Google 雲端服務整合、企業級安全性
- 適用場景：需要跨組織 Agent 互通的企業應用

| 框架 | 架構風格 | 學習曲線 | 適用規模 | 生態成熟度 |
|------|---------|---------|---------|-----------|
| LangGraph | 圖狀工作流 | 中高 | 中大型 | 高 |
| CrewAI | 角色協作 | 低 | 中小型 | 中 |
| AutoGen | 對話協作 | 中 | 研究/原型 | 中 |
| Google ADK | 企業級 | 中 | 大型 | 發展中 |

---

## 第三章：Agent2Agent (A2A) 協議深度解析

### 3.1 A2A 的誕生背景

2025 年 4 月，Google 在 Cloud Next 大會上發布 Agent2Agent (A2A) 協議，獲得超過 50 家科技巨頭支持，包括 Atlassian、Salesforce、SAP、ServiceNow、PayPal 等。這是 AI 產業首次嘗試建立 Agent 間通訊的開放標準。

A2A 要解決的核心問題是：**當企業部署了多個來自不同廠商的 AI Agent，這些 Agent 如何互相溝通協作？**

過去的做法是為每對 Agent 寫客製化整合，這導致了「N×M 問題」——N 個 Agent 與 M 個系統，需要 N×M 種整合方式，複雜度爆炸式增長。A2A 的解法是提供統一協議，讓任何支援 A2A 的 Agent 都能互通。

### 3.2 A2A 的五大設計原則

A2A 協議建立在五個核心原則上：

1. **擁抱代理能力（Embrace Agentic Capabilities）**
   - Agent 之間協作時，不需要共享記憶、工具或執行計畫
   - 每個 Agent 保持獨立自主，僅透過任務與訊息互動

2. **建立在開放標準之上（Built on Open Standards）**
   - 採用 HTTP、JSON-RPC、SSE 等成熟技術
   - 降低導入門檻，與現有技術堆疊相容

3. **預設安全（Secure by Default）**
   - 遵循 OpenAPI 認證規範
   - 提供企業級安全性

4. **支援長時間任務（Supports Long-Running Tasks）**
   - 原生支援背景任務、人工審核流程
   - 支援串流更新，任務可跨越數分鐘甚至數小時

5. **模態不可知（Modality Agnostic）**
   - 支援文字、圖片、音訊、PDF、JSON 等多種格式
   - Agent 可依需求協商互動模態

### 3.3 A2A 核心概念

**Agent Card（代理卡片）**

每個 A2A 相容的 Agent 都有一張「名片」，以 JSON 格式描述：
- 能力與技能
- 支援的端點
- 認證要求
- 可處理的任務類型

這讓 Agent 可以在運行時「發現」其他 Agent 的能力，實現動態協作。

**Task（任務）**

A2A 中所有互動都圍繞「任務」展開。任務有明確的生命週期：
- submitted（已提交）
- working（處理中）
- input-required（需要更多資訊）
- completed（已完成）
- failed（失敗）

**Message（訊息）**

Agent 之間透過訊息交換上下文、問題、部分結果等資訊。訊息可包含多種內容類型（DataPart），不限於純文字。

**Artifact（成品）**

任務完成後產出的結果，可能是文件、日曆邀請、資料記錄等。

### 3.4 A2A 運作流程示例

以「規劃東京商務旅行」為例：

```
1. [用戶] → [主 Agent]: 「幫我規劃下個月的東京商務旅行」

2. [主 Agent] 透過 Agent Card 發現三個專業 Agent:
   - 機票 Agent
   - 飯店 Agent  
   - 當地活動 Agent

3. [主 Agent] 建立三個子任務，分別派發給專業 Agent

4. [機票 Agent] 回傳航班選項
   [飯店 Agent] 回傳住宿推薦
   [活動 Agent] 回傳行程建議

5. [主 Agent] 整合所有結果，產出完整旅行計畫

6. [主 Agent] → [用戶]: 呈現整合後的行程與預訂選項
```

整個過程中，各 Agent 不需要知道彼此的內部實作（「不透明執行」），僅透過標準化介面溝通。

### 3.5 A2A vs MCP：互補而非競爭

Anthropic 在 2024 年 11 月推出的 Model Context Protocol (MCP) 與 A2A 經常被放在一起比較，但兩者實際上解決不同層次的問題：

| 面向 | MCP | A2A |
|------|-----|-----|
| 核心功能 | Agent 連接工具與資料源 | Agent 之間的協作通訊 |
| 比喻 | 「AI 的 USB-C 接口」 | 「AI 的 HTTP 協議」 |
| 解決問題 | N×M 工具整合問題 | Agent 互操作性問題 |
| 互動對象 | Agent ↔ 工具/資料 | Agent ↔ Agent |

實務上，兩者經常搭配使用：MCP 讓 Agent 能夠存取外部工具（如資料庫、API），A2A 讓多個 Agent 能夠協同工作。Google 官方也明確表示 A2A 是 MCP 的「互補協議」。

---

## 第四章：A2A/MCP 對開發團隊與產品的實際價值

### 4.1 開發團隊採用標準協議的優勢

作為一個正在開發 AI 應用的小型團隊，你可能正面臨這些挑戰：每個外部服務都要寫獨立的整合程式碼、Agent 之間的通訊邏輯散落在各處、新成員要花大量時間理解現有架構。A2A 和 MCP 這兩個協議，正是為了解決這些痛點而設計。

**大幅減少整合開發時間**

傳統做法是：每接一個新的外部服務（資料庫、API、第三方工具），就要寫一套專屬的 adapter。如果你的產品需要串接 10 個服務，就是 10 套不同的整合邏輯。

採用 MCP 後，這變成「一次實作，處處可用」。你只需要讓你的 Agent 支援 MCP client，就能連接所有提供 MCP server 的工具。目前 MCP 生態已經有：

- 資料庫連接器（PostgreSQL、SQLite、MongoDB）
- 雲端服務（AWS、GCP、Azure）
- 開發工具（GitHub、GitLab、Linear）
- 生產力工具（Slack、Notion、Google Drive）
- 瀏覽器自動化（Puppeteer、Playwright）

這意味著：你不用再寫 Slack API 的整合程式碼，直接用現成的 MCP server 就好。

**統一的 Agent 通訊架構**

當你的系統有多個 Agent 時，它們之間怎麼溝通？沒有標準的話，很容易變成義大利麵式的架構——Agent A 直接呼叫 Agent B 的內部方法，Agent B 又依賴 Agent C 的特定實作細節。

A2A 協議定義了清晰的通訊介面：

```
Client Agent                    Remote Agent
    |                               |
    |-- POST /tasks/send ---------> |
    |                               | (處理任務)
    | <---- SSE: status updates --- |
    | <---- SSE: artifact --------- |
    |                               |
```

每個 Agent 只需要暴露標準的 A2A 端點，其他 Agent 就能透過 HTTP 與它互動。這帶來幾個好處：

1. **鬆耦合**：Agent 之間不需要知道彼此的內部實作
2. **可替換性**：只要介面相容，可以隨時替換底層實作
3. **易測試**：可以用 mock server 測試 Agent 互動邏輯
4. **跨語言**：Python 寫的 Agent 可以無縫呼叫 TypeScript 寫的 Agent

**降低新成員的上手成本**

如果你的架構基於業界標準協議，新成員可以：

- 直接閱讀 A2A/MCP 官方文件理解核心概念
- 在網路上找到大量教學資源和範例
- 把在其他專案學到的經驗直接套用

相比之下，如果是自創的協議，新成員必須從頭學習你們的設計，而且這些知識離開這個專案就沒用了。

### 4.2 對你開發的產品的好處

除了開發效率，採用標準協議對你的產品本身也有顯著優勢：

**產品可以輕鬆整合進用戶的現有工作流**

如果你的產品提供 MCP server 介面，用戶可以直接從支援 MCP 的 AI 工具（如 Claude Desktop、Cursor、Windsurf）呼叫你的服務。這大幅降低了用戶的採用門檻——他們不需要離開熟悉的環境，就能使用你的產品。

舉例：假設你開發了一個程式碼審查工具。如果它提供 MCP server：

```json
{
  "name": "code-review-agent",
  "description": "分析程式碼品質並提供改進建議",
  "tools": [
    {
      "name": "review_code",
      "description": "審查指定檔案的程式碼品質",
      "inputSchema": {
        "type": "object",
        "properties": {
          "file_path": { "type": "string" },
          "focus_areas": { "type": "array", "items": { "type": "string" } }
        }
      }
    }
  ]
}
```

用戶在 Cursor 裡就能直接說：「幫我用 code-review-agent 審查這個檔案」，完全無縫整合。

**產品可以與其他 Agent 協作，擴大使用場景**

如果你的產品提供 A2A 介面，它就能成為更大的 Agent 生態系的一部分。其他開發者可以把你的服務納入他們的 multi-agent 系統，創造出你原本沒想到的使用場景。

想像一下：一個企業用戶可能把你的程式碼審查 Agent、另一家的部署 Agent、再加上自己的通知 Agent 串在一起，組成完整的 CI/CD 工作流。這種「組合式創新」只有在標準化協議下才可能實現。

**未來相容性與生態紅利**

A2A 已經獲得超過 50 家企業支持，包括 Atlassian、Salesforce、SAP、ServiceNow、MongoDB 等。MCP 則是 Anthropic 主推，Claude 系列產品原生支援。

這意味著：

1. **生態會持續擴大**：越多工具支援這些協議，你的產品的連接性就越強
2. **不用擔心被淘汰**：不像私有 API 可能隨時改版，標準協議有向後相容的壓力
3. **減少供應商鎖定風險**：用戶更願意採用基於開放標準的產品

### 4.3 實作建議：從哪裡開始？

對於小型開發團隊，建議的採用路徑：

**第一步：先導入 MCP 處理工具整合**

MCP 的學習曲線較低，而且立即可見效益。如果你的 Agent 需要存取外部工具（資料庫、檔案系統、API），從 MCP 開始：

1. 使用現成的 MCP server：[MCP Servers 官方清單](https://github.com/modelcontextprotocol/servers)
2. 在你的 Agent 中實作 MCP client
3. 測試工具調用流程

Google ADK 和 LangChain 都已內建 MCP 支援，可以直接使用。

**第二步：當需要多 Agent 協作時，導入 A2A**

如果你的系統只有單一 Agent，暫時不需要 A2A。但當你發現：

- 某些任務太複雜，需要拆分給多個專責 Agent
- 需要整合外部的 Agent 服務
- 想讓你的 Agent 被其他系統調用

這時就是導入 A2A 的好時機。Google 提供了 [A2A Python SDK](https://github.com/google/a2a-python)，可以快速上手。

**第三步：為你的產品設計對外介面**

思考你的產品可以提供什麼能力給其他 Agent：

- **作為 MCP server**：提供工具/資源讓其他 Agent 調用
- **作為 A2A agent**：提供完整的任務執行能力

設計 Agent Card 時，清楚描述你的 Agent 能做什麼、需要什麼輸入、會產出什麼結果。好的 Agent Card 就像好的 API 文件，讓其他開發者一看就知道怎麼用。

### 4.4 實際案例：重構前後對比

讓我們看一個具體的重構案例。

**重構前：緊耦合的多 Agent 系統**

```python
# agent_a.py
from agent_b import AgentB
from agent_c import AgentC

class AgentA:
    def __init__(self):
        self.agent_b = AgentB()
        self.agent_c = AgentC()
    
    def process(self, request):
        # 直接呼叫其他 Agent 的內部方法
        data = self.agent_b.fetch_data(request.query)
        result = self.agent_c.analyze(data)
        return result
```

問題：
- Agent A 必須 import Agent B 和 C 的程式碼
- 無法獨立部署、獨立測試
- 替換任一 Agent 都需要改動其他 Agent

**重構後：基於 A2A 的鬆耦合架構**

```python
# agent_a.py
import httpx

class AgentA:
    def __init__(self, agent_b_url: str, agent_c_url: str):
        self.agent_b_url = agent_b_url
        self.agent_c_url = agent_c_url
    
    async def process(self, request):
        # 透過 A2A 協議呼叫其他 Agent
        async with httpx.AsyncClient() as client:
            # 發送任務給 Agent B
            task_b = await client.post(
                f"{self.agent_b_url}/tasks/send",
                json={
                    "task": {
                        "type": "fetch_data",
                        "input": {"query": request.query}
                    }
                }
            )
            data = task_b.json()["result"]
            
            # 發送任務給 Agent C
            task_c = await client.post(
                f"{self.agent_c_url}/tasks/send",
                json={
                    "task": {
                        "type": "analyze",
                        "input": {"data": data}
                    }
                }
            )
            return task_c.json()["result"]
```

優勢：
- 每個 Agent 可以獨立開發、部署、擴展
- 用 URL 設定就能切換到不同的 Agent 實作
- 可以用任何語言重寫任一 Agent，只要介面相容
- 容易加入新的 Agent 到系統中

### 4.5 常見問題與解答

**Q: 我的產品很簡單，只有一個 Agent，需要用這些協議嗎？**

現階段可能不需要完整導入，但建議：
- 如果需要工具整合，考慮 MCP
- 在架構設計時預留擴展空間
- 關注這些協議的發展，為未來做準備

**Q: 導入這些協議會增加多少開發成本？**

初期有學習曲線，但長期來看是減少成本。根據社群回饋：
- MCP：大約 1-2 天可以完成基本整合
- A2A：大約 1 週可以完成首個 Agent 的 A2A 化

而且這是一次性投入，之後每次新增整合都會更快。

**Q: 如果這些協議沒有成為主流怎麼辦？**

即使協議本身沒有統一市場，你採用的架構思維（鬆耦合、標準介面、工具抽象）仍然是好的軟體設計。最壞的情況是需要換一套協議，但核心邏輯不需要重寫。

**Q: 有哪些公司已經在用了？**

A2A 的早期採用者包括：Atlassian、Box、Cohere、Intuit、PayPal、Salesforce、SAP、ServiceNow、UKG、Workday 等。MCP 則已經被 Cursor、Windsurf、Cline、Zed 等開發工具整合。

這不是實驗性技術，是正在被產業採用的標準。

---

## 第五章：展望未來

### 5.1 技術發展趨勢

**協議標準化加速**

A2A 與 MCP 的出現標誌著 AI Agent 互操作性的新紀元。隨著更多廠商加入，這些協議有望成為產業標準，就像 HTTP 之於網際網路。

**多模態 Agent 崛起**

未來的 Agent 將能同時處理文字、圖像、語音、影片，實現更自然的人機互動。

**自主性持續提升**

從「執行指令」到「理解意圖」再到「主動規劃」，Agent 的自主性將持續提升，真正成為「數位同事」而非「數位工具」。

### 5.2 給開發團隊的建議

1. **從 MCP 開始，再進階到 A2A**：MCP 解決工具整合問題，學習曲線較低，先熟悉這個再處理多 Agent 協作

2. **關注協議演進**：A2A 和 MCP 都還在快速發展，定期關注 GitHub 上的更新和新功能

3. **建立團隊共識**：在架構選型時，讓團隊理解為什麼要採用標準協議，這會影響後續的開發決策

4. **從小功能驗證**：不要一次重構整個系統，先選一個獨立模組試用新協議，驗證可行後再擴展

5. **預留擴展空間**：即使現在只有單一 Agent，也可以在架構設計時考慮未來的多 Agent 需求

---

## 結語：現在是最好的時機

多代理系統和標準化協議正在從「研究議題」變成「產業實踐」。對於正在開發 AI 應用的小型團隊來說，這是一個難得的時機：

**技術已經成熟到可以用，但還沒成熟到變成「基本功」**。

現在投入時間學習 A2A 和 MCP，你的團隊可以：

- 建立比競爭對手更具互操作性的產品
- 用更少的程式碼完成更多的整合
- 吸引願意採用開放標準的企業客戶

更重要的是，這些協議背後的設計理念——鬆耦合、標準介面、工具抽象——本身就是好的軟體架構實踐。即使協議本身演進了，這些技能和思維模式仍然有價值。

**建議的下一步：**

1. 花一個下午，跑一遍 MCP 的 quickstart
2. 用你現有的專案，嘗試接入一個 MCP server
3. 思考你的產品可以提供什麼能力給其他 Agent

不需要等到「完全準備好」才開始。在做中學，永遠是最快的路徑。

---

## 參考資源

### 協議規範與官方文件
- [Google A2A Protocol 官方 GitHub](https://github.com/google-a2a/A2A)
- [A2A Python SDK](https://github.com/google/a2a-python)
- [Anthropic Model Context Protocol](https://www.anthropic.com/news/model-context-protocol)
- [MCP 官方規範](https://spec.modelcontextprotocol.io/)
- [MCP Servers 官方清單](https://github.com/modelcontextprotocol/servers)

### 開發框架
- [Google ADK 官方教學](https://google.github.io/adk-docs/)
- [LangGraph 多代理工作流](https://blog.langchain.com/langgraph-multi-agent-workflows/)
- [LangChain MCP 整合](https://python.langchain.com/docs/integrations/tools/mcp/)
- [CrewAI 官方文件](https://docs.crewai.com/)
- [AutoGen 官方 GitHub](https://github.com/microsoft/autogen)

### 學習資源
- [Building Agentic Applications - Anthropic Cookbook](https://github.com/anthropics/anthropic-cookbook)
- [Multi-Agent Systems - DeepLearning.AI](https://www.deeplearning.ai/short-courses/)
- [A2A 技術細節解析 - Google Cloud Blog](https://cloud.google.com/blog/topics/developers-practitioners)

### 已支援 MCP 的工具
- [Cursor](https://cursor.sh/) - AI 程式碼編輯器
- [Windsurf](https://www.codeium.com/windsurf) - AI IDE
- [Claude Desktop](https://claude.ai/download) - Claude 桌面應用

---

*本文由 Ray 撰寫。如果這篇文章對你有幫助，歡迎分享給正在開發 AI 應用的朋友。*

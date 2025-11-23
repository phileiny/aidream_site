# 5 天 Google AI Agent 學習旅程 - 完整總結

**課程：** Kaggle × Google - 5-Day AI Agents Intensive Course
**學習期間：** 2025-11-10 至 2025-11-14
**整理者：** Kuanter8
**總學習時數：** 約 15 小時
**原課程連結：** [5-Day AI Agents Intensive Course](https://www.kaggle.com/competitions/5-day-ai-agents-intensive-course/overview)
---

## 📖 目錄

1. [課程概覽](#課程概覽)
2. [Day 1：AI Agent 基礎與架構設計](#day-1ai-agent-基礎與架構設計)
3. [Day 2：工具整合與 MCP 協定](#day-2工具整合與-mcp-協定)
4. [Day 3：上下文工程與記憶管理](#day-3上下文工程與記憶管理)
5. [Day 4：品質觀測與評估](#day-4品質觀測與評估)
6. [Day 5：從原型到生產環境](#day-5從原型到生產環境)
7. [核心技術棧整合](#核心技術棧整合)
8. [最佳實踐總結](#最佳實踐總結)
9. [延伸學習資源](#延伸學習資源)
10. [學習成果與應用](#學習成果與應用)

---

## 🎯 課程概覽

### 學習旅程地圖

這個為期 5 天的密集課程帶領學習者從零開始，逐步掌握企業級 AI Agent 開發的完整生命週期：

```
Day 1: Foundation        Day 2: Tools           Day 3: Context        Day 4: Quality        Day 5: Production
   基礎                    工具                   上下文                品質                  生產
    ↓                      ↓                      ↓                     ↓                     ↓
Agent 架構           自訂工具開發          Session 管理          可觀測性              A2A 協定
Think-Act-Observe    MCP 整合              Memory 系統           評估框架              AgentOps
多 Agent 模式        長時間運行操作        狀態管理              Logs/Traces/Metrics   Vertex AI 部署
```

### 課程特色

- **理論與實踐並重** - 每天都包含白皮書學習、專家座談和實作練習
- **完整開發生命週期** - 從原型開發到生產部署的完整流程
- **企業級視角** - 涵蓋安全性、可擴展性、維運管理
- **Google 技術棧** - 使用 ADK (Agent Development Kit) 和 Vertex AI

---

## 📘 Day 1：AI Agent 基礎與架構設計

### 核心概念

#### 1.1 AI Agent 的本質

**AI Agent ≠ LLM**，而是一個完整的自主軟體系統：

```
┌─────────────────────────────────────┐
│          AI Agent 系統               │
│                                     │
│  ┌──────┐   ┌──────┐   ┌──────┐   │
│  │Model │   │Tools │   │Orch. │   │
│  │ 大腦  │   │  手  │   │ 神經  │   │
│  │      │   │      │   │ 系統  │   │
│  └──────┘   └──────┘   └──────┘   │
│                                     │
│           ┌──────┐                 │
│           │Deploy│                 │
│           │ 身體  │                 │
│           └──────┘                 │
└─────────────────────────────────────┘
```

**核心架構四要素：**

| 組件 | 類比 | 功能描述 |
|------|------|---------|
| **Model** | 大腦 | 核心推理引擎 - 分析、規劃、決策 |
| **Tools** | 手 | 連接外部世界 - 存取資訊、執行動作 |
| **Orchestration Layer** | 神經系統 | 管理 Think-Act-Observe 循環 |
| **Deployment** | 身體 | 雲端託管 - 提供可擴展服務 |

#### 1.2 Think-Act-Observe 循環

所有 AI Agent 的核心工作流程：

```
1. Get the Mission (接收任務)
   ↓
2. Scan the Scene (掃描環境與上下文)
   ↓
3. Think It Through (推理與規劃)
   ↓
4. Take Action (使用工具執行)
   ↓
5. Observe & Iterate (觀察回饋，重新推理)
   ↓
   [循環直到任務完成]
```

**關鍵洞察：** Agent 不是「一次性回應」，而是**持續迭代改進**的問題解決過程。

#### 1.3 Agent 能力分級 (Level 0-4)

| 級別 | 名稱 | 能力描述 | 應用場景 |
|------|------|---------|---------|
| **Level 0** | 純推理模型 | 僅依賴預訓練知識 | 文字生成、基礎問答 |
| **Level 1** | 工具連結 Agent | 可查詢即時資訊、呼叫 API | 搜尋助手、資料查詢 |
| **Level 2** | 策略型 Agent | 具備上下文工程、多步驟規劃 | 複雜任務規劃、決策系統 |
| **Level 3** | 多 Agent 協作 | 專家團隊分工、管理者協調 | 企業工作流程、研究系統 |
| **Level 4** | 自我演化系統 | 自動創建工具和新 Agent | AlphaEvolve、Co-Scientist |

### 多 Agent 系統架構

#### 為什麼需要多 Agent？

**單一 Agent 的局限：**
- 指令過長且複雜，難以維護
- 無法確定失敗點，除錯困難
- 職責混雜，可靠性降低

**多 Agent 系統的優勢：**
- **模組化設計** - 職責單一明確
- **易於測試** - 獨立測試各組件
- **可維護性高** - 修改影響範圍小
- **協作增強** - 專家團隊比全能選手更可靠

#### 四種核心架構模式

##### 1. LLM 協調者（動態決策）

**適用場景：** 需要靈活、動態的任務分配

```python
# 專家 Agent
research_agent = Agent(
    name="ResearchAgent",
    instruction="使用 google_search 尋找相關資訊",
    tools=[google_search],
    output_key="research_findings"
)

summarizer_agent = Agent(
    name="SummarizerAgent",
    instruction="閱讀 {research_findings}，建立簡潔摘要",
    output_key="final_summary"
)

# 協調 Agent
root_agent = Agent(
    name="ResearchCoordinator",
    instruction="先呼叫 ResearchAgent，再呼叫 SummarizerAgent",
    tools=[AgentTool(research_agent), AgentTool(summarizer_agent)]
)
```

**優點：** 靈活、適應性強
**缺點：** 執行順序不可預測

##### 2. Sequential Agent（順序執行）

**適用場景：** 需要保證執行順序的線性流程

```python
from google.adk.agents import SequentialAgent

# 定義各階段 Agent
outline_agent = Agent(name="OutlineAgent", instruction="建立大綱")
writer_agent = Agent(name="WriterAgent", instruction="撰寫內容")
editor_agent = Agent(name="EditorAgent", instruction="編輯潤飾")

# 建立順序工作流程
root_agent = SequentialAgent(
    name="BlogPipeline",
    sub_agents=[outline_agent, writer_agent, editor_agent]
)
```

**優點：** 確定順序、可預測、易除錯
**缺點：** 速度慢（需等待前一步完成）

##### 3. Parallel Agent（並行執行）

**適用場景：** 多個獨立任務需同時執行

```python
from google.adk.agents import ParallelAgent

# 並行研究 Agents
tech_researcher = Agent(name="TechResearcher", tools=[google_search])
health_researcher = Agent(name="HealthResearcher", tools=[google_search])
finance_researcher = Agent(name="FinanceResearcher", tools=[google_search])

# 並行執行
parallel_team = ParallelAgent(
    name="ParallelResearchTeam",
    sub_agents=[tech_researcher, health_researcher, finance_researcher]
)
```

**優點：** 快速、高效
**缺點：** 不適用於相依任務

##### 4. Loop Agent（循環執行）

**適用場景：** 需要迭代改進的任務

```python
from google.adk.agents import LoopAgent

# 評論與改進循環
critic_agent = Agent(
    name="Critic",
    instruction="評論內容，若好則說 'APPROVED'，否則提供改進建議"
)

refiner_agent = Agent(
    name="Refiner",
    instruction="根據評論改進內容，若 APPROVED 則呼叫 exit_loop",
    tools=[FunctionTool(exit_loop)]
)

# 組合循環
refinement_loop = LoopAgent(
    name="RefinementLoop",
    sub_agents=[critic_agent, refiner_agent],
    max_iterations=3  # 防止無限循環
)
```

**優點：** 迭代改進、品質保證
**缺點：** 需設定最大次數

#### 架構模式選擇決策樹

```
任務需求？
├─ 固定流程 (A→B→C)
│  └─ 使用 SequentialAgent
│
├─ 獨立並行任務 (同時執行 A, B, C)
│  └─ 使用 ParallelAgent
│
├─ 迭代改進 (A⇆B 反覆優化)
│  └─ 使用 LoopAgent
│
└─ 動態決策 (讓 LLM 決定)
   └─ 使用 LLM Orchestrator
```

### Day 1 關鍵收穫

✅ **概念突破：** AI Agent 不是聊天機器人，而是具備自主問題解決能力的完整軟體系統
✅ **架構思維：** 從「單一全能 Agent」轉向「專家團隊協作」的設計哲學
✅ **工程實踐：** 掌握從理論到實作的完整開發流程

---

## 🔧 Day 2：工具整合與 MCP 協定

### 核心概念

#### 2.1 從 LLM 到 Agent 的演進

```
LLM (大型語言模型) = 只會「想」（推理與規劃）
                    ↓
Agent = 會「想」+ 會「做」（透過工具執行動作）
```

**為什麼 Agent 需要工具？**

沒有工具，LLM 的知識凍結在訓練時間點，無法：
- 存取即時資訊（新聞、庫存）
- 執行現實世界的動作（發送郵件、預訂會議）

#### 2.2 三種工具類型

| 類型 | 說明 | 範例 |
|-----|------|------|
| **Function Tools** | 自訂 Python 函數 | `get_exchange_rate()`, `calculate_fee()` |
| **Built-in Tools** | 平台內建工具 | Google Search, Code Executor |
| **Agent Tools** | 將其他 Agent 作為工具 | 主 Agent 委派給專家 Agent |

#### 2.3 工具設計 5 條黃金準則

1. **文件即合約** - 清楚的名稱、描述、參數說明
2. **描述任務，非實作細節** - 讓 LLM 負責「想」，工具負責「做」
3. **任務級封裝** - 暴露「可用任務」而非低層 API
4. **輸出要精簡** - 避免大量原始資料塞回上下文
5. **錯誤要可恢復** - 提供可指導修正的錯誤訊息

### MCP (Model Context Protocol)

#### 2.4 MCP 是什麼？

一個**開放標準**，讓 AI Agent 能以統一介面連接外部工具與服務。

**核心架構：**

```
Host (主程式) ← Client (通訊模組) → Server (工具供應端)
                  ↓
              JSON-RPC 2.0
                  ↓
         stdio / Streamable HTTP
```

**MCP 優勢：**
- ✅ **標準化整合** - 降低 N×M 客製整合成本
- ✅ **生態系重用** - 使用社群已建立的工具
- ✅ **可替換架構** - 模型與平台可靈活替換

#### 2.5 MCP 工具定義要點

```python
{
    "name": "getTinyImage",              # 工具名稱
    "description": "生成小圖片",          # 清楚描述
    "inputSchema": {                     # 必填 - 定義輸入格式
        "type": "object",
        "properties": {
            "width": {"type": "number"},
            "height": {"type": "number"}
        }
    },
    "outputSchema": {...}                # 選填，建議提供
}
```

**錯誤處理：** `isError=true` + 可恢復訊息

### 長時間運行操作 (LRO)

#### 2.6 暫停與恢復機制

**使用場景：** 需要人工審批的操作

```python
def place_shipping_order(num_containers: int, tool_context: ToolContext):
    # 場景 1: 小訂單 - 直接批准
    if num_containers <= 5:
        return {"status": "approved"}

    # 場景 2: 第一次呼叫 - 請求批准
    if not tool_context.tool_confirmation:
        tool_context.request_confirmation(hint="需要批准")
        return {"status": "pending"}

    # 場景 3: 恢復執行 - 處理批准結果
    if tool_context.tool_confirmation.confirmed:
        return {"status": "approved"}
```

**可恢復 App：**

```python
shipping_app = App(
    root_agent=shipping_agent,
    resumability_config=ResumabilityConfig(is_resumable=True)
)
```

### 實作要點

#### 自訂 Function Tools

```python
def get_exchange_rate(base_currency: str, target_currency: str) -> dict:
    """查詢匯率 - 清楚的 docstring 說明工具用途"""
    # 實際應用會呼叫真實 API
    return {"status": "success", "rate": 0.93}

# Agent 使用工具
currency_agent = LlmAgent(
    tools=[get_exchange_rate, get_fee_for_payment_method]
)
```

#### Agent 作為工具

```python
# 建立專門的計算 Agent
calculation_agent = LlmAgent(
    name="CalculationAgent",
    instruction="執行數學計算"
)

# 主 Agent 使用子 Agent
main_agent = LlmAgent(
    tools=[AgentTool(agent=calculation_agent)]
)
```

#### MCP 整合

```python
# 連接 MCP Server
mcp_toolset = McpToolset(
    server="@modelcontextprotocol/server-everything"
)

# 使用 MCP 工具
agent = LlmAgent(
    tools=[mcp_toolset]
)
```

### 企業級考量

#### 安全與治理

**Confused Deputy 風險：** 低權限用戶誘使 AI 執行高權限操作

**解決方案：**
- 在 MCP 外層加 **API Gateway**
- 實施細粒度授權 (RBAC/ABAC)
- 強制 Human-in-the-Loop (HITL) 審批
- 稽核日誌與遙測

#### 規模化挑戰

**問題：** 大量工具導致 Context 膨脹

**解法：** **Tool Retrieval**（類似 RAG，先檢索再載入）

### Day 2 關鍵收穫

✅ **理解 LLM 與 Agent 的差異**
✅ **掌握工具設計的最佳實務**
✅ **能夠整合 MCP 外部服務**
✅ **實作長時間運行操作與人工審批**
✅ **理解企業級安全與治理考量**

---

## 💾 Day 3：上下文工程與記憶管理

### 核心概念

#### 3.1 情境工程（Context Engineering）

**定義：** 動態組裝和管理 LLM 上下文窗口中資訊的過程

**為什麼重要？**
- LLM 本質上是**無狀態的**
- 其感知僅限於單一 API 呼叫的「上下文窗口」
- CE 讓 Agent 能夠**記憶、學習和個人化互動**

#### 3.2 情境組件三大類

| 組件類型 | 內容 | 用途 |
|---------|------|------|
| **推理指導** | 系統指令、工具定義、少樣本範例 | 指導 Agent 如何思考 |
| **證據數據** | 長期記憶、外部知識（RAG） | 提供事實依據 |
| **即時資訊** | 對話歷史、State/Scratchpad | 維持對話連貫性 |

#### 3.3 情境管理循環

```
1. Fetch Context (獲取上下文)
   ↓ [檢索記憶、RAG、對話歷史]
2. Prepare Context (準備上下文)
   ↓ [動態構建完整提示 - 阻塞性操作]
3. Invoke (調用 LLM 和工具)
   ↓ [迭代執行]
4. Upload Context (上傳上下文)
   ↓ [非同步背景儲存新資訊]
```

**關鍵洞察：**
- 步驟 1-3 在「熱路徑」上，必須快速
- 步驟 4 應在背景非同步執行

### Session（會話）：當下的工作台

#### 3.4 Session 的本質

**定義：** 單一、連續對話的即時容器

**組成部分：**

```python
Session {
    events: [                        # 時間順序的對話記錄
        Event(type="user_input"),
        Event(type="agent_response"),
        Event(type="tool_call"),
        Event(type="tool_output")
    ],
    state: {                         # 結構化的工作記憶
        "user:name": "Sam",
        "cart:items": [...]
    }
}
```

#### 3.5 Session 管理實作

**初始化 Session Service：**

```python
from google.adk.sessions import DatabaseSessionService

# 使用 SQLite 資料庫持久化
db_url = "sqlite:///my_agent_data.db"
session_service = DatabaseSessionService(db_url=db_url)

runner = Runner(
    agent=chatbot_agent,
    app_name="MyApp",
    session_service=session_service
)
```

**SessionService 類型比較：**

| Service | 持久性 | 適用場景 |
|---------|--------|----------|
| **InMemorySessionService** | ❌ | 快速原型開發 |
| **DatabaseSessionService** | ✅ | 中小型應用 |
| **Agent Engine Sessions** | ✅ | 企業級規模 |

#### 3.6 Context Compaction（上下文壓縮）

**問題：** 長對話 = 大量 Events → 效能降低 + 成本增加

**解決方案：**

```python
from google.adk.apps.app import App, EventsCompactionConfig

app_with_compaction = App(
    name="research_app",
    root_agent=chatbot_agent,
    events_compaction_config=EventsCompactionConfig(
        compaction_interval=3,  # 每 3 次對話後觸發壓縮
        overlap_size=1          # 保留 1 次對話作為重疊
    )
)
```

**壓縮策略比較：**

| 策略 | 方法 | 優點 | 缺點 |
|------|------|------|------|
| **保留最後 N 輪** | 僅保留最近對話 | 簡單、快速 | 可能遺失重要歷史 |
| **Token 截斷** | 計算 token 數限制 | 可預測成本 | 機械式切割 |
| **遞歸總結** | AI 生成歷史摘要 | 保留關鍵資訊 | 計算成本高 |

#### 3.7 Session State 管理

**建立自訂工具：**

```python
def save_userinfo(tool_context: ToolContext, user_name: str, country: str):
    """儲存用戶資訊到 Session State"""
    tool_context.state["user:name"] = user_name
    tool_context.state["user:country"] = country
    return {"status": "success"}

def retrieve_userinfo(tool_context: ToolContext):
    """從 Session State 檢索用戶資訊"""
    return {
        "user_name": tool_context.state.get("user:name"),
        "country": tool_context.state.get("user:country")
    }
```

### Memory（記憶）：跨 Session 的持久化知識

#### 3.8 Memory 的核心價值

**定義：** 從對話或數據中提取和整合的有意義資訊快照

**三大核心功能：**

```
1. 個人化 (Personalization)
   └─ 記住用戶偏好、習慣、特徵

2. 上下文窗口管理 (Context Window Management)
   └─ 透過摘要和事實提取縮減 token 使用

3. Agent 自我改進 (Self-Improvement)
   └─ 記錄成功策略（程序性記憶）
```

#### 3.9 Memory vs RAG 的關鍵差異

| 特徵 | RAG 引擎 | Memory 管理器 |
|------|---------|--------------|
| **主要目標** | 注入外部事實性知識 | 創造個人化體驗 |
| **數據源** | 靜態外部文件 | **用戶對話** |
| **隔離級別** | 共享（Global） | **高度隔離（Per-User）** |
| **作用** | 使 Agent 成為**事實專家** | 使 Agent 成為**使用者專家** |
| **更新頻率** | 低（預先索引） | 高（持續學習） |

**類比理解：**
- RAG = 查閱百科全書（事實查詢）
- Memory = 與老朋友對話（個人化互動）

#### 3.10 Memory 工作流程

**三步驟流程：**

```
1. Initialize（初始化）
   └─ 建立 MemoryService 並提供給 Agent

2. Ingest（攝取）
   └─ 使用 add_session_to_memory() 將 Session 轉化為 Memory

3. Retrieve（檢索）
   └─ 使用 search_memory() 或工具檢索記憶
```

**實作範例：**

```python
from google.adk.memory import InMemoryMemoryService

# 1. 初始化 Memory Service
memory_service = InMemoryMemoryService()

runner = Runner(
    agent=user_agent,
    session_service=session_service,
    memory_service=memory_service
)

# 2. 攝取 Session 資料
session = await session_service.get_session(...)
await memory_service.add_session_to_memory(session)

# 3. 檢索記憶
search_response = await memory_service.search_memory(
    query="What is the user's favorite color?"
)
```

#### 3.11 記憶檢索策略

**Option 1: load_memory（反應式）**

```python
from google.adk.tools import load_memory

user_agent = LlmAgent(
    instruction="使用 load_memory 工具在需要時回憶過去對話",
    tools=[load_memory]  # Agent 自行決定何時搜尋
)
```

**特點：**
- ✅ 更高效（節省 tokens）
- ⚠️ Agent 可能忘記搜尋

**Option 2: preload_memory（主動式）**

```python
from google.adk.tools import preload_memory

auto_memory_agent = LlmAgent(
    instruction="回答用戶問題",
    tools=[preload_memory]  # 每次對話前自動載入
)
```

**特點：**
- ✅ 保證 Memory 可用
- ⚠️ 效率較低（即使不需要也會搜尋）

#### 3.12 自動化 Memory 儲存

**使用 Callbacks：**

```python
async def auto_save_to_memory(callback_context):
    """每次 Agent 回合後自動儲存 Session 到 Memory"""
    await callback_context._invocation_context.memory_service.add_session_to_memory(
        callback_context._invocation_context.session
    )

auto_memory_agent = LlmAgent(
    tools=[preload_memory],
    after_agent_callback=auto_save_to_memory  # 自動儲存！
)
```

**Callback 類型完整列表：**

| Callback | 觸發時機 | 用途 |
|----------|---------|------|
| `before_agent_callback` | Agent 處理前 | 前置準備、驗證 |
| `after_agent_callback` | Agent 完成後 | 自動儲存、日誌記錄 |
| `before_tool_callback` | 工具調用前 | 權限檢查 |
| `after_tool_callback` | 工具調用後 | 結果處理 |
| `before_model_callback` | LLM 調用前 | 提示修改 |
| `after_model_callback` | LLM 調用後 | 回應過濾 |

#### 3.13 Memory Consolidation（記憶整合）

**問題：** 原始 Session 冗長，包含大量重複和噪音

**整合前後對比：**

```
【整合前】
User: "My favorite color is BlueGreen. I also like purple.
       Actually, I prefer BlueGreen most of the time."
Agent: "Great! I'll remember that."
User: "Thanks!"
Agent: "You're welcome!"

→ 儲存全部 4 則訊息（冗餘、冗長）

【整合後】
Memory: "User's favorite color: BlueGreen"

→ 儲存 1 個簡潔的事實
```

**整合流程：**

```
原始 Session Events
    ↓
LLM 分析對話
    ↓
提取關鍵事實（信號 vs 噪音）
    ↓
儲存簡潔的記憶
    ↓
與現有記憶合併（去重、解決衝突）
```

**整合操作：**
- **CREATE** - 建立新記憶
- **UPDATE** - 更新現有記憶
- **DELETE/INVALIDATE** - 刪除或作廢過時記憶

### Day 3 關鍵收穫

✅ **理解情境工程的本質和重要性**
✅ **掌握 Session 和 Memory 的區別與應用**
✅ **能建立持久化的會話管理系統**
✅ **實作上下文壓縮和記憶整合**
✅ **理解 RAG 與 Memory 的協同使用**

---

## 📊 Day 4：品質觀測與評估

### 核心概念

#### 4.1 Agent Quality 的典範轉移

**傳統軟體 vs AI Agent：**

| 面向 | 傳統軟體 | AI Agent |
|------|---------|----------|
| **行為特性** | 確定性、可預測 | 非確定性、不可預測 |
| **失敗模式** | 明確崩潰（500 錯誤） | 微妙退化（幻覺、漂移） |
| **品質保證** | 測試階段驗證 | 架構支柱，從設計開始 |
| **評估重點** | "建對了嗎？" | "建對的了嗎？" |

#### 4.2 Agent Quality 的四大支柱

1. **有效性（Effectiveness）**
   - Agent 是否成功實現用戶的實際意圖？
   - 評估最終的「黑箱」結果

2. **效率（Efficiency）**
   - 是否用最少資源解決問題？
   - 衡量：總代幣量、延遲、軌跡複雜度

3. **穩健性（Robustness）**
   - 如何應對真實世界的混亂？
   - 優雅失敗 vs 崩潰或幻覺

4. **安全與一致性（Safety & Alignment）**
   - 是否在道德邊界和約束內運作？
   - 包括負責任 AI 和防範提示注入

### 可觀測性：三大支柱

#### 4.3 日誌（Logs）：Agent 的「日記」

**定義：** 記錄離散事件的原始、不可變事實

**作用：** 回答「發生了什麼事？」

**關鍵要素：**
- 結構化 JSON 格式
- 完整上下文（提示/回應配對）
- 中間推理步驟（思維鏈）
- 結構化工具呼叫（輸入、輸出、錯誤）

**實作：**

```python
import logging

logging.basicConfig(
    filename="logger.log",
    level=logging.DEBUG,
    format="%(filename)s:%(lineno)s %(levelname)s:%(message)s"
)
```

#### 4.4 追蹤（Traces）：行動的「因果關係」敘事

**定義：** 將個別日誌條目連接成連貫故事的敘事線索

**作用：** 回答「為什麼發生？」

**關鍵特性：**
- 跟隨單一任務的完整過程
- 揭示事件間的因果關係
- 基於 OpenTelemetry 標準
- 通過 `trace_id` 連結操作
- 附帶豐富元數據（延遲、代幣計數）

**診斷價值：** 揭示完整因果鏈（例如：RAG 搜索失敗 → 後續工具呼叫問題）

#### 4.5 指標（Metrics）：性能的「健康報告」

**定義：** 對日誌和追蹤數據聚合後的量化健康評分

**作用：** 回答「平均表現如何？」

**類型：**

| 指標類型 | 內容 | 範例 |
|---------|------|------|
| **系統指標** | 營運健康狀況 | 延遲（P50/P99）、錯誤率、每任務代幣量 |
| **品質指標** | 推理和輸出品質 | 正確性、軌跡遵循度、幫助性評分、幻覺率 |

### 評估藝術

#### 4.6 由外而內的評估層次

**階段 1：黑箱視圖（Outside-In）**

**重點：** 評估最終輸出

**關注指標：**
- 任務成功率
- 用戶滿意度

**階段 2：玻璃箱視圖（Inside-Out）**

**重點：** 系統性評估執行軌跡

**檢查要點：**
1. **LLM 規劃** - 核心推理是否正確？
2. **工具使用** - 是否選擇正確的工具？
3. **工具回應解讀** - 是否識別錯誤狀態？
4. **RAG 性能** - 檢索是否相關且最新？

#### 4.7 評估者的選擇

**1. LLM-as-a-Judge**

**適用場景：** 評估定性方面（如摘要品質）

**方法：** 使用強大 LLM（如 Gemini Advanced）

**技巧：** 配對比較提高可靠性

**優勢：** 提供規模化評估

**注意五大偏誤：**
1. Preference Bias（偏好偏誤）
2. Verbosity Bias（冗長偏誤）
3. Sycophancy（討好性行為）
4. Score Bias（分數偏誤）
5. Outcome Bias（結果偏誤）

**2. Agent-as-a-Judge**

**適用場景：** 評估完整執行追蹤

**評估對象：** 計畫品質和工具使用邏輯

**特點：** 超越最終輸出，深入過程

**3. Human-in-the-Loop (HITL)**

**不可或缺的場景：**
- 深度主觀性判斷
- 複雜領域知識
- 道德一致性驗證
- 建立黃金標準數據集

**核心原則：** 人類是仲裁者

### 實作技術

#### 4.8 Plugins 與 Callbacks 架構

**Plugin：** 在 Agent 生命週期各階段自動執行的程式碼模組

```python
class CustomPlugin(BasePlugin):
    # Agent 呼叫前後
    async def before_agent_callback(...)
    async def after_agent_callback(...)

    # 工具呼叫前後
    async def before_tool_callback(...)
    async def after_tool_callback(...)

    # LLM 呼叫前後
    async def before_model_callback(...)
    async def after_model_callback(...)

    # 錯誤處理
    async def on_model_error_callback(...)
```

**LoggingPlugin 優勢：**
- 自動捕獲所有 Agent 活動
- 無需手動編寫每個 callback
- 標準化的可觀測性資料

#### 4.9 評估配置與執行

**步驟 1：建立評估配置**

```json
{
  "criteria": {
    "tool_trajectory_avg_score": 1.0,
    "response_match_score": 0.8
  }
}
```

**步驟 2：建立測試案例**

```json
{
  "eval_set_id": "test_suite",
  "eval_cases": [
    {
      "eval_id": "test_case_1",
      "conversation": [
        {
          "user_content": {...},
          "final_response": {...},
          "intermediate_data": {
            "tool_uses": [...]
          }
        }
      ]
    }
  ]
}
```

**步驟 3：執行評估**

```bash
adk eval agent_dir evalset.json \
  --config_file_path=test_config.json \
  --print_detailed_results
```

#### 4.10 評估指標深度解析

**Response Match Score（回應匹配分數）**
- **範圍：** 0.0 - 1.0
- **意義：** 實際回應與預期回應的相似度
- **閾值建議：** 0.8（80% 相似度）

**Tool Trajectory Score（工具軌跡分數）**
- **範圍：** 0.0 - 1.0
- **意義：** 工具使用的正確性
- **檢查項目：** 工具選擇、參數正確性、呼叫序列
- **閾值建議：** 1.0（完美匹配）

### Agent Quality Flywheel

**持續改進循環：**

```
設計可評估的架構
    ↓
實施可觀測性（Logs + Traces + Metrics）
    ↓
執行系統化評估（自動化 + 人工）
    ↓
分析軌跡找出問題
    ↓
基於數據改進 Agent
    ↓
重新評估驗證改進
    ↓
（循環）
```

**三大核心原則：**

1. **評估作為架構支柱** - 從設計開始考慮可評估性
2. **軌跡才是真相** - 評估完整「思維過程」
3. **人類是仲裁者** - 自動化提供規模，人類提供細微判斷

### Day 4 關鍵收穫

✅ **理解可觀測性三支柱：Logs、Traces、Metrics**
✅ **掌握黑箱與玻璃箱評估方法**
✅ **實施 LLM-as-a-Judge 與 HITL 評估**
✅ **建立系統化的評估配置與執行流程**
✅ **理解品質飛輪的持續改進機制**

---

## 🚀 Day 5：從原型到生產環境

### 核心概念

#### 5.1 AgentOps：AI 代理程式營運

**80% 工作精力花在基礎設施、安全性和驗證上**

**Agent 的獨特特性：**
- **自主互動** - 能夠自己決策和執行
- **有狀態** - 記憶和上下文管理
- **動態執行路徑** - 每次推理路徑可能不同（非確定性）

#### 5.2 AgentOps 團隊組成

**傳統角色：**
- 雲端平台團隊
- 資料工程團隊
- MLOps 團隊

**GenAI 時代新角色：**
- **提示工程師（Prompt Engineers）** - 定義模型問答規範
- **AI 工程師（AI Engineers）** - 擴展到生產環境，建立穩健後端

### 投入生產的核心原則

#### 5.3 評估門控部署

**關鍵原則：** Agent 版本接觸用戶前，必須通過全面評估

**為什麼需要評估完整軌跡？**
> Agent 可能「走錯路但抵達正確答案」，這在生產環境是危險的

**評估內容：**
- 針對「黃金資料集」測試
- 評估行為品質
- 檢查防護欄違規
- 測試提示注入漏洞

#### 5.4 自動化 CI/CD 管線

**三個階段：**

```
1. Pre-Merge CI (預合併整合)
   ↓
   快速檢查：單元測試、程式碼規範
   運行 Agent 品質評估套件
   失敗會防止合併至主分支

2. Post-Merge Validation in Staging (暫存環境驗證)
   ↓
   部署到與生產高度相似的暫存環境
   更全面測試：負載測試、整合測試
   內部用戶測試（Dogfooding）

3. Gated Deployment to Production (門控部署到生產)
   ↓
   通過暫存驗證的部署產物
   需要產品負責人最終簽核
```

#### 5.5 安全發布策略

**Canary（金絲雀）** - 從 1% 用戶開始，逐漸擴大流量

**Blue-Green（藍綠）** - 運行兩個相同環境，即時切換流量

**A/B Testing（A/B 測試）** - 比較不同 Agent 版本的業務指標

**基礎：** 嚴格的版本控制，以便即時回滾

### 生產營運的持續迴圈

#### 5.6 觀察（Observe）→ 行動（Act）→ 演化（Evolve）

**觀察 - Agent 的感官系統：**
1. **日誌（Logs）** - 粒狀事實日記
2. **追蹤（Traces）** - 連接日誌的敘事
3. **指標（Metrics）** - 彙總報告卡

**行動 - 即時干預：**
- 管理系統健康（無狀態設計、異步處理）
- 管理風險（斷路器、HITL 審核、快速補丁）

**演化 - 長期改進：**
1. 分析生產資料
2. 將生產失敗轉化為新測試案例
3. 更新評估資料集
4. 提交改進並觸發自動化管線
5. 透過安全發布策略部署

### Agent2Agent (A2A) 協定

#### 5.7 為什麼需要 A2A？

**挑戰：**
- 單一 Agent 無法做所有事情
- Agent 需要協作
- 不同團隊建立不同 Agent
- Agent 可能使用不同語言/框架

**解決方案：** 標準化的 A2A 協定

#### 5.8 A2A Protocol 的核心價值

讓不同的 AI Agent 可以：
- ✨ **透過網路通訊** - Agent 可在不同機器上
- ✨ **跨框架工作** - 語言/框架無關
- ✨ **使用彼此的能力** - 一個 Agent 可調用另一個如同工具
- ✨ **維護正式契約** - Agent Cards 描述能力

#### 5.9 A2A 的三大應用場景

1. **跨框架整合** - ADK Agent 與其他框架 Agent 通訊
2. **跨語言通訊** - Python Agent 呼叫 Java 或 Node.js Agent
3. **跨組織邊界** - 內部 Agent 整合外部供應商服務

#### 5.10 A2A vs MCP 的區別

| 協定 | 定義 | 適用場景 |
|------|------|----------|
| **A2A** | 高層次、有狀態的複雜目標委託 | 委派複雜目標、跨團隊/跨框架協作 |
| **MCP** | 簡單、無狀態的工具整合標準 | 執行明確定義、結構化的輸入/輸出原語 |

**汽車維修店比喻：**
- **A2A** - 顧客與「商店經理」Agent 對話，經理委託「機械師」Agent
- **MCP** - 「機械師」Agent 使用 MCP 呼叫工具（掃描錯誤、查詢手冊）

#### 5.11 Agent Card 的重要性

**Agent Card：** Agent 的「名片」，標準化 JSON 規格

**描述內容：**
- Agent 功能、安全性要求
- 聯繫方式（URL）
- 技能（Skills）列表
- 協定版本和端點

**標準路徑：** `/.well-known/agent-card.json`

### A2A 通訊實作

#### 5.12 暴露 Agent（供應商端）

```python
# 建立 Product Catalog Agent
product_catalog_agent = LlmAgent(
    name="product_catalog_agent",
    description="外部供應商的產品目錄代理",
    instruction="提供產品資訊、價格和庫存狀態",
    tools=[get_product_info]
)

# 使用 to_a2a() 暴露 Agent
product_catalog_a2a_app = to_a2a(
    product_catalog_agent,
    port=8001
)

# 自動產生：
# - FastAPI/Starlette 伺服器
# - Agent Card
# - 標準端點: /.well-known/agent-card.json
# - A2A 協定處理
```

#### 5.13 消費 Agent（客戶端）

```python
# 建立遠端 Agent 的客戶端代理
remote_product_catalog_agent = RemoteA2aAgent(
    name="product_catalog_agent",
    description="遠端產品目錄代理",
    agent_card="http://localhost:8001/.well-known/agent-card.json"
)

# 建立客服 Agent
customer_support_agent = LlmAgent(
    name="customer_support_agent",
    description="協助客戶查詢產品資訊的客服助手",
    instruction="使用 product_catalog_agent 查詢產品資訊",
    sub_agents=[remote_product_catalog_agent]
)
```

#### 5.14 A2A 通訊流程

```
1. 客戶 → Customer Support Agent（用戶查詢）
2. Support Agent → 分析查詢，決定需要產品資訊
3. Support Agent → 呼叫 remote_product_catalog_agent
4. RemoteA2aAgent → 轉換為 A2A 協定請求
5. HTTP POST → http://localhost:8001/tasks
6. Product Catalog Agent → 收到請求，調用 get_product_info
7. Product Catalog Agent → 透過 A2A 協定回應
8. RemoteA2aAgent → 接收回應，傳回給 Support Agent
9. Support Agent → 整合資訊，生成友善回答
10. 客戶 ← 收到完整回應
```

### 部署到 Vertex AI Agent Engine

#### 5.15 為什麼需要生產環境？

**開發環境限制：**
- ❌ 只存在於筆記本和開發環境
- ❌ 會話停止時 Agent 停止工作
- ❌ 團隊成員無法訪問
- ❌ 沒有擴展性、可靠性保證

#### 5.16 Vertex AI Agent Engine 優勢

- **完全託管**服務，專為 AI Agent 設計
- **自動擴展**，內建會話管理
- **簡單部署**，使用 Agent Starter Pack
- 提供每月免費額度

#### 5.17 專案結構

```
sample_agent/
├── agent.py                  # Agent 邏輯
├── requirements.txt          # 依賴套件
├── .env                      # 環境配置
└── .agent_engine_config.json # 部署配置
```

**agent.py 核心邏輯：**

```python
from google.adk.agents import Agent

def get_weather(city: str) -> dict:
    """獲取指定城市的天氣資訊"""
    weather_data = {
        "san francisco": {"status": "success", "report": "晴天，72°F"},
        "tokyo": {"status": "success", "report": "晴朗，70°F"}
    }
    return weather_data.get(city.lower(), {"status": "error"})

root_agent = Agent(
    name="weather_assistant",
    model="gemini-2.5-flash-lite",
    description="提供城市天氣資訊的友善助手",
    instruction="識別城市、使用 get_weather 工具、以友善語氣回應",
    tools=[get_weather]
)
```

**.agent_engine_config.json 配置：**

```json
{
    "min_instances": 0,      // 不使用時縮減為零
    "max_instances": 1,      // 最多 1 個實例
    "resource_limits": {
        "cpu": "1",          // 1 CPU 核心
        "memory": "1Gi"      // 1 GB 記憶體
    }
}
```

#### 5.18 部署流程

**前置需求：**
1. 建立 GCP 帳戶（新用戶 $300 免費額度）
2. 啟用必要 API（Vertex AI、Cloud Storage、Logging）
3. 設定專案 ID

**部署命令：**

```bash
adk deploy agent_engine \
  --project=$PROJECT_ID \
  --region=$deployed_region \
  sample_agent \
  --agent_engine_config_file=sample_agent/.agent_engine_config.json
```

**測試已部署 Agent：**

```python
import vertexai
from vertexai import agent_engines

vertexai.init(project=PROJECT_ID, location=deployed_region)

agents_list = list(agent_engines.list())
remote_agent = agents_list[0]

# 測試 Agent
async for item in remote_agent.async_stream_query(
    message="What is the weather in Tokyo?",
    user_id="user_42"
):
    print(item)
```

#### 5.19 Vertex AI Memory Bank

**問題：** 會話記憶僅限單次對話

**解決方案：** Memory Bank 提供跨對話的長期記憶

**運作方式：**
1. **對話期間** - Agent 使用記憶工具搜尋過去事實
2. **對話之後** - 自動提取關鍵資訊
3. **下次會話** - Agent 自動回憶並使用該資訊

**範例場景：**

```
會話 1（今天）：
用戶："我偏好攝氏溫度"
Agent："好的，我會記住你偏好攝氏溫度"

會話 2（幾天後）：
用戶："東京天氣如何？"
Agent："東京晴朗，21°C"  ← 自動使用攝氏！
```

#### 5.20 清理資源

**防止意外收費：**

```python
agent_engines.delete(resource_name=remote_agent.resource_name, force=True)
```

### 安全性：三層防禦

#### 5.21 安全防護策略

**1. 政策定義（Policy Definition）**
- 將所需行為編程到系統指令中

**2. 防護欄與過濾（Guardrails and Filtering）**
- **輸入過濾** - 阻止惡意輸入
- **輸出過濾** - 檢查有害內容或 PII
- **人工審核（HITL）** - 對高風險行動暫停升級

**3. 持續保證與測試（Continuous Assurance）**
- 使用全面評估管線
- 主動「紅隊演練（Red Teaming）」

### Day 5 關鍵收穫

✅ **理解 AgentOps 概念和最後一哩路挑戰**
✅ **掌握 A2A 協定與多代理協作**
✅ **能部署到 Vertex AI Agent Engine**
✅ **實施 CI/CD 管線和安全發布策略**
✅ **建立生產環境的監控與演化機制**

---

## 🔧 核心技術棧整合

### 完整技術架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Environment                     │
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │   Gateway   │    │   Monitoring │    │   Security  │    │
│  │  (HITL/Auth)│    │(Logs/Traces) │    │ (Guardrails)│    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Vertex AI Agent Engine                    │   │
│  │                                                       │   │
│  │  ┌────────────┐   ┌────────────┐   ┌────────────┐ │   │
│  │  │  Agent 1   │   │  Agent 2   │   │  Agent 3   │ │   │
│  │  │   (ADK)    │◄─►│   (ADK)    │◄─►│   (ADK)    │ │   │
│  │  └────────────┘   └────────────┘   └────────────┘ │   │
│  │         ↕                ↕                ↕         │   │
│  │  ┌──────────────────────────────────────────────┐ │   │
│  │  │         A2A Protocol Layer                   │ │   │
│  │  └──────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MCP Tool Integration                   │   │
│  │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐    │   │
│  │  │ DB  │  │ API │  │Search│  │ Code│  │Files│    │   │
│  │  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘    │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↕                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         State Management                             │   │
│  │  ┌────────────┐              ┌────────────┐        │   │
│  │  │  Sessions  │              │   Memory   │        │   │
│  │  │ (短期記憶)  │              │  (長期記憶) │        │   │
│  │  └────────────┘              └────────────┘        │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### ADK (Agent Development Kit) 核心元件

| 組件 | 功能 | 關鍵類別 |
|------|------|---------|
| **Agents** | Agent 定義與編排 | `LlmAgent`, `SequentialAgent`, `ParallelAgent`, `LoopAgent` |
| **Models** | LLM 整合 | `Gemini`, `retry_options` |
| **Tools** | 工具定義與整合 | `FunctionTool`, `AgentTool`, `McpToolset`, `load_memory` |
| **Sessions** | 會話管理 | `InMemorySessionService`, `DatabaseSessionService` |
| **Memory** | 記憶管理 | `InMemoryMemoryService`, `VertexAiMemoryBankService` |
| **Runners** | 執行器 | `Runner`, `InMemoryRunner` |
| **Apps** | 應用配置 | `App`, `ResumabilityConfig`, `EventsCompactionConfig` |
| **Evaluation** | 評估框架 | `adk eval`, test_config.json, evalset.json |
| **Observability** | 可觀測性 | `LoggingPlugin`, Callbacks, OpenTelemetry |
| **A2A** | Agent 間通訊 | `to_a2a()`, `RemoteA2aAgent`, Agent Card |
| **Deployment** | 部署工具 | `adk deploy agent_engine`, Agent Starter Pack |

### 開發生命週期完整流程

```
Phase 1: Design & Prototype
┌─────────────────────────┐
│ 1. 定義 Agent 能力       │
│ 2. 選擇架構模式         │
│ 3. 設計工具集           │
│ 4. 本地開發測試         │
└─────────────────────────┘
          ↓
Phase 2: Development
┌─────────────────────────┐
│ 1. 實作 Agent 邏輯       │
│ 2. 整合 Tools/MCP       │
│ 3. 配置 Session/Memory  │
│ 4. 實施可觀測性         │
└─────────────────────────┘
          ↓
Phase 3: Quality Assurance
┌─────────────────────────┐
│ 1. 建立評估配置         │
│ 2. 建立 Golden Dataset  │
│ 3. 執行自動化評估       │
│ 4. HITL 人工審查        │
└─────────────────────────┘
          ↓
Phase 4: CI/CD Pipeline
┌─────────────────────────┐
│ 1. Pre-Merge CI         │
│ 2. Staging Validation   │
│ 3. Gated Production     │
│ 4. 版本控制             │
└─────────────────────────┘
          ↓
Phase 5: Production Release
┌─────────────────────────┐
│ 1. Canary/Blue-Green    │
│ 2. A/B Testing          │
│ 3. 監控與警報           │
│ 4. 即時回滾能力         │
└─────────────────────────┘
          ↓
Phase 6: Operations & Evolution
┌─────────────────────────┐
│ 1. Observe (觀察)        │
│ 2. Act (行動)            │
│ 3. Evolve (演化)         │
│ 4. 持續改進             │
└─────────────────────────┘
          ↓
     [循環回 Phase 3]
```

---

## 💡 最佳實踐總結

### Agent 設計原則

#### 1. 單一職責原則

```python
# ✅ 好的設計
research_agent = Agent(
    name="ResearchAgent",
    instruction="只使用 google_search 搜尋資訊",
    tools=[google_search]
)

# ❌ 避免的設計
do_everything_agent = Agent(
    name="SuperAgent",
    instruction="研究、撰寫、編輯、翻譯、事實查核",
    tools=[...]  # 太多職責
)
```

#### 2. 清晰具體的指令

```python
# ✅ 具體指令
instruction = """
1. 搜尋主題相關資訊
2. 提取 3 個關鍵發現並附上引用
3. 以條列方式格式化
"""

# ❌ 模糊指令
instruction = "做研究並讓它變好"
```

#### 3. 狀態管理最佳實踐

**命名慣例：**

```python
# ✅ 好的做法
tool_context.state["user:name"] = "Sam"
tool_context.state["app:theme"] = "dark"
tool_context.state["temp:calculation"] = 42

# ❌ 不好的做法
tool_context.state["name"] = "Sam"  # 不清楚作用域
tool_context.state["data"] = {...}  # 太通用
```

### 工具設計最佳實踐

#### 4. 完整的工具文件

```python
def get_exchange_rate(base_currency: str, target_currency: str) -> dict:
    """
    查詢兩種貨幣間的匯率

    Args:
        base_currency: 基礎貨幣代碼（如 'USD'）
        target_currency: 目標貨幣代碼（如 'EUR'）

    Returns:
        dict: {
            "status": "success" | "error",
            "rate": float,
            "error_message": str  # 僅在錯誤時
        }

    Example:
        >>> get_exchange_rate("USD", "EUR")
        {"status": "success", "rate": 0.93}
    """
    # 實作...
```

#### 5. 結構化回傳值

```python
# ✅ 結構化回傳
return {
    "status": "success",
    "data": {
        "temperature": 21,
        "condition": "sunny"
    }
}

# ❌ 純文字回傳
return "東京晴朗 21 度"  # Agent 難以解析
```

#### 6. 可恢復的錯誤處理

```python
def query_database(query: str) -> dict:
    try:
        result = db.execute(query)
        return {"status": "success", "data": result}
    except ConnectionError:
        return {
            "status": "error",
            "error_type": "connection_error",
            "message": "無法連接資料庫",
            "suggestion": "請檢查資料庫連線並重試"
        }
    except SyntaxError as e:
        return {
            "status": "error",
            "error_type": "syntax_error",
            "message": f"SQL 語法錯誤：{e}",
            "suggestion": "請檢查 SQL 查詢語法"
        }
```

### 評估與品質保證

#### 7. 建立全面的測試案例集

```json
{
  "eval_set_id": "comprehensive_test",
  "eval_cases": [
    {
      "eval_id": "normal_case_1",
      "description": "正常流程測試"
    },
    {
      "eval_id": "edge_case_1",
      "description": "邊緣案例測試"
    },
    {
      "eval_id": "error_case_1",
      "description": "錯誤處理測試"
    }
  ]
}
```

#### 8. 避免 LLM-as-Judge 偏誤

```python
# ✅ 使用明確的評分規範（Rubrics）
evaluation_rubric = """
評估以下面向（1-5 分）：
1. 事實正確性：答案是否基於可驗證事實？
2. 完整性：是否涵蓋所有必要資訊？
3. 清晰度：表達是否清楚易懂？
4. 引用品質：是否提供適當引用？

對每個面向給分並說明理由。
"""

# ❌ 避免自由形式評估
evaluation_instruction = "評估回應品質"  # 太模糊
```

#### 9. 人類審查關鍵點

```python
def execute_sensitive_operation(params, tool_context: ToolContext):
    """執行敏感操作，需要人類審批"""

    # 檢查是否為高風險操作
    if is_high_risk(params):
        # 請求人類確認
        tool_context.request_confirmation(
            hint=f"將執行敏感操作：{params}。是否繼續？"
        )

        # 等待確認
        if not tool_context.tool_confirmation.confirmed:
            return {"status": "cancelled", "reason": "用戶取消"}

    # 執行操作
    result = perform_operation(params)
    return result
```

### 生產部署最佳實踐

#### 10. 漸進式發布

```python
# Canary 發布策略
deployment_strategy = {
    "type": "canary",
    "stages": [
        {"traffic_percent": 1, "duration": "1h"},    # 1% 流量 1 小時
        {"traffic_percent": 10, "duration": "2h"},   # 10% 流量 2 小時
        {"traffic_percent": 50, "duration": "4h"},   # 50% 流量 4 小時
        {"traffic_percent": 100}                     # 全量發布
    ],
    "rollback_on_error_rate": 5  # 錯誤率超過 5% 自動回滾
}
```

#### 11. 全面的可觀測性

```python
from google.adk.plugins import LoggingPlugin

# 生產環境啟用完整日誌
logging_plugin = LoggingPlugin(
    log_level="INFO",
    include_context=True,
    include_tools=True,
    include_model_calls=True
)

agent = LlmAgent(
    plugins=[logging_plugin]
)
```

#### 12. 成本與效能優化

```python
# 根據任務複雜度選擇模型
simple_tasks_agent = Agent(
    model=Gemini(model="gemini-2.5-flash-lite")  # 快速、低成本
)

complex_tasks_agent = Agent(
    model=Gemini(model="gemini-2.5-pro")  # 強大、高成本
)

# 並行優化
parallel_team = ParallelAgent(
    sub_agents=[agent_a, agent_b, agent_c]  # 獨立任務並行
)

# 上下文壓縮
app = App(
    events_compaction_config=EventsCompactionConfig(
        compaction_interval=10,
        overlap_size=2
    )
)
```

### 安全性最佳實踐

#### 13. 多層防護

```python
# 1. 輸入過濾
def filter_input(user_input: str) -> dict:
    if contains_prompt_injection(user_input):
        return {"status": "blocked", "reason": "疑似提示注入"}
    return {"status": "ok", "filtered_input": user_input}

# 2. 輸出檢查
def check_output(agent_output: str) -> dict:
    if contains_pii(agent_output):
        return {"status": "blocked", "reason": "包含個人識別資訊"}
    if contains_harmful_content(agent_output):
        return {"status": "blocked", "reason": "包含有害內容"}
    return {"status": "ok", "output": agent_output}

# 3. 人工審核
def sensitive_agent_callback(callback_context):
    if is_sensitive_operation(callback_context):
        request_human_review(callback_context)
```

#### 14. 權限管理

```python
# 基於角色的存取控制（RBAC）
def check_permissions(user_id: str, operation: str) -> bool:
    user_role = get_user_role(user_id)

    permission_matrix = {
        "admin": ["read", "write", "delete", "deploy"],
        "developer": ["read", "write", "test"],
        "viewer": ["read"]
    }

    return operation in permission_matrix.get(user_role, [])

# 在工具中強制權限檢查
def delete_resource(resource_id: str, tool_context: ToolContext):
    user_id = tool_context.session.user_id

    if not check_permissions(user_id, "delete"):
        return {
            "status": "error",
            "message": "權限不足：需要刪除權限"
        }

    # 執行刪除操作
    ...
```

---

## 📚 延伸學習資源

### 官方文件

#### ADK (Agent Development Kit)
- [ADK 完整文件](https://google.github.io/adk-docs/)
- [Python 快速入門](https://google.github.io/adk-docs/get-started/python/)
- [Agents 概述](https://google.github.io/adk-docs/agents/)
- [工具開發](https://google.github.io/adk-docs/tools/)
- [MCP 工具](https://google.github.io/adk-docs/tools/mcp-tools/)
- [Sessions 管理](https://google.github.io/adk-docs/sessions/)
- [Memory 系統](https://google.github.io/adk-docs/sessions/memory/)
- [評估框架](https://google.github.io/adk-docs/evaluate/)
- [可觀測性](https://google.github.io/adk-docs/observability/logging/)
- [A2A 介紹](https://google.github.io/adk-docs/a2a/intro/)
- [部署指南](https://google.github.io/adk-docs/deploy/agent-engine/)

#### Vertex AI
- [Agent Engine 概述](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/overview)
- [Memory Bank 文件](https://cloud.google.com/vertex-ai/generative-ai/docs/agent-engine/memory-bank/overview)
- [Tracing 與監控](https://cloud.google.com/vertex-ai/docs/generative-ai/logging-and-monitoring)
- [安全最佳實踐](https://cloud.google.com/vertex-ai/docs/generative-ai/learn/responsible-ai)

#### 協定與標準
- [A2A Protocol 官方網站](https://a2a-protocol.org/)
- [A2A 協定規範](https://a2a-protocol.org/latest/spec/)
- [Model Context Protocol](https://spec.modelcontextprotocol.io/)
- [OpenTelemetry 文件](https://opentelemetry.io/docs/)

### 課程資源

#### 白皮書
- Day 1: Introduction to Agents
- Day 2: Agent Tools & Interoperability with MCP
- Day 3: Context Engineering - Sessions and Memory
- Day 4: Agent Quality - Observability and Evaluation
- Day 5: AgentOps - Prototype to Production

#### Kaggle Notebooks
- [Day 0: Troubleshooting and FAQs](https://www.kaggle.com/code/kaggle5daysofai/day-0-troubleshooting-and-faqs)
- [Day 2a: Agent Tools](https://www.kaggle.com/code/kaggle5daysofai/day-2a-agent-tools)
- [Day 2b: Agent Tools Best Practices](https://www.kaggle.com/code/kaggle5daysofai/day-2b-agent-tools-best-practices)
- [Day 3a: Agent Sessions](https://www.kaggle.com/code/kaggle5daysofai/day-3a-agent-sessions)
- [Day 3b: Agent Memory](https://www.kaggle.com/code/kaggle5daysofai/day-3b-agent-memory)
- [Day 4a: Agent Observability](https://www.kaggle.com/code/kaggle5daysofai/day-4a-agent-observability)
- [Day 4b: Agent Evaluation](https://www.kaggle.com/code/kaggle5daysofai/day-4b-agent-evaluation)

#### 影片資源
- [課程直播播放清單](https://www.youtube.com/c/kaggle)
- [NotebookLM Podcast 摘要系列](https://www.youtube.com/c/kaggle)

### 社群資源

- [Kaggle Discord](https://discord.com/invite/kaggle)
- [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack)
- [Generative AI Examples](https://github.com/GoogleCloudPlatform/generative-ai)

### 進階主題

#### 研究論文與案例
- **AlphaEvolve** - 自我演化的演算法優化系統
- **Co-Scientist** - 科學研究加速 Agent
- **NotebookLM** - 長期狀態管理實例

#### 開源專案
- MCP Servers 社群專案
- Agent Framework 比較研究
- Multi-Agent 協作範例

---

## 🎓 學習成果與應用

### 完成 5 天課程後，你已經能夠：

#### 基礎能力 ✅
- 理解 AI Agent 的本質與核心架構
- 建立單一 Agent 並配置工具
- 使用 ADK 進行開發和除錯
- 掌握 Think-Act-Observe 循環機制

#### 架構設計 ✅
- 設計多 Agent 協作系統
- 根據需求選擇合適的架構模式
- 理解狀態管理機制
- 能組合多種模式建立複雜系統

#### 工具整合 ✅
- 設計符合最佳實務的自訂工具
- 將 Python 函數轉換為 Agent 工具
- 使用 Agent Tools 實現專家分工
- 整合 MCP 外部服務
- 實作長時間運行操作與人工審批

#### 上下文管理 ✅
- 理解情境工程的本質
- 建立持久化的會話管理系統
- 實作上下文壓縮策略
- 建立跨對話的記憶系統
- 理解 RAG 與 Memory 的協同使用

#### 品質保證 ✅
- 實施可觀測性（Logs、Traces、Metrics）
- 建立系統化的評估配置
- 使用 LLM-as-a-Judge 與 HITL 評估
- 分析追蹤找出問題
- 建立持續改進的品質飛輪

#### 生產部署 ✅
- 理解 AgentOps 概念
- 實作 A2A 協定進行 Agent 間通訊
- 部署到 Vertex AI Agent Engine
- 實施 CI/CD 管線與評估門控
- 建立安全發布策略（Canary、Blue-Green）
- 實施生產環境監控與演化機制

### 可以建構的專案類型

#### 1. 企業應用
- **客戶服務系統** - 整合 FAQ、訂單查詢、產品推薦
- **IT 支援助手** - 故障排除、系統監控、自動化維護
- **文件處理系統** - 多 Agent 協作處理、分類、摘要文件

#### 2. 資料分析
- **資料分析助手** - 自動生成報表、視覺化、洞察
- **商業智慧 Agent** - 整合多數據源、趨勢分析、預測

#### 3. 個人助理
- **智能助理** - 行程管理、電子郵件分類、任務提醒
- **學習輔導** - 個人化教學、進度追蹤、資源推薦

#### 4. 專業領域
- **法律文件分析** - 合約審查、條款比較、風險評估
- **醫療諮詢輔助** - 病史整合、文獻檢索、治療建議
- **財務規劃** - 投資分析、風險評估、個人化建議

### 職業發展路徑

#### AI Agent 開發者
- 核心技能：Agent 架構設計、工具開發、系統整合
- 進階方向：多 Agent 系統、自我演化 Agent

#### 提示工程師
- 核心技能：指令設計、上下文工程、評估優化
- 進階方向：領域專業知識整合、品質保證

#### AI 工程師
- 核心技能：生產部署、可觀測性、維運管理
- 進階方向：大規模 Agent 系統、跨組織整合

#### AgentOps 工程師
- 核心技能：CI/CD 管線、監控告警、安全治理
- 進階方向：企業級 Agent 平台、多租戶管理

---

## 🎯 下一步行動

### 立即行動（今天）

1. **複習關鍵概念**
   - 回顧 5 天學習筆記
   - 整理重要程式碼範例
   - 標記不清楚的地方

2. **動手實作**
   - 建立第一個完整 Agent 專案
   - 整合至少 2-3 個工具
   - 實施基本的可觀測性

3. **社群參與**
   - 加入 Kaggle Discord
   - 分享學習心得
   - 提出問題與討論

### 短期目標（本週）

1. **深化技能**
   - 實作多 Agent 協作系統
   - 整合 MCP 外部服務
   - 建立評估配置與測試案例

2. **專案開發**
   - 選擇一個真實場景
   - 設計完整架構
   - 實作 MVP（最小可行產品）

3. **品質提升**
   - 實施全面的可觀測性
   - 建立 Golden Dataset
   - 執行系統化評估

### 中期目標（本月）

1. **生產部署**
   - 部署到 Vertex AI Agent Engine
   - 設置 CI/CD 管線
   - 實施監控與警報

2. **進階功能**
   - 實作 Memory Bank
   - 建立 A2A 通訊
   - 整合多個外部服務

3. **持續學習**
   - 深入研究白皮書
   - 探索進階 ADK 功能
   - 參與社群專案

### 長期目標（接下來幾個月）

1. **專業發展**
   - 成為 AI Agent 開發專家
   - 建立個人作品集
   - 分享知識與經驗

2. **系統優化**
   - 實施大規模部署
   - 優化成本與效能
   - 建立企業級治理

3. **創新探索**
   - 研究自我演化 Agent
   - 探索新的應用場景
   - 貢獻開源專案

---

## 🌟 總結與反思

### 5 天學習旅程的核心價值

這個密集課程不僅教授了 AI Agent 的技術知識，更重要的是建立了一套完整的思維框架：

1. **系統化思維**
   - 從單一 Agent 到多 Agent 系統
   - 從原型到生產環境
   - 從功能開發到品質保證

2. **工程化實踐**
   - 模組化設計
   - 標準化協定
   - 自動化流程

3. **企業級視角**
   - 安全性與治理
   - 可擴展性與維運
   - 成本與效能優化

### 關鍵洞察

#### Think-Act-Observe 是核心
所有 Agent 系統都圍繞這個循環展開，理解這點就理解了 Agent 的本質。

#### 模組化設計是王道
將複雜任務分解為簡單 Agent 的協作，比建立一個複雜 Agent 更可靠。

#### 架構模式有規律
Sequential（順序）、Parallel（並行）、Loop（循環）三種模式可組合出無限可能。

#### 評估從 Day Zero 開始
品質不是測試階段才考慮，而是從設計開始就融入架構的支柱。

#### 觀察-行動-演化是持續循環
無論是 Agent 系統還是個人學習，都需要這個持續改進的機制。

### 未來展望

AI Agent 技術正在快速發展：

- **技術演進** - 從 Level 1 工具使用，逐步邁向 Level 4 自我演化
- **應用擴展** - 從輔助工具進化為團隊成員
- **生態成熟** - 標準化協定、開源工具、社群資源日益豐富

作為 AI Agent 開發者，我們站在這個激動人心的技術前沿，有機會塑造未來的人機協作方式。

### 最後的話

> **"品質不是一次性的行為，而是一種習慣。" - Aristotle**

這句話不僅適用於 Agent 開發，也適用於我們的學習旅程。持續學習、持續實踐、持續改進，才是通往精通的道路。

感謝你完成這 5 天的學習旅程。現在，是時候將所學應用到實際專案中，建構出改變世界的 AI Agent！

---

**祝你建構出卓越的 AI Agent 系統！🚀**

---

## 📝 附錄

### A. 快速參考表

#### Agent 配置範本

```python
# 基礎 Agent
agent = Agent(
    name="AgentName",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    instruction="Clear instruction here.",
    tools=[tool1, tool2],
    output_key="output_key_name"
)

# Sequential Agent
sequential = SequentialAgent(
    name="Pipeline",
    sub_agents=[agent1, agent2, agent3]
)

# Parallel Agent
parallel = ParallelAgent(
    name="ParallelTeam",
    sub_agents=[agent1, agent2, agent3]
)

# Loop Agent
loop = LoopAgent(
    name="RefinementLoop",
    sub_agents=[critic, refiner],
    max_iterations=3
)
```

#### 常用工具導入

```python
from google.adk.agents import Agent, SequentialAgent, ParallelAgent, LoopAgent
from google.adk.models.google_llm import Gemini
from google.adk.runners import Runner, InMemoryRunner
from google.adk.tools import AgentTool, FunctionTool, google_search
from google.adk.tools import load_memory, preload_memory
from google.adk.sessions import InMemorySessionService, DatabaseSessionService
from google.adk.memory import InMemoryMemoryService
from google.adk.apps.app import App, EventsCompactionConfig, ResumabilityConfig
from google.adk.plugins import LoggingPlugin
from google.genai import types
```

### B. 常見問題排查

#### Agent 無回應
- ✅ 檢查 API Key 是否正確
- ✅ 確認網路連接
- ✅ 檢查日誌錯誤訊息
- ✅ 驗證模型名稱是否正確

#### 工具呼叫失敗
- ✅ 確認工具 docstring 完整
- ✅ 檢查參數型別標註
- ✅ 驗證工具返回格式
- ✅ 查看錯誤日誌

#### Session 資料遺失
- ✅ 確認使用 DatabaseSessionService
- ✅ 檢查資料庫連接
- ✅ 驗證 session_id 正確
- ✅ 確認資料持久化

#### Memory 無法檢索
- ✅ 確認已呼叫 add_session_to_memory
- ✅ 檢查 Memory Service 類型
- ✅ 驗證搜尋查詢
- ✅ 確認 user_id 隔離

#### 部署失敗
- ✅ 檢查 GCP 專案設定
- ✅ 確認 API 已啟用
- ✅ 驗證配置檔案格式
- ✅ 查看部署日誌

### C. 效能優化檢查清單

- [ ] 選擇適當的模型（Flash vs Pro）
- [ ] 實施上下文壓縮
- [ ] 使用並行 Agent（獨立任務）
- [ ] 優化工具輸出大小
- [ ] 配置合適的 min/max instances
- [ ] 實施 Memory Consolidation
- [ ] 使用 Tool Retrieval（大量工具時）
- [ ] 設置合理的 timeout

### D. 安全檢查清單

- [ ] 實施輸入過濾
- [ ] 實施輸出檢查
- [ ] 配置 HITL 審核
- [ ] 建立權限管理
- [ ] 實施 PII 塗銷
- [ ] 設置審計日誌
- [ ] 使用 API Gateway
- [ ] 定期安全審查

### E. 術語表

| 術語 | 英文 | 定義 |
|------|------|------|
| AI Agent | AI Agent | 具備推理、使用工具和執行任務能力的完整自主軟體系統 |
| Think-Act-Observe | Think-Act-Observe | Agent 核心工作循環：思考→行動→觀察 |
| ADK | Agent Development Kit | Google 的 Agent 開發工具包 |
| MCP | Model Context Protocol | 模型上下文協定，工具整合標準 |
| A2A | Agent2Agent Protocol | Agent 間通訊協定 |
| Session | Session | 單一對話的即時容器 |
| Memory | Memory | 跨對話的持久化知識 |
| RAG | Retrieval Augmented Generation | 檢索增強生成 |
| HITL | Human-in-the-Loop | 人工參與循環 |
| AgentOps | Agent Operations | AI 代理程式營運 |
| LLM | Large Language Model | 大型語言模型 |
| Orchestration | Orchestration | 編排、協調 |
| Observability | Observability | 可觀測性 |
| Trace | Trace | 追蹤、軌跡 |
| Golden Dataset | Golden Dataset | 黃金資料集、標準測試集 |

---

**文件資訊**
- **建立日期：** 2025-11-14
- **版本：** 1.0
- **作者：** Kuanter8
- **課程：** Kaggle × Google - 5-Day AI Agents Intensive Course
- **總頁數：** 約 150 頁（完整版）

---

**致謝**

感謝 Kaggle 與 Google 團隊提供如此優質的免費課程，以及所有參與講授的專家學者。特別感謝：
- Kanchana Patlolla, Anant Nawalgaria（課程主持）
- 所有白皮書作者與技術專家
- Kaggle 社群的支持與互動

**版權聲明**

本文件基於 Kaggle 5-Day AI Agents 課程內容整理，僅供個人學習使用。課程內容版權歸 Kaggle 與 Google 所有。

---

**🌐 相關連結**

- [Kaggle 課程首頁](https://www.kaggle.com/learn-guide/5-day-genai)
- [ADK 官方文件](https://google.github.io/adk-docs/)
- [Kaggle Discord 社群](https://discord.com/invite/kaggle)
- [A2A Protocol 官網](https://a2a-protocol.org/)
- [Vertex AI Console](https://console.cloud.google.com/vertex-ai)

---

**結束語**

這份總結文件整合了 5 天課程的所有核心內容，從基礎概念到進階應用，從理論知識到實作技巧，希望能成為你在 AI Agent 開發道路上的實用參考。

記住，學習只是起點，實踐才能帶來真正的成長。現在就開始建構你的第一個生產級 AI Agent 吧！

**Let's build amazing AI Agents together! 🤖✨**

# Vision-Language-Action 模型技術深度解析

## 從 VLA 技術演進到 Mantis 解耦視覺預見架構

**工程師實戰指南：如何將 AI 視覺語言動作模型應用於機器人開發**

---

## 目錄

1. [引言：機器人學習的新紀元](#引言機器人學習的新紀元)
2. [第一部分：VLA 技術全景](#第一部分vla-技術全景)
3. [第二部分：VLA 架構範式演進](#第二部分vla-架構範式演進)
4. [第三部分：代表性 VLA 模型](#第三部分代表性-vla-模型)
5. [第四部分：Mantis 模型深度解析](#第四部分mantis-模型深度解析)
6. [第五部分：工程師實戰指南](#第五部分工程師實戰指南)
7. [第六部分：工業應用展望](#第六部分工業應用展望)
8. [結語與資源彙整](#結語與資源彙整)

---

## 引言：機器人學習的新紀元

2024-2025 年見證了機器人學習領域的重大突破。**Vision-Language-Action (VLA) 模型**的出現代表了通向通用具身智能的重要里程碑。這類模型整合了視覺感知、語言理解和動作生成三大核心能力，使機器人能夠理解自然語言指令、感知複雜環境，並執行多樣化的操作任務。

本文將深入剖析 VLA 技術的發展脈絡，並以最新的 **Mantis** 模型為案例，詳細解析其創新的**解耦視覺預見（Disentangled Visual Foresight, DVF）**架構。最後，我們將提供實用的工程師入門指南，幫助您快速上手這項前沿技術。

> 💡 **為什麼這篇文章值得閱讀？**
> - 完整梳理 VLA 技術從 2022 年至今的發展脈絡
> - 深度解析 Mantis 論文的核心創新點
> - 提供可操作的工程師入門路徑
> - 探討與工業自動化的實際結合點

---

## 第一部分：VLA 技術全景

### 1.1 什麼是 VLA 模型？

Vision-Language-Action 模型是一類整合視覺、語言和動作的多模態基礎模型。給定機器人周圍環境的輸入圖像（或視頻）和文字指令，VLA 直接輸出可執行的低階機器人動作以完成所請求的任務。

**核心架構組成：**

```
┌─────────────────────────────────────────────────────────────┐
│                      VLA 模型架構                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│   │  視覺編碼器   │   │  語言模型主幹  │   │  動作解碼器   │   │
│   │(Vision Encoder)│  │(LLM Backbone) │   │(Action Decoder)│  │
│   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   │
│          │                  │                  │           │
│          ▼                  ▼                  ▼           │
│   ┌──────────────────────────────────────────────────┐     │
│   │              多模態融合層                          │     │
│   └──────────────────────────────────────────────────┘     │
│                          │                                  │
│                          ▼                                  │
│                   [機器人動作輸出]                           │
│                  (末端位置、關節角度、夾爪狀態)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**三大核心組件：**

| 組件 | 功能 | 典型實現 |
|------|------|----------|
| **視覺編碼器** | 處理相機輸入的圖像或視頻序列 | DINOv2, SigLIP, CLIP |
| **語言模型主幹** | 理解自然語言指令並進行推理 | Llama-2, Qwen2.5-VL, Gemma |
| **動作解碼器** | 將多模態表示轉換為可執行動作 | Diffusion Policy, Flow Matching |

### 1.2 VLA 解決的核心問題

傳統機器人系統面臨的挑戰：

1. **感知-規劃-執行的割裂**：傳統系統依賴孤立的感知管道和手工設計的控制策略，各模組間缺乏有效整合
2. **泛化能力不足**：在非結構化環境中表現不佳，難以應對訓練分佈外的場景
3. **語言理解缺失**：無法直接理解和執行自然語言命令，需要額外的意圖解析模組

VLA 通過提供**統一框架**，將語言建立在感知基礎上並映射到可執行動作，從根本上解決了上述問題。

### 1.3 VLA 發展三階段

```
時間軸：VLA 技術演進
════════════════════════════════════════════════════════════════

2022 Q4          2023 Q2          2024 Q3          2025 Q2
    │               │                │                │
    ▼               ▼                ▼                ▼
┌───────┐      ┌───────┐       ┌───────┐       ┌───────┐
│ RT-1  │      │ RT-2  │       │OpenVLA│       │Mantis │
│       │      │RT-2-X │       │  π₀   │       │GR00T  │
└───────┘      └───────┘       └───────┘       │ N1.5  │
                                               └───────┘
    ▲               ▲                ▲                ▲
    │               │                │                │
 早期採用期      概念形成期        快速增長期        成熟期
```

| 階段 | 時間範圍 | 關鍵里程碑 |
|------|----------|------------|
| **早期採用期** | 2022-2023 Q2 | RT-1、RT-2 發布，VLA 概念初步形成 |
| **快速增長期** | 2023 Q3-2024 Q3 | Open X-Embodiment 數據集、OpenVLA 開源 |
| **成熟期** | 2024 Q4-至今 | π₀、GR00T N1、Mantis 等工業級模型湧現 |

---

## 第二部分：VLA 架構範式演進

### 2.1 三大主流架構

當前 VLA 模型已收斂至三種主要架構範式，各有其優勢與適用場景：

#### 2.1.1 早期融合模型（Early Fusion Models）

在輸入階段將視覺和語言表示融合，然後再傳遞給策略模組。

**代表模型**：EF-VLA (ICLR 2025)

**核心優勢**：
- 保留 CLIP 預訓練期間建立的表示對齊
- 減少過擬合，增強泛化能力
- 在組合式操作任務上性能提升約 20%

```
早期融合架構示意：

    Image ──┐
            ├──► [CLIP Encoder] ──► [Frozen Fusion] ──► Policy
    Text ───┘
```

#### 2.1.2 雙系統架構（Dual-System Architectures）

受人類認知雙過程理論（System 1 & System 2）啟發，實現快速反應和慢速推理的分離。

**代表模型**：NVIDIA GR00T N1、Figure AI Helix

| 系統 | 特性 | 功能 | 延遲 |
|------|------|------|------|
| **System 1** | 快思考 | 基於擴散的即時控制策略 | ~10ms |
| **System 2** | 慢思考 | VLM 驅動的推理規劃 | ~100ms |

```
雙系統架構示意：

                    ┌─────────────────┐
    Instruction ───►│   System 2      │
    + Image         │ (VLM Reasoning) │
                    └────────┬────────┘
                             │ High-level Plan
                             ▼
                    ┌─────────────────┐
                    │   System 1      │───► Robot Actions
                    │ (DiT Control)   │     (30-50 Hz)
                    └─────────────────┘
```

#### 2.1.3 視覺增強動作學習

透過額外的視覺監督信號來補充稀疏的動作標註，主要有三種方法：

| 方法 | 描述 | 優點 | 缺點 |
|------|------|------|------|
| **視覺預見 (Visual Foresight)** | 預測未來幀來增強動作預測 | 提供密集監督 | 訓練成本高、收斂慢 |
| **軌跡引導 (Track Guidance)** | 壓縮視覺狀態為關鍵點軌跡 | 緊湊高效 | 信息瓶頸、精度受限 |
| **潛在動作監督 (Latent Action)** | 學習離散潛在動作作為輔助監督 | 更抽象的表示 | 需額外量化模型 |

### 2.2 動作表示技術

動作編碼是 VLA 架構的關鍵設計決策，直接影響模型的控制頻率和精度。

#### 離散 Token 輸出

將每個動作維度離散化為 token，與語言生成統一處理。

```python
# 典型的動作離散化（256 bins）
action_bins = 256
action_token = int((action_value - action_min) / (action_max - action_min) * action_bins)
```

**優點**：與 LLM 原生相容，易於擴展
**缺點**：高頻控制任務精度不足

#### Flow Matching / Diffusion Policy

使用生成模型直接輸出連續動作軌跡。

**代表**：π₀ 使用 flow-matching 達到 50Hz 控制頻率

```
Diffusion Policy 流程：

Noise ──► [Denoise Step 1] ──► ... ──► [Denoise Step N] ──► Action Chunk
              ▲                              ▲
              └──── Conditioning (VLM Features) ────┘
```

#### FAST Token 化

Physical Intelligence 提出的頻率空間動作序列壓縮方法。

**核心創新**：基於離散餘弦變換（DCT）將動作從時域轉換到頻域

**效果**：
- 訓練速度提升 5 倍
- 保持與 Diffusion VLA 相當的性能
- 更好的語言指令遵循能力

---

## 第三部分：代表性 VLA 模型

### 3.1 主流模型對比

| 模型 | 機構 | 發布時間 | 參數量 | 開源 | 核心特色 |
|------|------|----------|--------|------|----------|
| **π₀ / π₀.₅** | Physical Intelligence | 2024.10 / 2025.04 | ~3B | 部分 | Flow matching, 跨形態泛化 |
| **OpenVLA** | Stanford + UC Berkeley | 2024.06 | 7B | ✅ | 完全開源, LoRA 微調支援 |
| **GR00T N1** | NVIDIA | 2025.03 | 2.2B | ✅ | 人形機器人專用, 雙系統架構 |
| **Helix** | Figure AI | 2025.02 | - | ❌ | 首個控制人形全上半身 |
| **Gemini Robotics** | Google DeepMind | 2025 | - | ❌ | 基於 Gemini 2.0, 高度靈巧 |
| **SmolVLA** | Hugging Face | 2025.06 | 450M | ✅ | 輕量級, 社區驅動 |
| **Mantis** | SJTU 等 | 2025.11 | 5.8B | ✅ | DVF 架構, 96.7% LIBERO |

### 3.2 模型亮點解析

#### π₀ / π₀.₅ (Physical Intelligence)

- **架構**：PaliGemma VLM + Flow Matching Action Head
- **訓練數據**：8 種不同機器人形態的軌跡
- **突破**：首次展示端到端學習系統在全新家庭環境執行長程靈巧任務（如清潔廚房）

#### OpenVLA (Stanford)

- **完全開源**：模型權重、訓練代碼、微調筆記本全部公開
- **訓練規模**：970K 真實機器人演示（Open X-Embodiment）
- **實用特性**：
  - 支援 LoRA 微調（僅更新 1.4% 參數）
  - 4-bit 量化可在消費級 GPU 運行
  - OFT 配方實現 25-50x 推理加速

#### GR00T N1 (NVIDIA)

- **定位**：世界首個開放人形機器人基礎模型
- **雙系統設計**：
  - System 2: Eagle-2 VLM (1.34B 參數)
  - System 1: DiT-based flow-matching (63.9ms/chunk)
- **數據金字塔**：網路視頻 → 合成數據 → 真實機器人數據

---

## 第四部分：Mantis 模型深度解析

### 4.1 論文基本信息

| 項目 | 內容 |
|------|------|
| **標題** | Mantis: A Versatile Vision-Language-Action Model with Disentangled Visual Foresight |
| **作者** | Yi Yang, Xueqi Li, Yiyang Chen 等（上海交通大學、復旦大學、BOSCH） |
| **發布** | arXiv:2511.16175, 2025 年 11 月 20 日 |
| **代碼** | https://github.com/zhijie-group/Mantis |

### 4.2 解決的核心問題

現有 VLA 方法面臨的三大挑戰：

```
問題診斷：

┌─────────────────────────────────────────────────────────────┐
│  挑戰 1: 稀疏動作監督                                        │
│  ──────────────────                                         │
│  低維動作信號 ←──不匹配──► 高維視覺輸入的大型模型              │
│  → 模型表示容量未充分利用                                     │
├─────────────────────────────────────────────────────────────┤
│  挑戰 2: 視覺預見的兩難                                      │
│  ──────────────────                                         │
│  直接預測高維視覺 → 訓練成本高、收斂慢                         │
│  壓縮視覺狀態    → 信息瓶頸、細粒度運動丟失                    │
├─────────────────────────────────────────────────────────────┤
│  挑戰 3: 語言能力喪失                                        │
│  ──────────────────                                         │
│  機器人專屬訓練 → 覆蓋預訓練的視覺-文本對齊                    │
│  → 指令遵循能力下降、推理能力受損                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 DVF 架構創新

**解耦視覺預見（Disentangled Visual Foresight）**是 Mantis 的核心創新，通過將視覺預見預測從主幹網路解耦，同時保留語言理解能力。

#### 架構組件

```
Mantis 架構總覽：

                            ┌─────────────┐
                            │   DVF Head  │
                            │    (DiT)    │◄──── 預測未來幀 oₜ₊ₙ
                            └──────▲──────┘
                                   │
                            ┌──────┴──────┐
                            │  Connector  │
                            │ (12 層 Transformer)
                            └──────▲──────┘
                                   │
    ┌──────────────────────────────┼──────────────────────────────┐
    │                              │                              │
    │  Instruction ─┐   ┌──────────┴──────────┐   ┌─────────────┐ │
    │               ├──►│    VLM Backbone     │──►│ Action Head │ │
    │  Image oₜ ────┤   │   (Qwen2.5-VL)      │   │    (DiT)    │ │
    │               │   └─────────────────────┘   └──────┬──────┘ │
    │  [LAT] ───────┤         ▲                         │        │
    │  [GAP] ───────┤         │ Language                ▼        │
    │  [ACT] ───────┘         │ Supervision      aₜ:ₜ₊ₙ (動作)   │
    │                         │                                   │
    └─────────────────────────┼───────────────────────────────────┘
                              │
                        多模態數據集
```

#### 核心組件說明

| 組件 | 符號 | 功能 | 參數量 |
|------|------|------|--------|
| **VLM 主幹** | P | 處理視覺、語言、查詢的統一編碼 | 3.7B |
| **DVF Head** | D | 基於 Sana DiT 的未來幀生成 | 1.4B |
| **Action Head** | π | 基於 DiT 的動作去噪 | 0.3B |
| **Connector** | C | 12 層 Transformer，連接主幹與 DVF | - |
| **[LAT] 查詢** | - | 潛在動作查詢，捕捉幀間動態 | 9 個 |
| **[ACT] 查詢** | - | 動作查詢，提取動作信息 | 6 個 |
| **[GAP] 查詢** | - | 多間隔查詢，引導不同時間步預測 | 6×3 個 |

#### 關鍵設計要點

**1. 殘差連接的妙用**

將當前視覺狀態 oₜ 通過殘差連接提供給 DiT：

```python
# 概念性代碼
h_t = P(o_t, instruction, [LAT])  # 主幹編碼
o_t_plus_n = D(C(o_t, h_t))       # DVF 預測未來幀
                   ▲
                   └── 殘差連接：o_t 直接輸入
```

**效果**：使 [LAT] 查詢專注於捕捉幀間動態（即「潛在動作」），而非重建完整幀。

**2. 潛在動作的概念**

[LAT] 查詢學習到的是描繪視覺軌跡的**潛在動作**——顯式機器人運動的視覺表現。這為動作預測提供了有針對性的指導。

**3. 推理時的效率優化**

動作推理時可省略 DVF 頭部，因為視覺狀態預測對機器人執行並非必需：

```python
# 訓練時：完整流程
loss = α * L_DVF + L_action + β * L_lang

# 推理時：省略 DVF
actions = π(P(o_t, instruction, [LAT], [ACT]))  # 無需 DVF Head
```

### 4.4 漸進式訓練配方

Mantis 採用三階段訓練策略，避免多模態學習信號之間的競爭：

```
訓練階段可視化：

階段 1: 多間隔視覺訓練
════════════════════
數據: SSV2 (220K 人類操作視頻)
目標: 學習視覺動態 → 推斷潛在動作
凍結: 主幹 (保留語言表示)
解凍: DVF Head, [LAT], [GAP]
損失: L_DVF

        ┌─────────┐
        │ DVF Head │ ← 訓練
        └────▲────┘
             │
    ┌────────┴────────┐
    │    Backbone     │ ← 凍結
    └─────────────────┘


階段 2: 視覺-動作聯合訓練
════════════════════════
數據: DROID (76K 機器人演示)
目標: 學習動作預測
凍結: 主幹
解凍: Action Head, [ACT]
損失: α·L_DVF + L_action (α=0.1)

        ┌─────────┐   ┌─────────────┐
        │ DVF Head │   │ Action Head │ ← 訓練
        └────▲────┘   └──────▲──────┘
             │               │
    ┌────────┴───────────────┴────────┐
    │           Backbone              │ ← 凍結
    └─────────────────────────────────┘


階段 3: 語言監督混合訓練
════════════════════════
數據: 38 個多模態數據集 + DROID
目標: 保留語言理解和推理能力
解凍: 全部
損失: α·L_DVF + L_action + β·L_lang (β=0.005)

        ┌─────────┐   ┌─────────────┐
        │ DVF Head │   │ Action Head │ ← 訓練
        └────▲────┘   └──────▲──────┘
             │               │
    ┌────────┴───────────────┴────────┐
    │           Backbone              │ ← 訓練 (語言監督)
    └─────────────────────────────────┘
```

### 4.5 自適應時序集成（ATE）

**問題**：標準時序集成（Temporal Ensemble）雖能增強運動穩定性，但計算開銷高。

**解決方案**：根據任務需求動態調整集成強度。

#### ATE 工作原理

```
ATE 決策流程：

輸入圖像 (18×18 patches)
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌───────────┐
│ Target │  │  Dynamic  │
│ Patches│  │  Patches  │
└───┬───┘  └─────┬─────┘
    │            │
    └─────┬──────┘
          │
    ┌─────▼─────┐
    │  Overlap? │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │           │
   Yes          No
    │           │
    ▼           ▼
┌────────┐  ┌────────┐
│ Dense  │  │ Sparse │
│Ensemble│  │Ensemble│
└────────┘  └────────┘
```

**兩類 Patch**：

| 類型 | 定義 | 功能 |
|------|------|------|
| **Target Patches** | 與語言指令最相關的區域（Top τ_target%） | 標識指令相關物體 |
| **Dynamic Patches** | 視覺變化最顯著的區域（Top τ_dynamic%） | 捕捉機械臂/末端運動 |

**決策邏輯**：
- **有重疊** → 正在進行精細操作（如抓取）→ 啟用 Dense Ensemble
- **無重疊** → 空載移動 → 使用 Sparse Ensemble 提升效率

**效果**：推理次數減少 50%，性能保持相當。

### 4.6 實驗結果

#### LIBERO 基準測試

| 方法 | Spatial | Object | Goal | Long | Avg. |
|------|---------|--------|------|------|------|
| Diffusion Policy | 78.3 | 92.5 | 68.3 | 50.5 | 72.4 |
| OpenVLA | 84.7 | 88.4 | 79.2 | 53.7 | 76.5 |
| π₀ | 96.8 | 98.8 | 95.8 | 85.2 | 94.2 |
| CoT-VLA | 87.5 | 91.6 | 87.6 | 69.0 | 81.1 |
| UnifiedVLA | 95.4 | 98.8 | 93.6 | 94.0 | 95.5 |
| **Mantis (Ours)** | **98.8** | **99.2** | 94.4 | **94.2** | **96.7** |

#### 收斂速度對比

Mantis 相比傳統視覺預見方法（如 UnifiedVLA）收斂顯著更快：
- UnifiedVLA：前 10 個 epoch 成功率為 0
- Mantis：第 2 個 epoch 即達到 80%+ 成功率

#### 真實世界實驗

在 Agilex 平台上與 π₀.₅ 對比：

| 場景 | 指令類型 | Mantis | π₀.₅ |
|------|----------|--------|------|
| 場景 1 (世界知識) | ID | 8.25 | 7.75 |
|  | OOD | 8.25 | 3.5 |
| 場景 2 (算術邏輯) | ID | 9.25 | 8.25 |
|  | OOD | 7.75 | 2.5 |
| 場景 3 (意圖理解) | ID | 6.0 | 5.75 |
|  | OOD | 3.75 | 2.5 |

**關鍵發現**：
- Mantis 在 ID 和 OOD 指令上均優於 π₀.₅
- 語言監督對泛化至關重要（Mantis-LU 變體在 OOD 上表現顯著下降）

---

## 第五部分：工程師實戰指南

### 5.1 技術棧準備

#### 硬體需求

| 用途 | 最低配置 | 推薦配置 |
|------|----------|----------|
| **推理** | RTX 4090 (24GB) | A100 (40GB) |
| **微調 (LoRA)** | A100 (40GB) | 2× A100 (80GB) |
| **全量訓練** | 8× A100 (40GB) | 多節點 H100 集群 |

#### 軟體環境

```bash
# 基礎環境
conda create -n vla python=3.10
conda activate vla

# PyTorch with CUDA
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# 核心依賴
pip install transformers accelerate deepspeed
pip install flash-attn --no-build-isolation

# 機器人相關
pip install robomimic gymnasium
```

### 5.2 快速開始：OpenVLA 推理

OpenVLA 是最適合入門的開源 VLA 模型：

```python
from transformers import AutoModelForVision2Seq, AutoProcessor
from PIL import Image
import torch

# 載入模型（4-bit 量化版本可在消費級 GPU 運行）
model = AutoModelForVision2Seq.from_pretrained(
    "openvla/openvla-7b",
    torch_dtype=torch.bfloat16,
    load_in_4bit=True,  # 量化
    device_map="auto"
)
processor = AutoProcessor.from_pretrained("openvla/openvla-7b")

# 準備輸入
image = Image.open("robot_observation.png")
instruction = "Pick up the red cup and place it on the table"

# 處理輸入
inputs = processor(
    images=image,
    text=f"In: What action should the robot take to {instruction}?\nOut:",
    return_tensors="pt"
).to(model.device)

# 生成動作
with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=256)
    action_tokens = processor.decode(outputs[0], skip_special_tokens=True)

# 解析動作 token 為連續值
# action_tokens 格式: "0.123, -0.456, 0.789, ..."
```

### 5.3 LoRA 微調流程

針對特定任務微調 VLA 模型：

```python
from peft import LoraConfig, get_peft_model
from transformers import TrainingArguments, Trainer

# 配置 LoRA
lora_config = LoraConfig(
    r=32,                    # rank
    lora_alpha=32,
    target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

# 應用 LoRA
model = get_peft_model(model, lora_config)
print(f"可訓練參數: {model.print_trainable_parameters()}")
# 輸出: trainable params: 21M || all params: 7.5B || trainable%: 0.28%

# 訓練配置
training_args = TrainingArguments(
    output_dir="./openvla-finetuned",
    per_device_train_batch_size=2,
    gradient_accumulation_steps=8,
    learning_rate=2e-5,
    num_train_epochs=10,
    fp16=True,
    logging_steps=10,
    save_strategy="epoch",
)

# 開始訓練
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=your_robot_dataset,  # 需自行準備
)
trainer.train()
```

### 5.4 數據準備指南

#### RLDS 格式

VLA 模型通常使用 RLDS (Reinforcement Learning Datasets) 格式：

```python
import tensorflow_datasets as tfds

# 數據結構
episode = {
    'steps': [
        {
            'observation': {
                'image': np.array(...),        # (H, W, 3) RGB
                'wrist_image': np.array(...),  # 可選
                'state': np.array(...)         # 機器人狀態
            },
            'action': np.array(...),           # 動作向量
            'language_instruction': "...",     # 文字指令
            'is_terminal': False,
            'is_first': False,
        },
        # ... 更多步驟
    ]
}
```

#### 數據收集最佳實踐

1. **多樣性優先**：
   - 不同物體、位置、光照條件
   - 多種語言指令表述
   
2. **質量把控**：
   - 剔除失敗/不完整的演示
   - 確保動作標註準確

3. **數據增強**：
   - 圖像增強（顏色抖動、裁剪）
   - 指令同義改寫

### 5.5 Mantis 復現指南

基於論文和開源代碼的復現路徑：

```bash
# 克隆代碼庫
git clone https://github.com/zhijie-group/Mantis.git
cd Mantis

# 安裝依賴
pip install -r requirements.txt

# 下載預訓練權重
# (具體路徑參考 GitHub README)

# 在 LIBERO 上評估
python eval_libero.py \
    --checkpoint_path /path/to/mantis_checkpoint \
    --task_suite spatial \
    --num_episodes 50
```

**關鍵配置參數**：

| 參數 | 值 | 說明 |
|------|-----|------|
| `num_lat_queries` | 9 | 潛在動作查詢數量 |
| `num_act_queries` | 6 | 動作查詢數量 |
| `dvf_diffusion_steps` | 30 | DVF 擴散步數 |
| `action_diffusion_steps` | 10 | 動作頭擴散步數 |
| `vision_loss_weight` (α) | 0.1 | 視覺損失權重 |
| `lang_loss_weight` (β) | 0.005 | 語言損失權重 |

### 5.6 常見問題與解決方案

#### Q1: 模型推理速度慢

**解決方案**：
- 使用 4-bit/8-bit 量化
- 啟用 Flash Attention 2
- 對於 Mantis，推理時省略 DVF Head
- 考慮使用 ATE 減少推理次數

#### Q2: 微調後泛化能力下降

**解決方案**：
- 採用 LoRA 而非全量微調
- 加入語言監督（如 Mantis 第三階段）
- 混合訓練數據（特定任務 + 通用 VQA）

#### Q3: 動作抖動/不穩定

**解決方案**：
- 啟用 Temporal Ensemble
- 增加動作塊大小 (action chunk size)
- 檢查訓練數據中的動作平滑度

#### Q4: GPU 記憶體不足

**解決方案**：
```python
# 梯度檢查點
model.gradient_checkpointing_enable()

# DeepSpeed ZeRO
deepspeed_config = {
    "zero_optimization": {
        "stage": 2,
        "offload_optimizer": {"device": "cpu"}
    }
}
```

---

## 第六部分：工業應用展望

### 6.1 適用場景分析

| 應用領域 | VLA 優勢 | 挑戰 | 推薦模型 |
|----------|----------|------|----------|
| **物流分揀** | 自然語言指令、多品類泛化 | 速度要求高 | π₀-FAST |
| **裝配作業** | 長程序列任務理解 | 精度要求嚴格 | Mantis |
| **服務機器人** | 語言交互、意圖理解 | 安全性考量 | OpenVLA + 安全層 |
| **質量檢測** | 視覺推理能力 | 實時性 | SmolVLA |
| **PCB 加工** | 視覺定位精度 | 微米級精度 | 定制 DVF 架構 |

### 6.2 與現有系統整合

```
VLA 與傳統控制系統整合架構：

┌─────────────────────────────────────────────────────────────┐
│                     高層決策層 (VLA)                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  自然語言指令 ──► VLA 模型 ──► 任務級動作序列          │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ 動作指令
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     中層規劃層                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  軌跡規劃 + 碰撞檢測 + 運動學約束                       │   │
│  └─────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ 軌跡點
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     底層控制層                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PID/MPC 控制器 ──► 電機驅動 ──► 機器人本體           │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 對 PCB 分板機視覺定位的啟發

對於 AUO 4000A 智能 PCB 分板機的 AI 視覺整合，Mantis 的 DVF 架構提供了以下啟發：

1. **視覺預見用於軌跡預測**
   - 利用 DVF 預測切割路徑的視覺軌跡
   - 潛在動作查詢捕捉刀具-PCB 相對運動

2. **解耦設計保持精度**
   - 將視覺預測與動作生成解耦
   - 避免視覺冗餘影響定位精度

3. **漸進式訓練策略**
   - 階段 1: 在 PCB 圖像上訓練視覺理解
   - 階段 2: 引入切割軌跡數據
   - 階段 3: 加入異常檢測任務

4. **ATE 優化推理效率**
   - 直線切割段：稀疏推理
   - 轉角/複雜區域：密集推理

---

## 結語與資源彙整

### 關鍵要點總結

1. **VLA 代表機器人學習的範式轉變**：從分離的感知-規劃-執行到端到端多模態學習

2. **Mantis 的 DVF 架構解決了視覺預見的兩難問題**：
   - 解耦設計減輕主幹負擔
   - 殘差連接使查詢專注於潛在動作
   - 語言監督保留推理能力

3. **工程實踐路徑**：
   - 入門：OpenVLA 推理 → LoRA 微調
   - 進階：復現 Mantis → 定制 DVF 架構
   - 應用：特定任務數據收集 → 端到端訓練

### 開源資源彙整

| 資源 | 連結 | 用途 |
|------|------|------|
| **OpenVLA** | [GitHub](https://github.com/openvla/openvla) | 入門首選，完整工具鏈 |
| **Mantis** | [GitHub](https://github.com/zhijie-group/Mantis) | DVF 架構實現 |
| **GR00T N1** | [GitHub](https://github.com/NVIDIA/Isaac-GR00T) | 人形機器人專用 |
| **LeRobot** | [HuggingFace](https://huggingface.co/lerobot) | 數據收集與訓練框架 |
| **LIBERO** | [GitHub](https://github.com/Lifelong-Robot-Learning/LIBERO) | 基準測試環境 |
| **Open X-Embodiment** | [Website](https://robotics-transformer-x.github.io/) | 大規模數據集 |

### 延伸閱讀

- [VLA Survey (IEEE Access 2025)](https://vla-survey.github.io/) - 最全面的 VLA 綜述
- [Awesome VLA Papers](https://github.com/Psi-Robot/Awesome-VLA-Papers) - 論文列表
- [π₀ Technical Report](https://www.physicalintelligence.company/download/pi0.pdf) - Flow Matching VLA 詳解

---

*本文基於 arXiv:2511.16175 論文及 2025 年 VLA 領域最新進展整理。如有問題或建議，歡迎討論交流。*

**作者**：AI 技術研究筆記  
**更新日期**：2025 年 11 月

# 從零開始挑戰 Stanford CS336：我的 LLM 自學先修攻略

> 如果你想真正理解 LLM 的每一層細節，而不只是當個 API caller，這門課就是為你設計的。

**作者**：Ray
**日期**：2025 年 12 月 9 日 

---

## 為什麼我想學這門課？

最近在研究 AI 應用開發時，我發現一個尷尬的事實：雖然每天都在用 LLM，但對於模型內部到底怎麼運作的，其實一知半解。Tokenizer 怎麼切的？Attention 為什麼要除以 √d？FlashAttention 為什麼能省記憶體？這些問題我都答不太上來。

然後我發現了 Stanford CS336：**Language Modeling from Scratch**。

這門課的設計理念很瘋狂——就像作業系統課會讓你從零寫一個 OS 一樣，CS336 要你從零寫一個語言模型。不是調 API，不是 fine-tune 現成模型，而是**真的從 tokenizer 寫到 distributed training**。

看完課程大綱，我決定挑戰它。但首先，我需要補齊先修知識。

---

## 這門課有多硬核？

先來看看課程的五個 Assignment：

| Assignment | 你要做什麼 | 讓人頭痛的點 |
|------------|-----------|-------------|
| **A1 Basics** | 實作 BPE tokenizer、Transformer、Adam | 只能用 PyTorch 原始操作，連 `nn.Linear` 都不能用 |
| **A2 Systems** | 用 Triton 寫 FlashAttention2、做分散式訓練 | 要寫 GPU kernel |
| **A3 Scaling** | 擬合 scaling law | 需要扎實的理論理解 |
| **A4 Data** | 處理 Common Crawl、做過濾與去重 | 大規模資料工程 |
| **A5 Alignment** | 實作 SFT、GRPO、RL 微調 | 強化學習概念 |

課程明確說了：**代碼量至少比其他 AI 課程多一個數量級**。

每週預計投入 20-25 小時，持續 10 週。這不是開玩笑的。

---

## 我需要補什麼？

根據官方先修要求，我盤點了自己的知識缺口：

### ✅ 還行的部分
- Python 基礎
- 基本 ML 概念
- 用過 PyTorch（但沒深入）

### ❌ 需要補強的部分
- PyTorch 底層操作（手寫 layer）
- Transformer 架構細節
- GPU / CUDA 基礎
- 分散式訓練概念

於是我規劃了一個 **7 週的先修補強計畫**。

---

## 階段一：打好基礎（Week 1-2）

### PyTorch 不只是 `import torch`

第一個震撼教育：課程要求你**不能用 `torch.nn.Linear`**。

這意味著你要能手寫這樣的東西：

```python
class MyLinear:
    def __init__(self, in_features, out_features):
        self.weight = torch.randn(out_features, in_features) * 0.01
        self.bias = torch.zeros(out_features)
    
    def forward(self, x):
        return x @ self.weight.T + self.bias
```

而且要理解為什麼 `view()` 和 `reshape()` 不一樣，什麼時候 tensor 會不是 contiguous，以及如何用 `einsum` 優雅地做 batch matrix multiply。

**我的學習資源**：
- [PyTorch 官方教程 - Learning PyTorch with Examples](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)
- 從 numpy 手寫到 autograd 的完整過程

### 線性代數：被遺忘的基礎

說實話，大學學的線性代數早就還給老師了。但 Transformer 裡面全是矩陣操作，不得不撿回來。

推薦 **3Blue1Brown 的 Essence of Linear Algebra** 系列，用視覺化的方式重新理解矩陣的幾何意義。看完之後，終於懂了為什麼矩陣乘法是那樣定義的。

---

## 階段二：深度學習核心（Week 3-5）

### Karpathy 的 Zero to Hero 系列

這是我找到最好的熱身材料。Andrej Karpathy（前 Tesla AI 總監）做了一系列從零開始的教學：

1. **micrograd** — 用 100 行 Python 寫一個自動微分引擎
2. **makemore** — 從 bigram 到 MLP 到 RNN 的語言模型
3. **nanoGPT** — 完整的 GPT 實作

這個系列的精神跟 CS336 完全一致：**不用現成的，自己寫**。

花兩週把這三個專案跑完，對神經網路的理解會完全不一樣。

### Transformer：真的讀懂那篇論文

"Attention is All You Need" 大概是被引用最多、但真正讀完的人最少的論文之一。

這次我逼自己把每個公式都搞懂：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

**幾個之前一直搞不清楚的點**：

1. **為什麼要除以 √d_k？** — 防止 dot product 在高維度時數值太大，導致 softmax 梯度消失

2. **Multi-head 到底在幹嘛？** — 讓模型能同時關注不同位置的不同表示子空間

3. **Causal masking 怎麼實作？** — 用一個上三角矩陣把未來的 token 遮掉

推薦 **Jay Alammar 的 The Illustrated Transformer**，用圖解的方式把整個架構講得很清楚。

### Adam 優化器：不只是 `torch.optim.Adam`

Assignment 1 要你手寫 Adam。這逼我真的去理解那個公式：

```
m = β₁ * m + (1 - β₁) * gradient        # 一階動量
v = β₂ * v + (1 - β₂) * gradient²       # 二階動量
m_hat = m / (1 - β₁^t)                   # Bias correction
v_hat = v / (1 - β₂^t)                   # Bias correction
param = param - lr * m_hat / (√v_hat + ε)
```

Bias correction 那兩行是關鍵——因為 m 和 v 初始化為 0，前幾步會嚴重偏向 0，需要修正。

---

## 階段三：系統與 GPU（Week 6-7）

### GPU 不只是「比較快的 CPU」

這部分是我最弱的。之前的認知就是「丟到 GPU 上會比較快」，但不知道為什麼。

幾個關鍵概念：

**Memory Hierarchy**
```
Registers（最快）→ Shared Memory → Global Memory → Host Memory（最慢）
```

Shared memory 比 global memory 快大約 **20 倍**。這就是為什麼 FlashAttention 能省那麼多時間——它把計算切成小塊，盡量在 shared memory 裡完成。

**Memory-bound vs Compute-bound**
- Memory-bound：瓶頸在資料搬運
- Compute-bound：瓶頸在計算能力

很多深度學習操作其實是 memory-bound，包括 attention。這就是為什麼優化記憶體存取比優化計算更重要。

### Triton：比 CUDA 更友善的 GPU 程式語言

Assignment 2 要用 Triton 寫 FlashAttention2。Triton 是 OpenAI 開發的，語法比 CUDA 友善很多：

```python
@triton.jit
def add_kernel(x_ptr, y_ptr, output_ptr, n_elements, BLOCK_SIZE: tl.constexpr):
    pid = tl.program_id(0)
    offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)
    mask = offsets < n_elements
    x = tl.load(x_ptr + offsets, mask=mask)
    y = tl.load(y_ptr + offsets, mask=mask)
    tl.store(output_ptr + offsets, x + y, mask=mask)
```

建議先從 [Triton 官方教程](https://triton-lang.org/) 的 vector add 和 matrix multiply 開始。

---

## 時間與金錢成本

### 時間
- 先修補強：**~100 小時**（7 週）
- 正式課程：**~200-250 小時**（10 週）
- 總計：**300-350 小時**

### 金錢

好消息是課程完全免費公開——所有影片在 YouTube，所有作業在 GitHub。

壞消息是你需要 GPU。幾個雲端選項：

| 平台 | H100 價格 |
|------|-----------|
| RunPod | $1.99-$2.99/hr |
| Lambda Labs | $2.49-$3.29/hr |
| Paperspace | $2.24/hr |

**省錢技巧**：在 CPU 上先 debug 正確性，只在需要訓練或 benchmark 時才開 GPU。

整門課下來，我預估 GPU 費用約 **$60-150 美金**（NT$2,000-5,000）。

如果你想要 Stanford 學分，官方 Stanford Online 的學費是 $7,570 美金。但純自學的話，不需要這筆錢。

---

## 我的學習時間表

| 週數 | 主題 | 產出 |
|------|------|------|
| Week 1 | PyTorch 進階 + 線性代數 | 手寫 Linear、ReLU、Softmax |
| Week 2 | 機率統計 + 神經網路基礎 | 理解 backpropagation |
| Week 3 | Karpathy micrograd + makemore | 完成 micrograd |
| Week 4 | Transformer 論文 + 實作 | 手寫 self-attention |
| Week 5 | 優化器 + nanoGPT | 手寫 Adam |
| Week 6 | GPU 概念 + Triton 入門 | 完成 vector add kernel |
| Week 7 | 分散式訓練 + 總複習 | 理解 DDP |

---

## 開始前的 Checklist

在正式開始 CS336 之前，確認你能回答這些問題：

### PyTorch
- [ ] `view()` 和 `reshape()` 差在哪？
- [ ] 什麼時候 tensor 不是 contiguous？
- [ ] 怎麼用 einsum 寫 batch matrix multiply？

### Transformer  
- [ ] Attention score 為什麼要除以 √d_k？
- [ ] Multi-head 的 head 數量如何影響計算量？
- [ ] Causal masking 怎麼實現？

### 優化器
- [ ] Adam 的 β₁ 和 β₂ 分別做什麼？
- [ ] 為什麼需要 bias correction？

### 系統
- [ ] Shared memory 比 global memory 快多少？
- [ ] FlashAttention 省記憶體的原理是什麼？

如果這些問題你都能答上來，恭喜，你準備好了。

---

## 資源懶人包

### 課程資源
- 📚 [課程首頁](https://stanford-cs336.github.io/spring2025/)
- 💻 [GitHub](https://github.com/stanford-cs336)
- 🎬 [YouTube Playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPyR-z_lhHaRl2sSxVCfF0N)
- 📁 [2024 版本存檔](https://stanford-cs336.github.io/spring2024/)

### 先修學習
- 🎥 [Karpathy - Neural Networks: Zero to Hero](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ)
- 🎥 [3Blue1Brown - Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
- 📖 [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- 📖 [Triton 教程](https://triton-lang.org/main/getting-started/tutorials/)

### 關鍵論文
- [Attention is All You Need](https://arxiv.org/abs/1706.03762)
- [FlashAttention](https://arxiv.org/abs/2205.14135)
- [FlashAttention-2](https://arxiv.org/abs/2307.08691)

---

## 寫在最後

這門課不輕鬆，但我相信值得。

在這個人人都能調 API 的時代，真正理解底層原理的人會越來越有價值。不是因為你一定會自己 pretrain 一個 LLM，而是因為這種深度理解會讓你在 debug、優化、甚至設計新系統時，做出更好的判斷。

如果你也想挑戰這門課，歡迎一起交流。

---

*最後更新：2025 年 12 月*

*如果這篇文章對你有幫助，歡迎分享給同樣在學習 LLM 的朋友。*

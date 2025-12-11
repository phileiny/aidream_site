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

## 階段一：自動微分的魔法（Week 1-2）

### 從 micrograd 開始

Karpathy 的 [micrograd 影片](https://www.youtube.com/watch?v=VMj-3S1tku0) 是整個旅程的起點。用不到 100 行 Python，你會親手打造一個自動微分引擎。

這兩週你會學到：

- **什麼是計算圖**：每個運算都是節點，backward 就是沿著圖反向傳播
- **Chain rule 的實際應用**：不再是課本上的公式，而是真的寫出來
- **為什麼深度學習框架都長這樣**：PyTorch、TensorFlow 底層都是這套邏輯

```python
# micrograd 的核心概念
class Value:
    def __init__(self, data):
        self.data = data
        self.grad = 0
        self._backward = lambda: None
    
    def __mul__(self, other):
        out = Value(self.data * other.data)
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        return out
```

這段程式碼看起來簡單，但理解它之後，你會對神經網路的訓練過程有完全不同的認識。

### 數學卡關怎麼辦？

如果你對微分的 chain rule 生疏了，不用慌。先看 [3Blue1Brown 的微積分系列](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr) 的第 1-4 集，大概 1 小時就能撿回來。

**重點**：不需要先把數學全補完再開始。跟著影片做，遇到卡的地方再回去補，效率更高。

---

## 階段二：語言模型實戰（Week 3-5）

### makemore：從字元到神經網路（Week 3-4）

[makemore 系列](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) 有 5 支影片，帶你從最簡單的 bigram 一路做到 WaveNet 風格的模型。

這兩週你會經歷：

1. **Bigram** — 最簡單的統計語言模型
2. **MLP** — 加入 embedding 和隱藏層
3. **BatchNorm** — 理解為什麼訓練會不穩定，以及怎麼解決
4. **Backprop 手推** — 不靠 autograd，自己算梯度
5. **WaveNet** — 更深的架構

這裡會大量用到 PyTorch 的 tensor 操作。如果 `view()`、`reshape()`、broadcasting 讓你頭痛，先去看 [PyTorch 官方教程](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)。

### GPT：Transformer 的完整實作（Week 5）

到了 [GPT 影片](https://www.youtube.com/watch?v=kCc8FmEb1nY)，你會親手寫出一個能生成文字的 Transformer。

這週的重點：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

**幾個關鍵概念**：

- **為什麼要除以 √d_k？** — 防止 dot product 在高維度時數值太大，導致 softmax 梯度消失
- **Multi-head 到底在幹嘛？** — 讓模型能同時關注不同位置的不同表示子空間
- **Causal masking 怎麼實作？** — 用一個上三角矩陣把未來的 token 遮掉

如果 attention 機制讓你困惑，推薦 **Jay Alammar 的 [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)**，用圖解的方式把整個架構講得很清楚。

---

## 階段三：系統與 GPU（Week 6-7）

### Week 6：數學補強

到這裡，你已經完成了 Karpathy 的核心系列。這週是回顧和補強的時間：

- 把之前跳過的數學細節補回來
- 複習線性代數（推薦 [3Blue1Brown 的系列](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)）
- 理解 Adam 優化器的公式：

```
m = β₁ * m + (1 - β₁) * gradient        # 一階動量
v = β₂ * v + (1 - β₂) * gradient²       # 二階動量
m_hat = m / (1 - β₁^t)                   # Bias correction
v_hat = v / (1 - β₂^t)                   # Bias correction
param = param - lr * m_hat / (√v_hat + ε)
```

Bias correction 那兩行是關鍵——因為 m 和 v 初始化為 0，前幾步會嚴重偏向 0，需要修正。

### Week 7：GPU 概念與 CS336 準備

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

跟著 [Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy) 的影片系列學習：

| 週數 | 主題 | 影片資源 | 產出 |
|------|------|----------|------|
| Week 1-2 | micrograd | [影片](https://www.youtube.com/watch?v=VMj-3S1tku0) | 自動微分引擎 |
| Week 3-4 | makemore | [播放清單](https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) | 語言模型 |
| Week 5 | GPT | [影片](https://www.youtube.com/watch?v=kCc8FmEb1nY) | Transformer 實作 |
| Week 6 | 數學補強 | 按需學習 | 線代、機率複習 |
| Week 7 | GPU + CS336 準備 | 課程資料 | Triton 入門、理解 DDP |

### 卡關時去哪補？

學習過程中遇到數學或概念卡關是正常的，以下是各階段常見的卡點和對應資源：

**Week 1-2 micrograd 階段**
- 卡在 chain rule / backprop → [3Blue1Brown 微積分系列](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr)
- 不懂為什麼要算 gradient → [3Blue1Brown 神經網路系列](https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

**Week 3-4 makemore 階段**
- 矩陣運算看不懂 → [3Blue1Brown 線性代數](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
- PyTorch tensor 操作不熟 → [PyTorch 官方教程](https://pytorch.org/tutorials/beginner/pytorch_with_examples.html)

**Week 5 GPT 階段**
- Attention 公式推導 → [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- 不懂 softmax / cross-entropy → 回去看 makemore Part 1 的解說

**原則**：先試著跟完影片，真的卡住再去補。不要預先焦慮，很多東西在動手做的過程中會自然理解。

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

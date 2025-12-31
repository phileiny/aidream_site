# 從零理解神經網路（六）：實戰——訓練你的第一個神經網路

> 本文是「從零理解神經網路」系列的最後一篇。前五篇我們學了所有核心概念，這篇要把它們組合起來，親眼看看神經網路是如何「學會」分類的。

## 回顧：我們學了什麼？

讓我們快速回顧這個系列的核心概念：

| 篇章 | 核心概念 | 一句話總結 |
|:---:|---------|----------|
| 1 | 神經元 | 加權投票 + 激活函數 |
| 2 | 激活函數 | 沒有非線性，100 層等於 1 層 |
| 3 | 梯度下降 | 順著斜坡往下走，找到谷底 |
| 4 | 反向傳播 | 從錯誤往回追，分配責任 |
| 5 | 計算圖 | 記錄運算，自動算梯度 |

現在，讓我們把這些概念組合成一個完整的神經網路！

## 多層感知器（MLP）

**多層感知器（Multi-Layer Perceptron, MLP）** 是最基本的深度神經網路：

```
輸入層 ──→ 隱藏層1 ──→ 隱藏層2 ──→ 輸出層
(特徵)     (抽象特徵)   (更抽象)    (預測)
```

每一層由多個神經元組成，每個神經元：
1. 接收上一層所有神經元的輸出
2. 計算加權和 + 偏置
3. 通過激活函數
4. 輸出給下一層

### MLP 的程式碼結構

```python
class Neuron:
    """單個神經元"""
    def __init__(self, nin):  # nin = 輸入數量
        self.w = [Value(random()) for _ in range(nin)]
        self.b = Value(random())
    
    def __call__(self, x):
        # 加權和 + 偏置 + 激活
        act = sum(wi*xi for wi, xi in zip(self.w, x)) + self.b
        return act.tanh()

class Layer:
    """一層神經元"""
    def __init__(self, nin, nout):  # nout = 輸出數量
        self.neurons = [Neuron(nin) for _ in range(nout)]
    
    def __call__(self, x):
        return [n(x) for n in self.neurons]

class MLP:
    """多層感知器"""
    def __init__(self, nin, nouts):  # nouts = 每層的神經元數量
        sz = [nin] + nouts
        self.layers = [Layer(sz[i], sz[i+1]) for i in range(len(nouts))]
    
    def __call__(self, x):
        for layer in self.layers:
            x = layer(x)
        return x[0]  # 假設最後只有一個輸出
```

一個 `MLP(2, [8, 8, 1])` 表示：
- 2 個輸入
- 第一隱藏層 8 個神經元
- 第二隱藏層 8 個神經元
- 1 個輸出

## 訓練任務：二分類

我們的任務是訓練神經網路來分類二維平面上的點：

- **輸入**：點的座標 (x₁, x₂)
- **輸出**：類別（+1 或 -1）
- **目標**：學習一個決策邊界，把兩類點分開

### 為什麼這很有趣？

不同形狀的資料需要不同複雜度的邊界：

**線性可分**（簡單）：一條直線就能分開
```
  ●●●|○○○
  ●●●|○○○
```

**XOR 問題**（中等）：需要曲線
```
  ○○|●●
  ──┼──
  ●●|○○
```

**螺旋形**（困難）：需要複雜的曲線
```
  ●     ○
    ●  ○
      ●○
     ○●
    ○  ●
  ○     ●
```

## 訓練流程

完整的訓練流程：

```python
# 1. 建立模型
model = MLP(2, [8, 8, 1])  # 2輸入 → 8 → 8 → 1輸出

# 2. 訓練迴圈
for epoch in range(100):
    
    # 2.1 前向傳播：計算預測和損失
    total_loss = 0
    for x, y in data:
        pred = model(x)
        loss = (pred - y) ** 2  # MSE 損失
        total_loss += loss
    
    # 2.2 清除舊梯度
    for p in model.parameters():
        p.grad = 0
    
    # 2.3 反向傳播：計算梯度
    total_loss.backward()
    
    # 2.4 梯度下降：更新權重
    for p in model.parameters():
        p.data -= learning_rate * p.grad
    
    print(f"Epoch {epoch}, Loss: {total_loss.data}")
```

讓我們拆解每個步驟：

### Step 1：前向傳播

資料從輸入流向輸出：

```
x = [x₁, x₂]
     ↓
第1層：8個神經元同時計算
     ↓
第2層：8個神經元同時計算
     ↓
輸出層：1個神經元
     ↓
pred（預測值，-1 到 1 之間）
```

### Step 2：計算損失

我們用 **Hinge Loss** 或 **MSE** 來衡量預測有多糟：

```python
# Hinge Loss（SVM 風格）
loss = max(0, 1 - y * pred)

# MSE（均方誤差）
loss = (y - pred) ** 2
```

### Step 3：反向傳播

這一步是魔法發生的地方！

```
loss.backward()
```

這一行程式碼會：
1. 從 loss 開始，沿著計算圖反向走
2. 計算 loss 對每個權重的偏導數
3. 把結果存在每個權重的 `.grad` 屬性

### Step 4：梯度下降

用梯度更新權重：

```python
for p in model.parameters():
    p.data -= learning_rate * p.grad
```

- `learning_rate` 控制步伐大小（通常 0.01 ~ 0.1）
- `p.grad` 告訴我們調整的方向和幅度

## 訓練過程視覺化

讓我們看看訓練過程中發生了什麼：

### Epoch 0（初始狀態）

```
決策邊界：幾乎是隨機的
準確率：~50%（跟亂猜一樣）

    ○ ● ○ ● ○
    ● ○ ● ○ ●
    ──────────  ← 隨機的邊界
    ○ ● ○ ● ○
    ● ○ ● ○ ●
```

### Epoch 20

```
決策邊界：開始有點形狀
準確率：~70%

    ○ ○ ○ ● ●
    ○ ○ ● ● ●
    ────╲─────  ← 邊界開始傾斜
    ○ ○ ○ ● ●
    ○ ○ ● ● ●
```

### Epoch 100

```
決策邊界：很好地分開了兩類
準確率：~95%

    ○ ○ ○|● ●
    ○ ○ ○|● ●
         |     ← 清晰的邊界
    ○ ○ ○|● ●
    ○ ○ ○|● ●
```

### 對於複雜資料（如螺旋）

```
Epoch 0:    Epoch 50:   Epoch 200:
   ?           ~~~        ~~~
  ? ?         ~ ~ ~      ~   ~
 ? ? ?       ~  ~  ~    ~  ●  ~
  ? ?         ~ ~ ~      ~   ~
   ?           ~~~        ~~~
              
（隨機）    （開始彎曲）  （完美螺旋邊界）
```

## 超參數的影響

### 學習率（Learning Rate）

```
太大（0.5）：     太小（0.001）：   剛好（0.05）：
  ↗↙↗↙            ↘                 ↘
 ↗    ↙           ↘                  ↘
↗      ↙          ↘                   ↘
發散震盪           太慢               穩定收斂
```

### 網路深度

```
太淺 [4]：         適中 [8,8]：      太深 [8,8,8,8,8]：
只能線性邊界       可以學曲線         可能過擬合
  ──────          ～～～～           ～∿∿∿～
```

### 神經元數量

```
太少 [2,2]：      適中 [8,8]：      太多 [64,64]：
表達能力不足       剛剛好            過擬合風險
```

## 常見問題與解決

### 1. 損失不下降

**可能原因**：
- 學習率太大或太小
- 網路太淺，無法擬合資料
- Bug（忘記清除梯度）

**解決方案**：
- 嘗試不同學習率（0.001, 0.01, 0.1）
- 增加網路深度或寬度
- 確認 `p.grad = 0` 在每個 epoch 都有執行

### 2. 訓練損失低，但泛化差（過擬合）

**可能原因**：
- 網路太大
- 訓練太久
- 資料太少

**解決方案**：
- 減少神經元數量
- 早停（Early Stopping）
- 使用正則化（Dropout, Weight Decay）

### 3. 收斂太慢

**可能原因**：
- 學習率太小
- 初始化不好
- 激活函數選擇問題

**解決方案**：
- 增加學習率
- 使用更好的優化器（Adam）
- 換成 ReLU 激活函數

## 互動視覺化

我製作了一個完整的 MLP 訓練器，讓你可以：
- 選擇不同的資料集（圓形、XOR、螺旋、月亮）
- 自訂網路結構（隱藏層數量和大小）
- 調整學習率和激活函數
- 即時觀察決策邊界的變化
- 看損失曲線和準確率

👉 <a href="/htmls/mlp-trainer.html" target="_blank">MLP 訓練視覺化</a>

**建議實驗**：

1. **XOR 資料集**：
   - 先用 `[4]`（單隱藏層 4 神經元），觀察無法學會
   - 改成 `[8, 8]`，觀察成功學會

2. **螺旋資料集**：
   - 這是最難的，需要較深的網路
   - 試試 `[16, 16]` 或 `[8, 8, 8]`

3. **學習率實驗**：
   - 固定網路結構，嘗試 0.01, 0.1, 0.5
   - 觀察收斂速度和穩定性

## 完整程式碼

這是一個可以直接運行的完整版本（使用 micrograd）：

```python
import random
from micrograd.engine import Value
from micrograd.nn import MLP

# 生成 XOR 資料
data = []
for _ in range(100):
    x = [random.uniform(-1, 1), random.uniform(-1, 1)]
    y = 1 if (x[0] > 0) != (x[1] > 0) else -1  # XOR
    data.append((x, y))

# 建立模型
model = MLP(2, [8, 8, 1])
learning_rate = 0.1

# 訓練
for epoch in range(100):
    # 前向傳播
    total_loss = Value(0)
    correct = 0
    for x, y in data:
        pred = model([Value(x[0]), Value(x[1])])
        loss = (1 - pred * y).relu()  # Hinge loss
        total_loss = total_loss + loss
        if (pred.data > 0) == (y > 0):
            correct += 1
    
    # 反向傳播
    model.zero_grad()
    total_loss.backward()
    
    # 梯度下降
    for p in model.parameters():
        p.data -= learning_rate * p.grad
    
    if epoch % 10 == 0:
        print(f"Epoch {epoch}: Loss={total_loss.data:.4f}, Acc={correct/len(data)*100:.1f}%")
```

## 小結

這個系列我們從最基本的神經元開始，一步步建立起對神經網路的完整理解：

1. **神經元**：加權投票 + 激活
2. **激活函數**：引入非線性，讓網路能學複雜函數
3. **梯度下降**：沿著損失地形的斜坡往下走
4. **反向傳播**：高效計算所有權重的梯度
5. **計算圖**：自動追蹤運算，自動計算梯度
6. **MLP 訓練**：把所有概念組合起來

這些概念是**所有深度學習的基礎**——不管是 CNN、RNN、Transformer，還是最新的大語言模型，底層都是這些原理。

## 接下來學什麼？

掌握了這些基礎後，你可以繼續探索：

- **卷積神經網路（CNN）**：圖像識別
- **循環神經網路（RNN/LSTM）**：序列資料
- **Transformer**：注意力機制，現代 NLP 的基礎
- **優化技巧**：BatchNorm, Dropout, 學習率調度
- **框架實戰**：PyTorch, TensorFlow

但無論學什麼，今天學的這些基礎都會一直適用。

## 感謝

這個系列的靈感來自：
- Andrej Karpathy 的 [micrograd](https://github.com/karpathy/micrograd) 和 [CS231n](http://cs231n.stanford.edu/)
- 3Blue1Brown 的[神經網路視覺化](https://www.3blue1brown.com/topics/neural-networks)
- Stanford CS336

希望這個系列對你有幫助！如果有問題或建議，歡迎留言討論。

---

*本文是「從零理解神經網路」系列的最後一篇。感謝你的閱讀！*

---

## 系列文章索引

1. [一個神經元是如何思考的？](./01-multi-input-neuron)
2. [為什麼激活函數如此重要？](./02-activation-functions)
3. [梯度下降——順著山坡找谷底](./03-gradient-descent)
4. [反向傳播——誰該為錯誤負責？](./04-backpropagation)
5. [計算圖——為什麼叫「自動」微分？](./05-computation-graph)
6. [實戰——訓練你的第一個神經網路](./06-mlp-training)（本文）

## 互動視覺化工具

- <a href="/htmls/multi-input-neuron.html" target="_blank">多輸入神經元</a>
- <a href="/htmls/activation-functions.html" target="_blank">激活函數</a>
- <a href="/htmls/gradient-descent-3d.html" target="_blank">梯度下降 3D</a>
- <a href="/htmls/backprop-complete.html" target="_blank">反向傳播</a>
- <a href="/htmls/computation-graph.html" target="_blank">計算圖</a>
- <a href="/htmls/mlp-trainer.html" target="_blank">MLP 訓練器</a>

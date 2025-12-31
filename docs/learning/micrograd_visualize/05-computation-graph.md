# 從零理解神經網路（五）：計算圖——為什麼叫「自動」微分？

> 本文是「從零理解神經網路」系列的第五篇。上一篇我們理解了反向傳播的原理，這篇要揭秘深度學習框架（PyTorch、TensorFlow）最核心的魔法——自動微分是如何實現的。

## 從手動到自動

在傳統程式設計中，如果你想計算導數，你需要：

1. 手動推導出導數公式
2. 把公式寫成程式碼
3. 每次改模型，就要重新推導

這在神經網路中是不可行的——模型結構經常改變，參數數量龐大。

**自動微分（Automatic Differentiation）** 解決了這個問題：

> 你只需要寫前向計算的程式碼，框架會**自動**幫你算出所有梯度。

聽起來像魔法，但其實背後的原理很簡單——**計算圖（Computational Graph）**。

## 什麼是計算圖？

計算圖是一種**有向無環圖（DAG）**，用來表示數學運算：

- **節點**：代表數值或運算
- **邊**：代表資料流向

舉個例子，假設我們要計算：

```
y = (a + b) × c
```

對應的計算圖：

```
    a ──┐
        ├──→ [+] ──→ d ──┐
    b ──┘                 ├──→ [×] ──→ y
                     c ──┘
```

其中：
- `d = a + b`（加法節點）
- `y = d × c`（乘法節點）

## 計算圖的兩個階段

### 1. 前向傳播：建立計算圖 + 計算數值

當你執行運算時，系統會：
1. 計算結果
2. **記錄**這個運算和它的輸入

```python
a = Value(2.0)
b = Value(3.0)
c = Value(4.0)

d = a + b      # d 記住：「我是 a+b 產生的」
y = d * c      # y 記住：「我是 d×c 產生的」
```

這樣就形成了一個「計算歷史」——計算圖。

### 2. 反向傳播：沿著計算圖回溯

當你呼叫 `y.backward()` 時，系統會：
1. 從 `y` 開始，沿著計算圖**反向**走
2. 在每個節點，用**鏈式法則**計算梯度
3. 把梯度累加到每個輸入節點

```
前向：a, b, c → d → y
反向：∂y/∂a, ∂y/∂b, ∂y/∂c ← ∂y/∂d ← ∂y/∂y (=1)
```

## micrograd：50 行實現自動微分

Andrej Karpathy 的 micrograd 是最精簡的自動微分實現。讓我們看看核心程式碼：

### Value 類：可追蹤的數值

```python
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data          # 實際數值
        self.grad = 0             # 梯度（初始為 0）
        self._backward = lambda: None  # 反向傳播函數
        self._prev = set(_children)    # 記住「我是從誰產生的」
        self._op = _op                 # 記住「什麼運算產生了我」
```

每個 Value 都記住：
- 自己的數值（`data`）
- 自己的梯度（`grad`）
- 產生自己的「父節點」（`_prev`）
- 產生自己的運算（`_op`）

### 加法：記錄運算 + 定義反向傳播

```python
def __add__(self, other):
    other = other if isinstance(other, Value) else Value(other)
    out = Value(self.data + other.data, (self, other), '+')
    
    def _backward():
        self.grad += out.grad   # 加法的梯度：1 × 上游梯度
        other.grad += out.grad  # 兩個輸入都是 1
    out._backward = _backward
    
    return out
```

**關鍵**：`_backward` 函數定義了「當我知道輸出的梯度時，怎麼算輸入的梯度」。

對於加法 `c = a + b`：
- ∂c/∂a = 1
- ∂c/∂b = 1
- 所以 `a.grad += 1 × out.grad`

### 乘法：梯度交叉傳遞

```python
def __mul__(self, other):
    other = other if isinstance(other, Value) else Value(other)
    out = Value(self.data * other.data, (self, other), '*')
    
    def _backward():
        self.grad += other.data * out.grad  # ∂(a×b)/∂a = b
        other.grad += self.data * out.grad  # ∂(a×b)/∂b = a
    out._backward = _backward
    
    return out
```

對於乘法 `c = a × b`：
- ∂c/∂a = b（乘上另一個輸入）
- ∂c/∂b = a（乘上另一個輸入）

### Tanh 激活函數

```python
def tanh(self):
    t = math.tanh(self.data)
    out = Value(t, (self,), 'tanh')
    
    def _backward():
        self.grad += (1 - t**2) * out.grad  # tanh 的導數是 1-tanh²
    out._backward = _backward
    
    return out
```

### backward()：拓撲排序 + 反向遍歷

```python
def backward(self):
    # 拓撲排序：確保依賴關係正確
    topo = []
    visited = set()
    def build_topo(v):
        if v not in visited:
            visited.add(v)
            for child in v._prev:
                build_topo(child)
            topo.append(v)
    build_topo(self)
    
    # 反向遍歷
    self.grad = 1  # 起點梯度為 1
    for v in reversed(topo):
        v._backward()
```

**拓撲排序**確保我們按正確順序計算：先算靠近輸出的節點，再算靠近輸入的節點。

## 手動驗算

讓我們用一個具體例子驗證：

```python
a = Value(2.0)
b = Value(-3.0)
c = Value(10.0)

d = a * b      # d = 2 × (-3) = -6
e = d + c      # e = -6 + 10 = 4
f = e.tanh()   # f = tanh(4) ≈ 0.9993
```

計算圖：
```
a(2) ──┐
       ├──→ [×] ──→ d(-6) ──┐
b(-3) ─┘                     ├──→ [+] ──→ e(4) ──→ [tanh] ──→ f(0.9993)
                      c(10) ─┘
```

**反向傳播**：

```
1. f.grad = 1（起點）

2. e.grad = f.grad × (1 - tanh²(4))
          = 1 × (1 - 0.9993²)
          ≈ 0.0013

3. d.grad = e.grad × 1 = 0.0013（加法的梯度是 1）
   c.grad = e.grad × 1 = 0.0013

4. a.grad = d.grad × b.data = 0.0013 × (-3) = -0.0040
   b.grad = d.grad × a.data = 0.0013 × 2 = 0.0027
```

這就是「自動」的部分——我們只寫了前向計算，梯度自動算出來了！

## 為什麼用計算圖？

### 1. 模組化

每種運算只需要定義自己的 `_backward`，不需要知道整個網路的結構。

```python
# 加法的 _backward
self.grad += out.grad
other.grad += out.grad

# 乘法的 _backward
self.grad += other.data * out.grad
other.grad += self.data * out.grad
```

### 2. 動態圖 vs 靜態圖

**PyTorch（動態圖）**：
- 每次前向傳播都重新建立計算圖
- 靈活，可以有條件分支和迴圈
- Debug 容易

**TensorFlow 1.x（靜態圖）**：
- 先定義圖，再執行
- 可以優化整個圖
- 部署效率高

### 3. 自動處理複雜情況

**共享權重**：同一個權重被多次使用時，梯度會自動累加。

```python
y = w * x1 + w * x2  # w 被用了兩次
# w.grad 會是兩個梯度的和
```

**分支和合併**：計算圖自然處理任意的網路結構。

## 與 PyTorch 的對比

micrograd 是教學用的簡化版。PyTorch 做了更多：

| 特性 | micrograd | PyTorch |
|-----|-----------|---------|
| 資料類型 | 單一純量 | 張量（多維陣列）|
| 運算 | 基本運算 | 數百種運算 |
| GPU | ❌ | ✅ |
| 自動向量化 | ❌ | ✅ |
| 計算圖優化 | ❌ | ✅ |

但核心原理是一樣的：
1. 前向傳播時記錄計算圖
2. 反向傳播時沿圖計算梯度

## 互動視覺化

我製作了一個互動工具，讓你可以：
- 觀察計算圖的結構
- 看前向傳播如何計算數值
- 看反向傳播如何傳遞梯度
- 調整輸入值，觀察梯度變化

👉 <a href="/htmls/computation-graph.html" target="_blank">計算圖互動視覺化</a>

建議你注意：
1. 每個節點如何記住自己的「父節點」
2. 反向傳播的順序（從輸出到輸入）
3. 點擊節點看它的數值和梯度

## 小結

今天我們學到了：

1. **計算圖**是表示數學運算的有向無環圖
2. **前向傳播**：計算數值 + 記錄運算歷史
3. **反向傳播**：沿計算圖回溯，用鏈式法則算梯度
4. **micrograd 的核心**：每個運算定義自己的 `_backward`
5. **拓撲排序**確保梯度計算順序正確
6. **梯度累加**處理共享權重
7. PyTorch 等框架的核心原理與 micrograd 相同

## 下一篇預告

到目前為止，我們已經理解了神經網路的所有核心概念：
- 神經元如何運算
- 為什麼需要激活函數
- 如何用梯度下降優化
- 反向傳播如何計算梯度
- 計算圖如何實現自動微分

下一篇，我們會把這些概念**組合起來**，實際訓練一個多層神經網路！我們會看到決策邊界如何從一條直線，逐漸變成能分開複雜數據的曲線。

---

*本文是「從零理解神經網路」系列的第五篇。如果你覺得有幫助，歡迎分享給也在學習 ML 的朋友。*

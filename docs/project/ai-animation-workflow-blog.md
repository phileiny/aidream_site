# 從劇本到成品：我用 AI 工具打造動畫短影片的完整工作流

> 台灣的影視環境，拍一部片動輒數年，光劇本定稿就會搞個幾個月。但當 AI 工具越來越成熟，我們是不是可以用另一種方式說故事？

這篇文章記錄了我和 Nicole（我太太，專業編劇）過去 10 天的 Side Project 探索。我們嘗試用 ComfyUI、Kling、ElevenLabs 等工具，將她寫的靈異懸疑劇本《靈體背後的故事》製作成 AI 動畫短影片。

**作者**：Ray
**日期**：2026 年 1 月 10 日  

---

## 為什麼要做這件事？

Nicole 是編劇出身，寫過不少劇本，但台灣影視產業的現實是：一個劇本從完成到開拍，可能要等上好幾年。有些好故事就這樣躺在抽屜裡。

我們的想法很簡單：**既然 AI 生成影像的品質已經到了一定水準，何不試著用 AI 來「拍」她的劇本？**

目標不是取代真人拍攝，而是：
- 快速驗證劇本的視覺呈現效果
- 累積短影片內容，建立系列 IP
- 探索 AI 影像創作的工作流程

---

## 專案概覽：《靈體背後的故事》EP1

### 故事簡介

室內設計師小莫能看見靈體，她的助理琦琦則有「幽靈嗅」——能聞到別人聞不到的味道。

一位失智老婦人請小莫裝修擱置十年的老公寓，要給兒子當結婚禮物。但當她們踏入那間公寓，琦琦開始頭暈、聞到燒香味，小莫則在陽台看見一個穿棕色外套的男人在抽煙......

這是一個關於雙胞胎兄弟、三角關係、背叛與死亡的故事。結局有個反轉：那真的是自殺嗎？

### 角色設定

| 角色 | 描述 | 參考形象 |
|------|------|----------|
| 小莫 | 35歲室內設計師，能看見靈體 | 專業幹練、短髮、溫暖眼神 |
| 琦琦 | 26歲助理，有幽靈嗅 | 參考雷嘉汭，知性文青風 |
| 老婦人 | 建澤母親，輕微失智 | 70歲、滄桑憔悴 |
| 哥哥 | 靈體，被背叛後上吊 | 棕色皮夾克、幽怨眼神 |
| 建澤 | 雙胞胎弟弟 | 與哥哥同臉，白襯衫 |

![琦琦定裝照](/images/1-4琦琦.png)
*琦琦定裝照：高丸子頭、圓框金屬眼鏡、米色風衣——經過數十次調整才確定的形象*

---

## 工具組合與成本

經過這段時間的測試，我整理出以下工具組合：

| 環節 | 工具 | 成本 | 備註 |
|------|------|------|------|
| 角色圖片生成 | ComfyUI + majicmixRealistic | 免費 | 本地運行，需要顯卡 |
| 臉部一致性 | IPAdapter PLUS FACE / FaceID | 免費 | ComfyUI 節點 |
| 表情變化 | Google AI Studio + Gemini | 免費額度 | Nano Banana 模式 |
| 圖轉影片 | Kling Video 2.6 | 訂閱制 | img2video 效果驚艷 |
| 配音 | ElevenLabs | 訂閱制 | 支援聲紋克隆 |
| 對嘴同步 | Kling Lip Sync | 同上 | 關鍵！讓影片有說服力 |
| 剪輯 | CapCut / 剪映 | 免費 | 加字幕、音效 |

**重點發現**：Kling 的 Video 2.6 img2video 效果真的很驚人，但它內建的語音功能不行。解決方案是用 Nicole 的聲音透過 ElevenLabs 做聲紋克隆生成配音，再用 **Kling 的 Lip Sync** 功能重新對嘴。這個組合才製作出覺得可以接受的影片片段。

---

## 核心工作流程

```
劇本 → 分鏡設計 → 角色定裝 → 關鍵幀生成 → 圖轉影片 → 配音對嘴 → 剪輯合成
```

### Step 1：角色定裝（最花時間的環節）

角色一致性是 AI 動畫最大的挑戰。以琦琦這個角色為例：

**設定目標**：參考雷嘉汭的形象，知性文青風，圓框金屬眼鏡，高丸子頭。

**ComfyUI 配置**：
- 模型：majicmixRealistic_v7
- FaceID：FACEID PLUS V2（比 PLUS FACE 更準確）
- IPAdapter weight：0.90
- ControlNet：control_v11p_sd15_openpose（強度 0.20）

**調了多少張**：數十張。真的沒有捷徑，就是不斷調整 prompt、seed、weight，直到找到滿意的結果。

**關鍵 Prompt 結構**：
```
masterpiece, best quality, photorealistic, highly detailed skin texture,
upper body portrait, 1girl, young East Asian woman, early 20s,
[臉部特徵], [眼鏡描述], [髮型], [服裝],
```

**負面 Prompt 同樣重要**：
```
heavy makeup, glamorous, sexy, seductive, black frame glasses, 
thick frame glasses, no glasses, long hair down, cartoon, anime, 
deformed face, bad anatomy, blurry
```

### Step 2：表情變化（Gemini 的妙用）

一開始我用 ComfyUI 生成不同表情，但一致性很難控制。

後來發現 **Google AI Studio 的 Playground** 搭配 Gemini 2.5 Flash Image（Nano Banana 模式），效果好很多。

用中文 prompt 就可以：
```
角色表情參考圖，26歲亞洲女性，高丸子頭，圓形金色金屬框眼鏡，
濃眉，眼神深邃，米色風衣外套，奶油色襯衫內搭。

以 2x3 格子呈現 6 種表情：
1. 平靜
2. 好奇疑惑
3. 害怕驚嚇
4. 頭暈不適
5. 震驚恐懼
6. 驚訝難以置信

白色背景，角色設計一致，寫實風格
```

這個方法生成的表情一致性比 ComfyUI 好控制，而且速度更快。

![琦琦表情變化](/images/琦琦_表情.jpeg)
*用 Gemini AI Studio 生成的琦琦表情變化：從平靜、疑惑、害怕到震驚，角色一致性相當穩定*

### Step 3：圖轉影片（Kling 的威力）

Kling Video 2.6 的 img2video 功能是目前我測試過效果最好的。

給它一張定裝照，加上動作描述，它能生成相當自然的動態。但有幾個注意事項：

- 不要期待太複雜的動作
- 5 秒左右的片段品質最穩定
- 臉部表情變化要小心，容易崩壞

### Step 4：配音與對嘴（關鍵一步）

這是讓影片從「AI 感很重」變成「還可以看」的關鍵。

**配音流程**：
1. Nicole 錄製 1 分多鐘的聲音樣本
2. 用 ElevenLabs 做聲紋克隆（Voice Clone）
3. 輸入台詞文字，生成配音音檔
4. 用 **Kling Lip Sync** 將配音與影片對嘴同步

<video controls width="100%">
  <source src="/images/琦琦影片.mp4" type="video/mp4">
</video>
*實際成果：琦琦說台詞的片段，配音來自 Nicole 的聲紋克隆，對嘴使用 Kling Lip Sync*

**台詞小技巧**：為了保持台灣口音的自然感，台詞要加入語氣詞：

| 語氣詞 | 範例 |
|--------|------|
| 啦 | 「沒事沒事啦」 |
| 耶 | 「我什麼都沒看到耶」 |
| 喔 | 「頭好暈喔」 |
| 欸 | 「欸等等」 |
| 蛤 | 「蛤？怎麼會？」 |

測試通過的台詞範本：
```
突然頭好暈喔，大概太久沒爬那麼多層樓梯了啦，沒事沒事。
超煩的耶，你知道我最怕老鼠了啦！
欸等等，妳有聞到燒香的味道嗎？
```

---

## 視覺風格設定

為了維持系列的一致性，我們定義了幾個視覺規則：

### 色調分類

| 場景類型 | 色調風格 |
|----------|----------|
| 現實場景 | 自然光、暖色點綴 |
| 靈異場景 | 青灰色調、低飽和度、對比強烈 |
| 回憶場景 | 褪色濾鏡、顆粒感 |

### J-Horror 風格模板

針對恐怖場景，我們建立了標準化的 prompt 模板：

**場景 Prompt**：
```
old cluttered japanese apartment, dim green fluorescent light, 
warm yellow lamp in background, scattered papers and debris on floor, 
peeling walls, dusty atmosphere, deep shadows, muted desaturated colors, 
film grain, j-horror atmosphere
```

**人物負面 Prompt**（避免太漂亮、太性感）：
```
bare shoulders, exposed skin, off shoulder, sexy, seductive, beautiful, 
pretty, glamorous, red lipstick, makeup, happy, smiling, deformed face
```

### 服裝注意事項

AI 生成人物時，露肩問題很常見。解決方案是在 prompt 裡明確指定：

| 建議使用 | 避免使用 |
|----------|----------|
| high neck sweater | knit sweater |
| crewneck sweater | off shoulder |
| hoodie | loose sweater |
| zip-up jacket | - |

---

## 目前的成果與挑戰

### 做到了什麼

- 完成 6 個主要角色的定裝設定
- 建立可重複使用的 ComfyUI workflow
- 製作出第一個 5 秒的測試片段（配音 + 對嘴）
- 整理出完整的角色 prompt 文件

### 還在解決的問題

1. **角色一致性**：跨場景時臉還是會飄移，需要更多 IPAdapter 調整
2. **動作連貫性**：5 秒以上的動作容易出問題
3. **全身構圖**：腳部容易變形，需要 Inpainting 修復
4. **效率**：單一場景的完整製作流程還是太長

---

## 下一步計畫

- [ ] 完成 EP1 場景 1-3 的完整影片
- [ ] 建立固定片頭片尾模板
- [ ] 探索批次生成的可能性
- [ ] 建立整部影片生成工作流的統一平台

---

## 給想嘗試的人的建議

1. **從角色定裝開始**：這是最花時間但最重要的一步。沒有穩定的角色，後面都是白做。

2. **善用 Seed**：找到滿意的結果後，一定要記錄 seed。我們每個角色都有完整的參數記錄。

3. **不要只用一種工具**：ComfyUI 做基礎生成，Gemini 做表情變化，Kling 做影片，ElevenLabs 做配音——組合起來效果最好。

4. **接受「還可以」**：AI 生成的影片目前還達不到專業影視水準，但作為短影片內容，已經足夠引起觀眾興趣了。

5. **保持系統性**：建立文件、記錄參數、整理 workflow。這不是做一次就結束的事，而是要能重複使用。

---

## 結語

這 10 天的探索讓我確信：AI 動畫短影片是一個可行的創作形式。

它不會取代真人影視製作，但它提供了另一種可能——讓那些躺在抽屜裡的劇本，有機會用另一種方式被看見。

對 Nicole 來說，這是一個驗證創意的快速通道。對我來說，這是一個結合技術與創意的有趣實驗。

我們會持續更新這個專案的進度。如果你也在做類似的嘗試，歡迎交流。

---

*專案持續更新中*
*InsightCosmos | blog.aidream.com.tw*

<template>
  <div class="visitor-counter">
    <div class="counter-container">
      <p class="counter-text">
        📊 本站總訪問量：
        <span id="busuanzi_value_site_pv" class="counter-number">載入中...</span> 次
        &nbsp;|&nbsp;
        👥 當前在線人數：
        <span id="busuanzi_value_site_uv" class="counter-number">載入中...</span> 人
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'

onMounted(() => {
  // 確保不蒜子腳本正確載入
  if (typeof window !== 'undefined') {
    // 檢查腳本是否已經存在
    const existingScript = document.querySelector('script[src*="busuanzi"]')
    
    if (!existingScript) {
      // 創建並載入不蒜子腳本
      const script = document.createElement('script')
      script.async = true
      script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js'
      
      script.onload = () => {
        // 腳本載入完成後，等待一小段時間讓統計更新
        nextTick(() => {
          setTimeout(() => {
            // 檢查是否有異常大的數字（可能是繼承了其他網站的統計）
            const pvElement = document.getElementById('busuanzi_value_site_pv')
            const uvElement = document.getElementById('busuanzi_value_site_uv')
            
            if (pvElement && uvElement) {
              const pv = parseInt(pvElement.textContent || '0')
              const uv = parseInt(uvElement.textContent || '0')
              
              // 如果數字異常大（超過 1000 萬），可能是錯誤數據，重置為 0
              if (pv > 10000000 || uv > 10000000 || isNaN(pv) || isNaN(uv)) {
                pvElement.textContent = '0'
                uvElement.textContent = '0'
              }
            }
          }, 1000)
        })
      }
      
      document.head.appendChild(script)
    } else {
      // 如果腳本已存在，檢查並修正異常數字
      nextTick(() => {
        setTimeout(() => {
          const pvElement = document.getElementById('busuanzi_value_site_pv')
          const uvElement = document.getElementById('busuanzi_value_site_uv')
          
          if (pvElement && uvElement) {
            const pv = parseInt(pvElement.textContent || '0')
            const uv = parseInt(uvElement.textContent || '0')
            
            if (pv > 10000000 || uv > 10000000 || isNaN(pv) || isNaN(uv)) {
              pvElement.textContent = '0'
              uvElement.textContent = '0'
            }
          }
        }, 1000)
      })
    }
  }
})
</script>

<style scoped>
.visitor-counter {
  margin: 3rem 0;
  text-align: center;
}

.counter-container {
  display: inline-block;
  padding: 1.5rem 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.counter-text {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.counter-number {
  font-weight: bold;
  color: var(--vp-c-brand);
}
</style>

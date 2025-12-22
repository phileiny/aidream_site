<template>
  <div class="font-size-controller">
    <button 
      class="font-size-btn" 
      @click="togglePanel"
      :title="'調整字型大小 (目前: ' + currentSize + ')'"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
      </svg>
    </button>
    
    <Transition name="slide-fade">
      <div v-if="showPanel" class="font-size-panel">
        <div class="panel-header">
          <span>字型大小</span>
          <button class="close-btn" @click="showPanel = false">×</button>
        </div>
        
        <div class="size-options">
          <button 
            v-for="size in fontSizes" 
            :key="size.value"
            :class="['size-option', { active: currentSize === size.value }]"
            @click="setFontSize(size.value)"
          >
            {{ size.label }}
          </button>
        </div>
        
        <div class="slider-container">
          <label>自訂大小: {{ currentSize }}</label>
          <input 
            type="range" 
            min="12" 
            max="24" 
            step="1"
            v-model.number="currentSize"
            @input="setFontSize(currentSize)"
            class="size-slider"
          />
          <div class="slider-labels">
            <span>小</span>
            <span>中</span>
            <span>大</span>
          </div>
        </div>
        
        <button class="reset-btn" @click="resetFontSize">
          重置為預設
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const showPanel = ref(false)
const currentSize = ref(16)

const fontSizes = [
  { label: '小', value: 14 },
  { label: '標準', value: 16 },
  { label: '中', value: 18 },
  { label: '大', value: 20 },
  { label: '特大', value: 22 }
]

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const setFontSize = (size: number) => {
  currentSize.value = size
  document.documentElement.style.setProperty('--vp-font-size-text', `${size}px`)
  document.documentElement.style.setProperty('--vp-font-size-base', `${size}px`)
  
  // 儲存到 localStorage
  localStorage.setItem('vitepress-font-size', size.toString())
}

const resetFontSize = () => {
  setFontSize(16)
}

// 頁面載入時恢復使用者設定
onMounted(() => {
  const savedSize = localStorage.getItem('vitepress-font-size')
  if (savedSize) {
    setFontSize(parseInt(savedSize))
  }
})
</script>

<style scoped>
.font-size-controller {
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 12px;
  z-index: 100;
}

.font-size-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.font-size-btn:hover {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
}

.font-size-panel {
  position: absolute;
  top: 50px;
  right: 0;
  width: 280px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: var(--vp-c-text-2);
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: var(--vp-c-default-soft);
}

.size-options {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.size-option {
  flex: 1;
  min-width: 45px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.size-option:hover {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand-soft);
}

.size-option.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.slider-container {
  margin-bottom: 16px;
}

.slider-container label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.size-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  -webkit-appearance: none;
  margin-bottom: 4px;
}

.size-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  transition: all 0.2s;
}

.size-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.size-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
  border: none;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--vp-c-text-3);
  padding: 0 4px;
}

.reset-btn {
  width: 100%;
  padding: 8px;
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

/* 動畫效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .font-size-controller {
    margin-left: 8px;
  }
  
  .font-size-btn {
    width: 36px;
    height: 36px;
  }
  
  .font-size-panel {
    width: 260px;
    right: 0;
  }
}

</style>

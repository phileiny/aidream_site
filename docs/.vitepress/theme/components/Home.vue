<template>
  <div class="VPHome">
    <VPHomeHero v-if="frontmatter.hero" :hero="frontmatter.hero" />
    <VPHomeFeatures v-if="frontmatter.features" :features="frontmatter.features" />
    <!-- 在這裡插入訪客計數器 -->
    <VisitorCounter />
    <VPHomeContent />
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import VPHomeHero from 'vitepress/dist/client/theme-default/components/VPHomeHero.vue'
import VPHomeFeatures from 'vitepress/dist/client/theme-default/components/VPHomeFeatures.vue'
import VPHomeContent from 'vitepress/dist/client/theme-default/components/VPHomeContent.vue'
import VisitorCounter from '../../components/VisitorCounter.vue'

const { frontmatter } = useData()
</script>

<style scoped>
.VPHome {
  padding: 0 24px;
}

@media (min-width: 960px) {
  .VPHome {
    padding: 0 32px;
  }
}

@media (min-width: 1280px) {
  .VPHome {
    padding: 0 48px;
  }
}
</style>

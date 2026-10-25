<script setup lang="ts">
import { sections } from "../composables/useSectionNavigation";
import SiteIcon from "./SiteIcon.vue";
defineProps<{ name: string; current: string; dark: boolean }>();
defineEmits<{ theme: [] }>();
</script>
<template>
  <a class="skip" href="#articles">跳到文章</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="site-name" href="#home"
        ><span data-profile>{{ name }}</span
        >小站<span class="brand-period">.</span></a
      >
      <nav aria-label="主要导航">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="'#' + section.id"
          :aria-current="current === section.id ? 'page' : undefined"
          >{{ section.label }}</a
        >
      </nav>
      <button
        id="color-toggle"
        :aria-label="dark ? '切换到日间模式' : '切换到夜间模式'"
        :aria-pressed="dark"
        @click="$emit('theme')"
      >
        <SiteIcon :name="dark ? 'sun' : 'moon'" />
      </button>
    </div>
  </header>
  <nav class="page-dots" aria-label="切换内容块">
    <a
      v-for="section in sections"
      :key="section.id"
      :href="'#' + section.id"
      :aria-label="section.label"
      :aria-current="current === section.id ? 'true' : undefined"
      ><span>{{ section.label }}</span></a
    >
  </nav>
</template>

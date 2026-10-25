<script setup lang="ts">
import SiteIcon from "./SiteIcon.vue";
defineProps<{ name: string }>();
defineEmits<{ contact: [] }>();
const year = new Date().getFullYear();
</script>
<template>
  <section id="home" class="page-panel home-panel" aria-labelledby="home-title">
    <div class="home-identity">
      <div class="avatar" aria-label="示例文字头像">
        <span>序</span><span class="avatar-dot"></span>
      </div>
      <h1 id="home-title">你好，欢迎来到我的小站。</h1>
      <p class="home-subtitle">写一些日常，也留一点空白。</p>
      <div class="small-entrances" aria-label="小站入口">
        <a href="#articles" aria-label="读文章" title="读文章"
          ><SiteIcon name="book" /></a
        ><a href="#moments" aria-label="看日常" title="看日常"
          ><SiteIcon name="cup" /></a
        ><button
          aria-label="打个招呼"
          title="打个招呼"
          @click="$emit('contact')"
        >
          <SiteIcon name="mail" />
        </button>
      </div>
    </div>
    <a class="scroll-cue" href="#articles"
      ><span>向下看看</span><SiteIcon name="down"
    /></a>
    <div class="home-footer">
      <span
        >© {{ year }} <span data-profile>{{ name }}</span
        >的小站</span
      ><span>写一点日常，留一点空白。</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useId } from "vue";
import SiteIcon from "./SiteIcon.vue";
defineProps<{ name: string }>();
defineEmits<{ contact: [] }>();
const year = new Date().getFullYear();
const avatarPaintId = useId();
</script>
<template>
  <section id="home" class="page-panel home-panel" aria-labelledby="home-title">
    <div class="home-identity">
      <div class="avatar" aria-label="示例文字头像" data-reveal>
        <span>序</span>
        <svg class="avatar-artwork" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient
              :id="`${avatarPaintId}-fill`"
              x1="17.86%"
              y1="11.7%"
              x2="82.14%"
              y2="88.3%"
            >
              <stop class="avatar-fill-start" />
              <stop class="avatar-fill-end" offset="1" />
            </linearGradient>
          </defs>
          <circle
            class="avatar-outline"
            cx="50%"
            cy="50%"
            r="49%"
            shape-rendering="geometricPrecision"
          />
          <circle
            class="avatar-fill"
            cx="50%"
            cy="50%"
            r="46.25%"
            :fill="`url(#${avatarPaintId}-fill)`"
            shape-rendering="geometricPrecision"
          />
        </svg>
        <span class="avatar-dot"></span>
      </div>
      <h1 id="home-title" data-reveal data-section-reveal data-reveal-step="1">
        你好，欢迎来到我的小站。
      </h1>
      <p class="home-subtitle" data-reveal data-section-reveal data-reveal-step="2">
        写一些日常，也留一点空白。
      </p>
      <div
        class="small-entrances"
        aria-label="小站入口"
        data-reveal
        data-reveal-step="3"
      >
        <a href="#articles" aria-label="读文章" title="读文章"
          ><SiteIcon name="github" /></a
        ><a href="#moments" aria-label="看日常" title="看日常"
          ><SiteIcon name="rss" /></a
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

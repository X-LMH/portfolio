<script setup lang="ts">
import { ref, watch } from "vue";
import type { Article } from "../types/site";
import BaseDialog from "./BaseDialog.vue";
const props = defineProps<{ article: Article | null }>();
const linkPressed = ref(false);
watch(() => props.article, () => (linkPressed.value = false));
defineEmits<{ close: [] }>();
</script>
<template>
  <BaseDialog
    id="entry-reader"
    :open="article !== null"
    labelledby="entry-title"
    @close="$emit('close')"
    ><template v-if="article"
      ><div class="reader-top">
        <span>{{ article.kind }}</span
        ><button aria-label="关闭文章" autofocus @click="$emit('close')">
          ×
        </button>
      </div>
      <h2 id="entry-title">{{ article.title }}</h2>
      <div id="entry-copy">
        <p v-for="(paragraph, index) in article.paragraphs" :key="index">
          {{ paragraph }}
        </p>
      </div>
      <div class="reader-bottom">
        <span>此篇为示例文字。</span
        ><button
          class="motion-link"
          :class="{ 'is-pressed': linkPressed }"
          @pointerdown="linkPressed = true"
          @pointerup="linkPressed = false"
          @pointercancel="linkPressed = false"
          @pointerleave="linkPressed = false"
          @blur="linkPressed = false"
          @click="$emit('close')"
        >读完了，返回 ↩</button>
      </div></template
    ></BaseDialog
  >
</template>

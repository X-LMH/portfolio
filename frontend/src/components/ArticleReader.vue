<script setup lang="ts">
import type { Article } from "../types/site";
import BaseDialog from "./BaseDialog.vue";
defineProps<{ article: Article | null }>();
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
        ><button @click="$emit('close')">读完了，返回 ↩</button>
      </div></template
    ></BaseDialog
  >
</template>

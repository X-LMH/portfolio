<script setup lang="ts">
import { computed } from "vue";
import type { Article } from "../types/site";
const props = defineProps<{ articles: Article[] }>();
defineEmits<{ read: [id: string] }>();
const featured = computed(
  () => props.articles.find((article) => article.featured) ?? props.articles[0],
);
const shortReads = computed(() =>
  props.articles.filter((article) => article.id !== featured.value?.id),
);
const dateLabel = (value: string) => value.replaceAll("-", ".");
</script>
<template>
  <section
    id="articles"
    class="page-panel ag-writing"
    aria-labelledby="writing-title"
  >
    <div class="ag-writing-inner">
      <header class="ag-heading">
        <span class="eyebrow">01 / 随笔</span>
        <h2 id="writing-title">
          把日子，轻轻写下来<span aria-hidden="true">。</span>
        </h2>
        <p>散步之后，合上书之前。</p>
      </header>
      <article v-if="featured" class="ag-feature">
        <div>
          <span class="ag-meta"
            >{{ dateLabel(featured.date) }} · {{ featured.kind }}</span
          ><button class="ag-feature-title" @click="$emit('read', featured.id)">
            <h3>{{ featured.title }}</h3>
            <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div class="ag-feature-copy">
          <p>{{ featured.excerpt }}</p>
          <button class="text-link" @click="$emit('read', featured.id)">
            花一点时间读完 →
          </button>
        </div>
      </article>
      <div class="ag-short-reads">
        <article
          v-for="article in shortReads"
          :key="article.id"
          class="ag-frost"
        >
          <span class="ag-meta"
            >{{ dateLabel(article.date).slice(5) }} ·
            {{ article.kind.split(" / ")[0] }}</span
          ><button @click="$emit('read', article.id)">
            <h3>{{ article.title }}</h3>
            <span aria-hidden="true">↗</span>
          </button>
          <p>{{ article.excerpt }}</p>
        </article>
      </div>
      <p v-if="!articles.length" class="empty-state">
        这里的文字，正在慢慢整理。
      </p>
    </div>
  </section>
</template>

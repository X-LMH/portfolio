<script setup lang="ts">
import type { Moment } from "../types/site";
defineProps<{ moments: Moment[] }>();
</script>
<template>
  <section
    id="moments"
    class="page-panel ag-moments"
    aria-labelledby="moments-title"
  >
    <div class="ag-moments-inner">
      <header class="ag-heading" data-reveal>
        <span class="eyebrow">02 / 片刻</span>
        <h2 id="moments-title">今天也有，小小的好事。</h2>
        <p>写得很短，记得很久。</p>
      </header>
      <div class="ag-timeline" data-reveal-rule>
        <article
          v-for="(moment, index) in moments"
          :key="moment.id"
          data-reveal
          :data-reveal-step="Math.min(index + 1, 3)"
        >
          <time class="ag-frost" :datetime="moment.date">{{
            moment.date.slice(5).replace("-", ".")
          }}</time>
          <h3>{{ moment.title }}</h3>
          <p>{{ moment.text }}</p>
          <span v-if="index === 0" class="ag-end-mark" aria-hidden="true"
            >✧</span
          >
        </article>
      </div>
      <p v-if="!moments.length" class="empty-state">等一个值得记下的片刻。</p>
    </div>
  </section>
</template>

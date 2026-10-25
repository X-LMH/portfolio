<script setup lang="ts">
import type { Profile } from "../types/site";
defineProps<{ profile: Profile }>();
defineEmits<{ contact: []; edit: [] }>();
</script>
<template>
  <section id="about" class="page-panel ag-about" aria-labelledby="about-title">
    <div class="ag-letter">
      <span class="eyebrow">03 / 很高兴认识你</span>
      <h2 id="about-title">让日子慢一点，<br />让相遇自然一点。</h2>
      <p class="ag-about-copy" data-profile>{{ profile.about }}</p>
      <p class="ag-now">
        <span>最近</span><span data-profile>{{ profile.now }}</span>
      </p>
      <p class="ag-signature" data-profile>{{ profile.name }}</p>
      <div class="ag-contact-bar ag-frost">
        <button @click="$emit('contact')">
          留一句问候 <span aria-hidden="true">↗</span></button
        ><span aria-hidden="true"></span
        ><button @click="$emit('edit')">编辑小站资料</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>
<template>
  <div role="status" aria-live="polite" aria-atomic="true">
    <Transition name="toast">
      <div v-if="message" class="ps-toast">{{ message }}</div>
    </Transition>
  </div>
</template>

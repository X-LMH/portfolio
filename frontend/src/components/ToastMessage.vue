<script setup lang="ts">
defineProps<{ message: string }>();
</script>
<template>
  <div
    class="ps-toast"
    :class="{ 'ps-visible': message }"
    :hidden="!message"
    role="status"
    aria-live="polite"
  >
    {{ message }}
  </div>
</template>

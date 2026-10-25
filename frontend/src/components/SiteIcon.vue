<script setup lang="ts">
defineProps<{ name: "book" | "cup" | "mail" | "moon" | "sun" | "down" }>();
</script>
<template>
  <svg v-if="name === 'book'" viewBox="0 0 32 32" aria-hidden="true">
    <path
      d="M16 8c-4-3-8-3-12-1v20c4-2 8-2 12 1 4-3 8-3 12-1V7c-4-2-8-2-12 1Zm0 0v20"
    />
  </svg>
  <svg v-else-if="name === 'cup'" viewBox="0 0 32 32" aria-hidden="true">
    <path
      d="M5 13h19v10a7 7 0 0 1-7 7h-5a7 7 0 0 1-7-7Zm19 1h3a4 4 0 0 1 0 8h-3M9 3c-4 5 4 4 0 8m7-8c-4 5 4 4 0 8"
    />
  </svg>
  <svg v-else-if="name === 'mail'" viewBox="0 0 32 32" aria-hidden="true">
    <rect x="3" y="6" width="26" height="20" rx="3" />
    <path d="m4 8 12 10L28 8" />
  </svg>
  <svg v-else-if="name === 'moon'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.7 14A8.8 8.8 0 0 1 10 3.3 9 9 0 1 0 20.7 14Z" />
  </svg>
  <svg v-else-if="name === 'sun'" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path
      d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"
    />
  </svg>
  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
</template>

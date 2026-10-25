<script setup lang="ts">
defineProps<{
  name: "book" | "cup" | "github" | "rss" | "mail" | "moon" | "sun" | "down";
}>();
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
  <svg v-else-if="name === 'github'" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
    />
  </svg>
  <svg v-else-if="name === 'rss'" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="5" cy="19" r="1" />
    <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
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

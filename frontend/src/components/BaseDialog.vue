<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
const props = defineProps<{ open: boolean; labelledby: string }>();
const emit = defineEmits<{ close: [] }>();
const dialog = ref<HTMLDialogElement>();
let returnFocus: HTMLElement | null = null;
let previousOverflow = "";
function unlock() {
  document.body.style.overflow = previousOverflow;
}
watch(
  () => props.open,
  async (open) => {
    await nextTick();
    const element = dialog.value;
    if (!element) return;
    if (open && !element.open) {
      returnFocus =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      element.showModal();
      element.scrollTop = 0;
    } else if (!open && element.open) element.close();
  },
  { immediate: true },
);
function closed() {
  unlock();
  emit("close");
  returnFocus?.focus({ preventScroll: true });
}
function clickBackdrop(event: MouseEvent) {
  if (event.target !== dialog.value) return;
  const rect = dialog.value.getBoundingClientRect();
  if (
    event.clientX < rect.left ||
    event.clientX > rect.right ||
    event.clientY < rect.top ||
    event.clientY > rect.bottom
  )
    dialog.value.close();
}
onBeforeUnmount(() => {
  if (dialog.value?.open) {
    dialog.value.close();
    unlock();
  }
});
</script>
<template>
  <dialog
    ref="dialog"
    :aria-labelledby="labelledby"
    @close="closed"
    @click="clickBackdrop"
  >
    <slot />
  </dialog>
</template>

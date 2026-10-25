import { onBeforeUnmount, ref } from "vue";
import { readStorage, writeStorage } from "../services/storage";
const dark = ref(readStorage("personal-space-color") === "dark");
function apply() {
  document.documentElement.dataset.color = dark.value ? "dark" : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark.value ? "#24232d" : "#fff7f9");
}
export function useTheme() {
  let transitionTimer: ReturnType<typeof setTimeout> | undefined;
  const root = document.documentElement;
  function finishTransition() {
    clearTimeout(transitionTimer);
    root.removeAttribute("data-theme-motion");
  }
  finishTransition();
  apply();
  onBeforeUnmount(finishTransition);
  return {
    dark,
    toggleTheme() {
      clearTimeout(transitionTimer);
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.setAttribute("data-theme-motion", "");
        // Resolve the old palette before changing its animated custom properties.
        getComputedStyle(root).getPropertyValue("--bg");
        transitionTimer = setTimeout(finishTransition, 400);
      } else finishTransition();
      dark.value = !dark.value;
      apply();
      return writeStorage(
        "personal-space-color",
        dark.value ? "dark" : "light",
      );
    },
  };
}

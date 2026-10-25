import { ref } from "vue";
import { readStorage, writeStorage } from "../services/storage";
const dark = ref(readStorage("personal-space-color") === "dark");
function apply() {
  document.documentElement.dataset.color = dark.value ? "dark" : "light";
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", dark.value ? "#24232d" : "#fcfaf9");
}
export function useTheme() {
  apply();
  return {
    dark,
    toggleTheme() {
      dark.value = !dark.value;
      apply();
      return writeStorage(
        "personal-space-color",
        dark.value ? "dark" : "light",
      );
    },
  };
}

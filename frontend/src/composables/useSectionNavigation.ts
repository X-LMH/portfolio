import { nextTick, onBeforeUnmount, watch, ref, type Ref } from "vue";
export const sections = [
  { id: "home", label: "首页" },
  { id: "articles", label: "文章" },
  { id: "moments", label: "片刻" },
  { id: "about", label: "关于" },
];
export function useSectionNavigation(ready: Ref<boolean>) {
  const current = ref("home");
  let frame = 0;
  const panels = () => [
    ...document.querySelectorAll<HTMLElement>(".page-panel"),
  ];
  function update() {
    frame = 0;
    current.value =
      panels().find((panel) => {
        const rect = panel.getBoundingClientRect();
        return (
          rect.top <= innerHeight * 0.45 && rect.bottom > innerHeight * 0.45
        );
      })?.id ?? "home";
  }
  function onScroll() {
    if (!frame) frame = requestAnimationFrame(update);
  }
  function restore() {
    const id = sections.some((section) => "#" + section.id === location.hash)
      ? location.hash.slice(1)
      : "home";
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "instant", block: "start" });
    update();
  }
  function onHashChange() {
    if (!sections.some((section) => "#" + section.id === location.hash))
      restore();
    else onScroll();
  }
  function onKey(event: KeyboardEvent) {
    const node = event.target;
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      document.querySelector("dialog[open]")
    )
      return;
    if (
      node instanceof HTMLElement &&
      (node.matches("input,textarea,select") || node.isContentEditable)
    )
      return;
    const step = event.key === "PageDown" ? 1 : event.key === "PageUp" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    update();
    const list = panels();
    const index = list.findIndex((panel) => panel.id === current.value);
    list[Math.max(0, Math.min(list.length - 1, index + step))]?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  const previousRestoration = history.scrollRestoration;
  watch(
    ready,
    async (value) => {
      if (!value) return;
      await nextTick();
      history.scrollRestoration = "manual";
      restore();
      addEventListener("scroll", onScroll, { passive: true });
      addEventListener("resize", onScroll);
      addEventListener("popstate", restore);
      addEventListener("hashchange", onHashChange);
      addEventListener("pageshow", restore);
      document.addEventListener("keydown", onKey);
    },
    { immediate: true },
  );
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
    removeEventListener("popstate", restore);
    removeEventListener("hashchange", onHashChange);
    removeEventListener("pageshow", restore);
    document.removeEventListener("keydown", onKey);
    history.scrollRestoration = previousRestoration;
  });
  return { current };
}

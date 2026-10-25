import { nextTick, onBeforeUnmount, watch, type Ref } from "vue";

/** Desktop follows active sections; natural scrolling reveals each group once. */
export function useReveal(ready: Ref<boolean>, current: Ref<string>) {
  const desktop = matchMedia("(min-width: 1024px)");
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  const elements = new Set<HTMLElement>();
  const seen = new WeakSet<HTMLElement>();
  const pending = new Set<HTMLElement>();
  const rules = new Set<HTMLElement>();
  const seenRules = new WeakSet<HTMLElement>();
  const pendingRules = new Set<HTMLElement>();
  let observer: IntersectionObserver | undefined;
  let initialized = false;
  let disposed = false;
  let lastSection = "";

  function reveal(element: HTMLElement, state = "shown") {
    element.dataset.revealState = state;
    seen.add(element);
    pending.delete(element);
    observer?.unobserve(element);
  }
  function finishAnimations() {
    elements.forEach((element) => {
      if (element.dataset.revealState !== "pending")
        element.dataset.revealState = "shown";
    });
    rules.forEach((rule) => {
      if (rule.dataset.ruleState !== "pending") rule.dataset.ruleState = "shown";
    });
  }
  function revealRule(rule: HTMLElement, animate = true) {
    rule.dataset.ruleState = animate ? "visible" : "shown";
    seenRules.add(rule);
    pendingRules.delete(rule);
    observer?.unobserve(rule);
  }
  function resetMode() {
    observer?.disconnect();
    observer = undefined;
    pending.clear();
    pendingRules.clear();
    // Keep unseen groups eligible for a later first reveal on narrow screens.
    elements.forEach((element) => (element.dataset.revealState = "shown"));
    rules.forEach((rule) => (rule.dataset.ruleState = "shown"));
  }
  function enterSection(id: string, initialHome = false) {
    finishAnimations();
    const panel = document.getElementById(id);
    const selector = id === "home" && !initialHome
      ? "[data-section-reveal]"
      : "[data-reveal]";
    const targets = panel?.querySelectorAll<HTMLElement>(selector);
    if (!targets) return;
    // Resolve cancelled styles so even rapid A -> B -> A switches restart cleanly.
    targets.forEach((element) => getComputedStyle(element).animationName);
    targets.forEach((element) => {
      reveal(
        element,
        element.contains(document.activeElement)
          ? "shown"
          : initialHome ? "visible" : "section",
      );
    });
    panel?.querySelectorAll<HTMLElement>("[data-reveal-rule]").forEach((rule) => {
      // The line has its own state so it never moves the text with it.
      getComputedStyle(rule, "::before").animationName;
      revealRule(rule);
    });
  }
  function onFocus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const element = event.target.closest<HTMLElement>("[data-reveal]");
    if (element) reveal(element);
    const rule = event.target.closest<HTMLElement>("[data-reveal-rule]");
    if (rule) revealRule(rule, false);
  }
  function observeUnseen() {
    if (!("IntersectionObserver" in window)) return;
    try {
      const nextObserver = new IntersectionObserver(
        (entries) => {
          if (observer !== nextObserver) return;
          for (const entry of entries) {
            const element = entry.target as HTMLElement;
            if (entry.isIntersecting && pending.has(element))
              reveal(element, "visible");
            if (entry.isIntersecting && pendingRules.has(element))
              revealRule(element);
          }
        },
        { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
      );
      observer = nextObserver;
      elements.forEach((element) => {
        if (seen.has(element)) return;
        if (element.contains(document.activeElement)) {
          reveal(element);
          return;
        }
        pending.add(element);
        element.dataset.revealState = "pending";
        nextObserver.observe(element);
      });
      rules.forEach((rule) => {
        if (seenRules.has(rule)) return;
        pendingRules.add(rule);
        rule.dataset.ruleState = "pending";
        nextObserver.observe(rule);
      });
    } catch {
      resetMode();
    }
  }
  function configureMode(initial = false) {
    resetMode();
    lastSection = current.value;
    if (preference.matches) {
      elements.forEach((element) => seen.add(element));
      rules.forEach((rule) => seenRules.add(rule));
    } else if (desktop.matches) {
      if (initial) enterSection(current.value, current.value === "home");
      else {
        document.getElementById(current.value)
          ?.querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((element) => seen.add(element));
        document.getElementById(current.value)
          ?.querySelectorAll<HTMLElement>("[data-reveal-rule]")
          .forEach((rule) => seenRules.add(rule));
      }
    } else observeUnseen();
  }
  function onModeChange() {
    configureMode();
  }

  watch(
    [ready, current],
    async () => {
      if (!ready.value) return;
      await nextTick();
      if (disposed) return;
      if (!initialized) {
        document.querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach((element) => elements.add(element));
        document.querySelectorAll<HTMLElement>("[data-reveal-rule]")
          .forEach((rule) => rules.add(rule));
        initialized = true;
        desktop.addEventListener("change", onModeChange);
        preference.addEventListener("change", onModeChange);
        document.addEventListener("focusin", onFocus);
        configureMode(true);
      } else if (current.value !== lastSection) {
        lastSection = current.value;
        if (desktop.matches && !preference.matches) enterSection(current.value);
      }
    },
    { immediate: true, flush: "post" },
  );

  onBeforeUnmount(() => {
    disposed = true;
    resetMode();
    desktop.removeEventListener("change", onModeChange);
    preference.removeEventListener("change", onModeChange);
    document.removeEventListener("focusin", onFocus);
  });
}

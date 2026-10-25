(() => {
  'use strict';
  const panels = [...document.querySelectorAll('.page-panel')];
  const links = [...document.querySelectorAll('.site-header nav a,.page-dots a')];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 'home';
  let queued = false;
  function updateCurrent() {
    queued = false;
    // Use the top of the reading area, including sections taller than one screen.
    const panel = panels.find(p => { const r = p.getBoundingClientRect(); return r.top <= innerHeight * .45 && r.bottom > innerHeight * .45; }) || panels[0];
    current = panel.id;
    links.forEach(link => {
      if (link.hash === '#' + current) link.setAttribute('aria-current', link.closest('.page-dots') ? 'true' : 'page');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateCurrent); } }, { passive: true });
  addEventListener('resize', updateCurrent);
  function restoreLocation() {
    const target = panels.find(panel => '#' + panel.id === location.hash) || panels[0];
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
    updateCurrent();
  }
  // Native snap and saved browser scroll offsets can disagree on history traversal.
  // The URL owns the position when a document is opened or a history item restored.
  history.scrollRestoration = 'manual';
  addEventListener('pageshow', restoreLocation);
  addEventListener('popstate', restoreLocation);
  if (location.hash) restoreLocation();
  updateCurrent();
  const toggle = document.querySelector('#color-toggle');
  function setColor(color, save) {
    document.documentElement.dataset.color = color;
    const dark = color === 'dark';
    toggle.setAttribute('aria-pressed', String(dark));
    toggle.setAttribute('aria-label', dark ? '切换到日间模式' : '切换到夜间模式');
    document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if (save) try { localStorage.setItem('personal-space-color', color); } catch {}
  }
  let color = 'light';
  try { color = localStorage.getItem('personal-space-color') === 'dark' ? 'dark' : 'light'; } catch {}
  setColor(color, false);
  toggle.addEventListener('click', () => setColor(document.documentElement.dataset.color === 'dark' ? 'light' : 'dark', true));
  document.addEventListener('keydown', event => {
    const node = event.target;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || document.querySelector('dialog[open]')) return;
    if (node instanceof HTMLElement && (node.matches('input,textarea,select') || node.isContentEditable)) return;
    const step = event.key === 'PageDown' ? 1 : event.key === 'PageUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = panels.findIndex(panel => panel.id === current);
    const next = panels[Math.max(0, Math.min(panels.length - 1, index + step))];
    next.scrollIntoView({ behavior: reduced() ? 'instant' : 'smooth', block: 'start' });
  });
})();

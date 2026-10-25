/* Shared preferences only. Each design owns its layout and navigation. */
(() => {
  'use strict';
  const root = document.documentElement;
  const buttons = [...document.querySelectorAll('[data-theme-toggle]')];
  let color = root.dataset.defaultColor === 'dark' ? 'dark' : 'light';
  try {
    const saved = localStorage.getItem('personal-space-color');
    if (saved === 'light' || saved === 'dark') color = saved;
  } catch {}
  function apply(next) {
    color = next;
    root.dataset.color = color;
    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(color === 'dark'));
      button.setAttribute('aria-label', color === 'dark' ? '切换到日间模式' : '切换到夜间模式');
      const label = button.querySelector('[data-theme-label]');
      if (label) label.textContent = color === 'dark' ? '日间模式' : '夜间模式';
      else if (!button.querySelector('svg')) button.textContent = color === 'dark' ? '日间模式' : '夜间模式';
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = color === 'dark' ? '#171917' : '#f6f4ec';
  }
  apply(color);
  buttons.forEach(button => button.addEventListener('click', () => {
    apply(color === 'dark' ? 'light' : 'dark');
    try { localStorage.setItem('personal-space-color', color); } catch {}
  }));
  window.addEventListener('storage', event => {
    if (event.key === 'personal-space-color' && (event.newValue === 'light' || event.newValue === 'dark')) apply(event.newValue);
  });
})();

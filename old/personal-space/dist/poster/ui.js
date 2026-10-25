'use strict';
(() => {
  const sections = [...document.querySelectorAll('.poster-section')];
  const links = [...document.querySelectorAll('.poster-nav a')];
  const signature = document.querySelector('#hello-title');
  const fitSignature = () => signature?.classList.toggle('is-long-name', [...signature.textContent.trim()].length > 10);
  if (signature) {
    fitSignature();
    new MutationObserver(fitSignature).observe(signature, { childList: true, characterData: true, subtree: true });
  }
  let current = 0;
  function mark(index) {
    current = index;
    links.forEach((link, i) => {
      if (i === index) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting && entry.intersectionRatio >= 0.55);
    if (visible.length) mark(sections.indexOf(visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target));
  }, { threshold: [0.55, 0.75] });
  sections.forEach(section => observer.observe(section));
  links.forEach((link, index) => link.addEventListener('click', () => mark(index)));
  function hashPosition() {
    const index = sections.findIndex(section => '#' + section.id === location.hash);
    if (index >= 0) mark(index);
  }
  hashPosition();
  window.addEventListener('hashchange', hashPosition);
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || document.querySelector('dialog[open]') || event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
    const delta = event.key === 'PageDown' ? 1 : event.key === 'PageUp' ? -1 : 0;
    if (!delta) return;
    const next = Math.max(0, Math.min(sections.length - 1, current + delta));
    if (next === current) return;
    event.preventDefault();
    location.hash = sections[next].id;
  });
})();

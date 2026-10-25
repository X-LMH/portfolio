'use strict';
(() => {
  function initReading() {
    const reader = document.querySelector('#entry-reader');
    const kind = document.querySelector('#entry-kind');
    const title = document.querySelector('#entry-title');
    const copy = document.querySelector('#entry-copy');
    if (!reader || !kind || !title || !copy) return;

    const entries = window.SiteContent.entries;

    document.querySelectorAll('[data-read]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = entries[button.dataset.read];
        if (!entry) return;
        kind.textContent = entry.kind;
        title.textContent = entry.title;
        copy.replaceChildren();
        entry.paragraphs.forEach(text => {
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          copy.append(paragraph);
        });
        if (!reader.open) reader.showModal();
        reader.scrollTop = 0;
      });
    });
    document.querySelectorAll('[data-close-entry]').forEach(button => {
      button.addEventListener('click', () => reader.close());
    });
    reader.addEventListener('click', event => {
      if (event.target !== reader) return;
      const rect = reader.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) reader.close();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initReading, { once: true });
  else initReading();
})();

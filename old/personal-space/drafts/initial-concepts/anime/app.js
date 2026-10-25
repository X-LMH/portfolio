(() => {
  const filters = Array.from(document.querySelectorAll('[data-journal-filter]'));
  const entries = Array.from(document.querySelectorAll('[data-category]'));
  const count = document.querySelector('.entry-count');

  filters.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.journalFilter;
      filters.forEach(filter => {
        const active = filter === button;
        filter.classList.toggle('is-active', active);
        filter.setAttribute('aria-pressed', String(active));
      });
      let visibleCount = 0;
      entries.forEach(entry => {
        const visible = selected === 'all' || entry.dataset.category === selected;
        entry.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      count.textContent = `${String(visibleCount).padStart(2, '0')} ENTRIES`;
    });
  });
})();

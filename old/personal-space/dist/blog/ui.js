'use strict';
(() => {
  const entries = window.SiteContent?.entries || {};
  document.querySelectorAll('[data-blog-preview]').forEach(preview => {
    const entry = entries[preview.dataset.blogPreview];
    if (!entry) return;
    preview.replaceChildren(...entry.paragraphs.slice(0, 2).map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph;
    }));
  });

  const navigation = [...document.querySelectorAll('.blog-navigation a')];
  const sections = [...document.querySelectorAll('.blog-post,.blog-short,.blog-hello')];
  function setCurrent(id) {
    navigation.forEach(link => {
      if (link.hash === '#' + id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let queued = false;
  function updateNavigation() {
    queued = false;
    let active = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top < window.innerHeight * .3) active = section;
    }
    if (active) setCurrent(active.classList.contains('blog-hello') ? 'hello' : active.classList.contains('blog-short') ? 'notes' : 'journal');
  }
  addEventListener('scroll', () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(updateNavigation);
  }, { passive: true });
  addEventListener('hashchange', updateNavigation);
  updateNavigation();
})();

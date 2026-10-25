/* Each frame is an addressable scene, without scroll or autoplay controls. */
(() => {
  'use strict';
  const scenes = [...document.querySelectorAll('[data-film-scene]')];
  const ids = scenes.map(scene => scene.id);
  if (!ids.length) return;
  const links = [...document.querySelectorAll('[data-scene-link]')];
  const previous = document.querySelector('[data-film-prev]');
  const next = document.querySelector('[data-film-next]');
  const number = document.querySelector('[data-scene-number]');
  const announcement = document.querySelector('[data-film-announcement]');
  const names = ['序幕', '散步', '阅读', '手记', '尾声'];
  let active = 0;

  function showFromHash(announce = false) {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { id = ''; }
    if (!ids.includes(id)) {
      id = ids[0];
      history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`);
    }
    const index = ids.indexOf(id);
    const outgoing = scenes[active];
    const focusWillHide = outgoing && outgoing !== scenes[index] && outgoing.contains(document.activeElement);
    active = index;
    scenes.forEach((scene, sceneIndex) => {
      const hidden = sceneIndex !== active;
      scene.hidden = hidden;
      scene.inert = hidden;
    });
    links.forEach(link => {
      if (link.dataset.sceneLink === id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.body.dataset.scene = id;
    number.textContent = String(active + 1).padStart(2, '0');
    previous.disabled = active === 0;
    next.disabled = active === ids.length - 1;
    document.title = `${names[active]} · 生活的几个片段`;
    if (announce) announcement.textContent = `第 ${active + 1} 幕，共 ${ids.length} 幕：${names[active]}`;
    if (focusWillHide) {
      const directoryLink = document.querySelector(`.film-directory [data-scene-link="${id}"]`);
      directoryLink?.focus({ preventScroll: true });
    }
  }

  function go(index) {
    if (index < 0 || index >= ids.length || index === active) return;
    location.hash = ids[index];
  }

  links.forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    go(ids.indexOf(link.dataset.sceneLink));
  }));
  document.querySelectorAll('[data-go-scene]').forEach(button => button.addEventListener('click', () => go(ids.indexOf(button.dataset.goScene))));
  document.querySelector('.skip-scene')?.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#scene-content')?.focus({ preventScroll: true });
  });
  previous.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  window.addEventListener('hashchange', () => showFromHash(true));
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (document.querySelector('dialog[open]') || (target instanceof HTMLElement && (target.matches('input,textarea,select') || target.isContentEditable))) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); go(active + 1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(active - 1); }
  });
  showFromHash();
})();

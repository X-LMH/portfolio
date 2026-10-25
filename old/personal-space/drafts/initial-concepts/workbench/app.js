'use strict';
(() => {
  const fileNames = { about: 'about.md', projects: 'projects.go', life: 'life.md', contact: 'contact.txt' };
  const fileLabels = { about: '认识一下', projects: '项目与实践', life: '屏幕之外', contact: '联系我' };
  const palette = document.querySelector('#command-palette');
  const search = document.querySelector('#command-search');
  const workspace = document.querySelector('.workspace');
  const scroll = document.querySelector('.editor-scroll');
  let activeFile = 'about';
  const projectData = {
    daily: { title: '轻舟 / 日常小清单', type: 'A SMALL TOOL · 示例作品', summary: '把容易忘的小事，交给一个简单的清单。', tags: ['Go', '日常工具'], steps: [['起点', '想把散落在备忘录里的待办，放到同一个地方。'], ['想试试', '先做好记录、完成和归档，让它成为自己愿意打开的小工具。']] },
    snippet: { title: 'Snippet / 代码片段库', type: 'A USEFUL COLLECTION · 示例作品', summary: '给常用的代码和命令，找一个顺手的位置。', tags: ['代码收藏', '小工具'], steps: [['起点', '某段命令明明用过，下次却又找不到了。'], ['想试试', '存下来，加一句说明，下次通过关键词把它找回来。']] },
    moments: { title: '此刻 / 阅读与记录', type: 'LITTLE NOTES · 示例作品', summary: '好句子和小念头，先记下来再说。', tags: ['阅读', '记录'], steps: [['起点', '为书里的一段话、散步时的一个想法，留一个简单的地方。'], ['想试试', '记录、整理、偶尔回看，不必每次都写成长文章。']] }
  };
  function selectFile(file, updateHash = true) {
    if (!Object.prototype.hasOwnProperty.call(fileNames, file)) return;
    activeFile = file;
    document.querySelectorAll('[role="tabpanel"].file-panel').forEach(panel => { panel.hidden = panel.id !== `panel-${file}`; });
    document.querySelectorAll('[data-tab]').forEach(tab => { const selected = tab.dataset.tab === file; tab.classList.toggle('is-active', selected); tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
    document.querySelectorAll('.file-tree [data-open-file]').forEach(button => { const selected = button.dataset.openFile === file; button.classList.toggle('is-active', selected); selected ? button.setAttribute('aria-current', 'page') : button.removeAttribute('aria-current'); });
    document.querySelector('#breadcrumb-file').textContent = fileNames[file];
    document.querySelector('#breadcrumb-label').textContent = fileLabels[file];
    document.querySelector('#file-format').textContent = file === 'projects' ? 'Go' : file === 'contact' ? 'Plain Text' : 'Markdown';
    scroll.scrollTop = 0;
    workspace.classList.remove('explorer-open');
    if (matchMedia('(max-width: 760px)').matches) document.querySelector('[data-toggle-explorer]').setAttribute('aria-expanded', 'false');
    if (palette.open) palette.close();
    if (updateHash) history.replaceState(null, '', `#${file}`);
    document.title = `${fileNames[file]} · 开发工作台`;
  }
  document.querySelectorAll('[data-open-file], [data-tab]').forEach(button => button.addEventListener('click', () => selectFile(button.dataset.openFile || button.dataset.tab)));
  const tabs = [...document.querySelectorAll('[data-tab]')];
  document.querySelector('.editor-tabs').addEventListener('keydown', event => {
    const index = tabs.findIndex(tab => tab.dataset.tab === activeFile);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectFile(tabs[next].dataset.tab); tabs[next].focus(); }
  });
  const toggleExplorer = document.querySelector('[data-toggle-explorer]');
  toggleExplorer.setAttribute('aria-expanded', String(matchMedia('(min-width: 761px)').matches));
  toggleExplorer.setAttribute('aria-controls', 'explorer');
  toggleExplorer.addEventListener('click', () => {
    if (matchMedia('(max-width: 760px)').matches) {
      const open = workspace.classList.toggle('explorer-open'); toggleExplorer.setAttribute('aria-expanded', String(open));
    } else {
      const collapsed = workspace.classList.toggle('explorer-collapsed');
      toggleExplorer.setAttribute('aria-expanded', String(!collapsed));
    }
  });
  matchMedia('(max-width: 760px)').addEventListener('change', event => { workspace.classList.remove('explorer-open', 'explorer-collapsed'); toggleExplorer.setAttribute('aria-expanded', String(!event.matches)); });
  document.querySelector('.main-editor').addEventListener('click', () => { if (workspace.classList.contains('explorer-open')) { workspace.classList.remove('explorer-open'); toggleExplorer.setAttribute('aria-expanded', 'false'); } });
  function renderProject(key) {
    const project = projectData[key];
    if (!project) return;
    document.querySelectorAll('[data-project]').forEach(button => { const selected = button.dataset.project === key; button.classList.toggle('is-active', selected); button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
    const detail = document.querySelector('#project-detail');
    detail.setAttribute('aria-labelledby', `project-tab-${key}`);
    detail.replaceChildren();
    const type = document.createElement('span'); type.className = 'detail-type'; type.textContent = project.type; detail.append(type);
    const heading = document.createElement('h3'); heading.textContent = project.title; detail.append(heading);
    const summary = document.createElement('p'); summary.className = 'detail-summary'; summary.textContent = project.summary; detail.append(summary);
    const tags = document.createElement('div'); tags.className = 'detail-tags'; project.tags.forEach(label => { const tag = document.createElement('span'); tag.textContent = label; tags.append(tag); }); detail.append(tags);
    const steps = document.createElement('div'); steps.className = 'detail-steps'; project.steps.forEach(([label, text]) => { const step = document.createElement('div'); step.className = 'detail-step'; const title = document.createElement('b'); title.textContent = label; const copy = document.createElement('p'); copy.textContent = text; step.append(title, copy); steps.append(step); }); detail.append(steps);
  }
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => renderProject(button.dataset.project)));
  document.querySelector('.project-list').addEventListener('keydown', event => {
    const choices = [...document.querySelectorAll('[data-project]')]; const index = choices.indexOf(document.activeElement); let next;
    if (event.key === 'ArrowRight') next = (index + 1) % choices.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + choices.length) % choices.length;
    if (next !== undefined) { event.preventDefault(); renderProject(choices[next].dataset.project); choices[next].focus(); }
  });
  function filterCommands() {
    const query = search.value.trim().toLowerCase(); let count = 0;
    palette.querySelectorAll('[data-open-file]').forEach(button => { const matched = button.textContent.toLowerCase().includes(query); button.hidden = !matched; if (matched) count++; });
    document.querySelector('.command-empty').hidden = count > 0;
  }
  function openPalette() { if (!palette.open) { palette.showModal(); search.value = ''; filterCommands(); search.focus(); } }
  document.querySelectorAll('[data-command-open]').forEach(button => button.addEventListener('click', openPalette));
  document.querySelector('[data-command-close]').addEventListener('click', () => palette.close());
  search.addEventListener('input', filterCommands);
  search.addEventListener('keydown', event => { if (event.key === 'Enter') { const first = palette.querySelector('[data-open-file]:not([hidden])'); if (first) { event.preventDefault(); selectFile(first.dataset.openFile); } } if (event.key === 'ArrowDown') { event.preventDefault(); palette.querySelector('[data-open-file]:not([hidden])')?.focus(); } });
  palette.addEventListener('click', event => { if (event.target === palette) { const rect = palette.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) palette.close(); } });
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette.open ? palette.close() : openPalette(); } if (event.key === 'Escape') { workspace.classList.remove('explorer-open'); if (matchMedia('(max-width: 760px)').matches) toggleExplorer.setAttribute('aria-expanded', 'false'); } });
  document.querySelector('[data-send-email]').addEventListener('click', () => { const value = document.querySelector('#panel-contact [data-profile="email"]').textContent.trim(); if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) location.href = `mailto:${encodeURIComponent(value)}`; else document.querySelector('[data-edit-profile]').click(); });
  window.addEventListener('hashchange', () => selectFile(location.hash.slice(1), false));
  renderProject('daily'); selectFile(Object.prototype.hasOwnProperty.call(fileNames, location.hash.slice(1)) ? location.hash.slice(1) : 'about', false);
})();

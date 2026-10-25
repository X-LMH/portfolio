'use strict';
(() => {
  const posts = [
    { id: 'another-way-home', title: '换一条路回家', category: 'life', date: '2026-10-18', dateLabel: '10 月 18 日', reading: '1 分钟', excerpt: '沿着平时不走的那条小路，多走了十分钟。发现一家旧书店，也看到一棵已经开始落叶的树。', tags: ['散步', '城市边角'], paragraphs: ['出门时本来打算走熟悉的路，到了路口又临时拐了弯。那条路稍微远一点，不过天还没黑，也没有什么着急回去的事。', '沿途有一家门面很小的旧书店。进去转了一圈，没有买书，只看了看架子上那些已经有些褪色的书脊。老板坐在门边，正在给花浇水。', '回家后才发现，比平时晚了十来分钟。好像也没耽误什么。下次有空，可以再换一条路。'] },
    { id: 'a-bookmark', title: '书签还夹在那一页', category: 'reading', date: '2026-10-12', dateLabel: '10 月 12 日', reading: '1 分钟', excerpt: '有本书读到一半放下了，再打开时，先往前翻了几页。慢一点也没关系，记住一两句话就很好。', tags: ['阅读', '随手记'], paragraphs: ['整理书桌的时候，翻到一本读了一半的书。书签还夹在原来的地方，但那几页讲了什么，已经有点想不起来了。', '于是往前翻了几页，找到当时画线的一句话。这次再读，注意到的又是另外一个地方。读书好像总会这样：同样的文字，隔一段时间再看，会和不同的日常碰到一起。', '没有给自己定读完的时间。书就放在桌角，哪天想起来，再读几页。'] },
    { id: 'a-little-readme', title: '给小工具补一句说明', category: 'tech', date: '2026-10-06', dateLabel: '10 月 6 日', reading: '1 分钟', excerpt: '隔了几周重新打开自己写的小脚本，居然也要想一会儿怎么用。于是给它补了一份很短的说明。', tags: ['开发手记', '小工具'], paragraphs: ['那个脚本的功能很简单：把一个目录里的文件按规则分好。写完的时候觉得没什么需要解释的，几周后再用，却忘了哪个参数是必须填的。', '后来补了三个例子：最普通的用法、只看预览的用法，还有遇到重名文件时会发生什么。没有写很长的文档，只把自己刚刚疑惑过的地方记下来。', '这件事让我觉得，使用说明不一定只是写给别人。有时候，未来的自己也需要一句提醒。'] },
    { id: 'a-simple-lunch', title: '周末只做了一顿饭', category: 'life', date: '2026-10-02', dateLabel: '10 月 2 日', reading: '1 分钟', excerpt: '冰箱里剩了两个番茄和一点面条。原本想出去吃，最后还是慢慢做了一顿简单的午饭。', tags: ['日常', '周末'], paragraphs: ['起得比平时晚，打开冰箱时已经快到中午。里面剩了两个番茄、一颗鸡蛋，还有一点面条。想了想，就用这些做了顿午饭。', '等水开的时候洗了几个碗，把窗户打开了一点。阳台上有人在晒被子，楼下能听到快递车经过的声音。', '吃完以后没有马上收桌子，坐着听完了一首歌。一个很普通的周末，也没做什么特别的事。'] }
  ];
  const categoryNames = { all: '全部记录', life: '日常', reading: '阅读', tech: '手记' };
  const state = { view: 'home', category: 'all', query: '' };
  const search = document.querySelector('#article-search');
  const reader = document.querySelector('#article-reader');
  const about = document.querySelector('#about-dialog');
  const make = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  function readPost(id) {
    const post = posts.find(item => item.id === id);
    if (!post) return;
    document.querySelector('#reader-meta').textContent = `${categoryNames[post.category]} / ${post.date.replaceAll('-', '.')} / 阅读约 ${post.reading}`;
    document.querySelector('#reader-title').textContent = post.title;
    const content = document.querySelector('#reader-content'); content.replaceChildren();
    post.paragraphs.forEach(text => content.append(make('p', '', text)));
    if (!reader.open) reader.showModal();
    reader.scrollTop = 0;
  }
  function selectCategory(category) { state.category = category; state.view = 'home'; state.query = ''; search.value = ''; render(); }
  function render() {
    const query = state.query.toLocaleLowerCase();
    const filtered = posts.filter(post => (state.category === 'all' || post.category === state.category) && (state.view !== 'essays' || post.category !== 'tech') && (!query || [post.title, post.excerpt, categoryNames[post.category], ...post.tags, ...post.paragraphs].join(' ').toLocaleLowerCase().includes(query)));
    const isArchive = state.view === 'archive';
    document.querySelectorAll('[data-view]').forEach(button => { if (button.dataset.view === state.view) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === state.category)));
    const title = query ? '搜索结果' : isArchive ? '文章归档' : state.view === 'essays' ? '日常与随笔' : state.category !== 'all' ? categoryNames[state.category] : '最近写下的';
    document.querySelector('#page-title').textContent = title;
    document.querySelector('#page-eyebrow').textContent = isArchive ? 'A SMALL ARCHIVE' : state.view === 'essays' ? 'EVERYDAY MOMENTS' : 'PERSONAL NOTES';
    document.querySelector('#result-count').textContent = `${filtered.length} 篇${query ? '匹配' : ''}记录`;
    document.querySelector('.search-clear').hidden = !query;
    document.querySelector('#feed-view').hidden = isArchive || !filtered.length;
    document.querySelector('#archive-view').hidden = !isArchive || !filtered.length;
    document.querySelector('#empty-state').hidden = filtered.length > 0;
    const feed = document.querySelector('#article-feed'); feed.replaceChildren();
    const archive = document.querySelector('#archive-list'); archive.replaceChildren();
    filtered.forEach(post => {
      const article = make('article', 'article-row');
      const top = make('div', 'article-topline');
      const category = make('button', 'article-category', categoryNames[post.category]); category.type = 'button'; category.addEventListener('click', () => selectCategory(post.category));
      const time = make('time', '', post.dateLabel); time.dateTime = post.date;
      top.append(category, make('span', 'meta-divider', '/'), time, make('span', 'meta-divider', '/'), make('span', '', `阅读约 ${post.reading}`));
      const heading = make('h2'); const titleButton = make('button', 'article-title', post.title); titleButton.type = 'button'; titleButton.addEventListener('click', () => readPost(post.id)); heading.append(titleButton);
      const excerpt = make('p', 'article-excerpt', post.excerpt);
      const bottom = make('div', 'article-bottom'); const tags = make('span', 'article-tags', post.tags.map(tag => `# ${tag}`).join('   ')); const read = make('button', '', '继续阅读'); read.type = 'button'; read.append(make('span', '', '→')); read.addEventListener('click', () => readPost(post.id)); bottom.append(tags, read);
      article.append(top, heading, excerpt, bottom); feed.append(article);
      const archiveButton = make('button', 'archive-row'); archiveButton.type = 'button'; const shortDate = make('time', '', post.date.slice(5).replace('-', '.')); shortDate.dateTime = post.date; archiveButton.append(shortDate, make('span', '', post.title), make('span', '', categoryNames[post.category])); archiveButton.addEventListener('click', () => readPost(post.id)); archive.append(archiveButton);
    });
    document.querySelector('#archive-count').textContent = `${filtered.length} 篇`;
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { state.view = button.dataset.view; state.category = 'all'; state.query = ''; search.value = ''; render(); }));
  document.querySelectorAll('.category-nav [data-category]').forEach(button => button.addEventListener('click', () => selectCategory(button.dataset.category)));
  document.querySelector('.search-form').addEventListener('submit', event => { event.preventDefault(); state.query = search.value.trim(); render(); });
  search.addEventListener('input', () => { state.query = search.value.trim(); render(); });
  document.querySelector('.search-clear').addEventListener('click', () => { search.value = ''; state.query = ''; render(); search.focus(); });
  document.querySelector('[data-reset]').addEventListener('click', () => { state.view = 'home'; state.category = 'all'; state.query = ''; search.value = ''; render(); });
  document.querySelectorAll('[data-close-reader]').forEach(button => button.addEventListener('click', () => reader.close()));
  document.querySelectorAll('[data-about]').forEach(button => button.addEventListener('click', () => about.showModal()));
  document.querySelector('[data-close-about]').addEventListener('click', () => about.close());
  about.querySelector('[data-contact]').addEventListener('click', () => about.close());
  [reader, about].forEach(dialog => dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }));
  render();
})();

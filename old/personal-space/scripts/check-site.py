"""Check local links, fragment targets, duplicate IDs and independent page shells."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import re

ROOT = Path(__file__).resolve().parents[1] / 'dist'
errors = []


class Page(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path, self.ids, self.refs, self.scripts = path, set(), [], []

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if 'id' in data:
            if data['id'] in self.ids:
                errors.append(f'Duplicate ID: {self.path}: {data["id"]}')
            self.ids.add(data['id'])
        for key in ('src', 'href'):
            if data.get(key):
                self.refs.append(data[key])
        if tag == 'script' and data.get('src'):
            self.scripts.append(data['src'])


pages = {}
for file in ROOT.rglob('*.html'):
    page = Page(file)
    page.feed(file.read_text(encoding='utf-8'))
    pages[file] = page

count = 0
for file, page in pages.items():
    for ref in page.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = ROOT / url.path.lstrip('/') if url.path.startswith('/') else file.parent / url.path
        if not url.path:
            target = file
        if target.is_dir():
            target = target / 'index.html'
        target = target.resolve()
        if not target.exists():
            errors.append(f'Missing target: {file.relative_to(ROOT)} -> {ref}')
        elif url.fragment and target in pages and unquote(url.fragment) not in pages[target].ids:
            errors.append(f'Missing fragment: {file.relative_to(ROOT)} -> {ref}')
        count += 1

for name in ('blog', 'poster', 'cinema', 'anime-minimal', 'ios-glass', 'japan-tech', 'anime-future', 'apple-minimal'):
    file = ROOT / name / 'index.html'
    if file not in pages:
        errors.append(f'Missing independent page: {name}')
        continue
    page = pages[file]
    for old in ('/base.css', '/landing.css', '/landing.js'):
        if old in page.refs:
            errors.append(f'Legacy shell in independent design: {name}: {old}')
    required_ids = {'entry-reader', 'entry-kind', 'entry-title', 'entry-copy'}
    if not required_ids <= page.ids:
        errors.append(f'Missing reader contract: {name}')
    if not all(script in page.scripts for script in ('/shared.js', '/content.js', '/reading.js', '/behavior.js')):
        errors.append(f'Missing shared behavior: {name}')

for file in ROOT.rglob('*.css'):
    for ref in re.findall(r'url\([\"\']?([^\)\"\']+)', file.read_text(encoding='utf-8')):
        if ref.startswith('/') and not (ROOT / ref.lstrip('/')).exists():
            errors.append(f'Missing CSS asset: {file.relative_to(ROOT)} -> {ref}')

for name in ('fusion-anime', 'fusion-future', 'fusion-glass', 'fusion-anime-glass', 'fusion-future-glass', 'fusion-anime-future'):
    page = pages.get(ROOT / name / 'index.html')
    if not page:
        errors.append(f'Missing fusion study: {name}')
        continue
    if not {'home', 'articles', 'moments', 'about', 'entry-reader', 'entry-title', 'entry-kind', 'entry-copy'} <= page.ids:
        errors.append(f'Missing fusion section or reader contract: {name}')
    if not all(script in page.scripts for script in ('/shared.js', '/content.js', '/reading.js', '/fusion/navigation.js')):
        errors.append(f'Missing fusion behavior: {name}')

print(f'Checked {len(pages)} pages and {count} local references; {len(errors)} errors')
for error in errors:
    print(error)
raise SystemExit(bool(errors))

"""Build the additive studies around the retained, approved home composition."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
start = (ROOT / 'templates/frame-start.html').read_text(encoding='utf-8')
end = (ROOT / 'templates/frame-end.html').read_text(encoding='utf-8')
for key, title in [
    ('anime', '日系二次元极简'), ('future', '二次元未来科技'), ('glass', 'iOS 玻璃拟态'),
    ('anime-glass', '日系 × 玻璃'), ('future-glass', '未来 × 玻璃'), ('anime-future', '日系 × 未来'),
]:
    head = start.replace('__SKIN__', f'/fusion-{key}/style.css')
    head = head.replace('/base.css', '/fusion/core.css').replace('/landing.js', '/fusion/navigation.js')
    head = head.replace('<title>林序的小站</title>', f'<title>林序的小站 · {title}融合版</title>')
    head = head.replace('<body>', f'<body class="fusion-{key}">')
    head = head.replace('示例内容 · <a', f'{title} · 融合版 · <a')
    body = (ROOT / f'templates/fusion-{key}.html').read_text(encoding='utf-8')
    target = ROOT / f'dist/fusion-{key}/index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(head + body + end, encoding='utf-8')
    print(f'Built fusion-{key}/index.html')

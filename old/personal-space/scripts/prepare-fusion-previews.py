"""Prepare current real captures for all six fusion studies."""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / 'qa/cross'
PREVIEWS = ROOT / 'dist/previews'
studies = [
    ('anime-glass', '日系 × 玻璃', '清浅的日系文字，碰到一点通透的光。', '横向主荐 × 轻量浮签 × 横向片刻'),
    ('future-glass', '未来 × 玻璃', '轻量科技感，也可以柔和一点。', '三列阅读台 × 切角磨砂 × 主次短记'),
    ('anime-future', '日系 × 未来', '让留白和细线，陪文字待一会儿。', '无卡片分栏 × 断续细线 × 错位自述'),
    ('anime', '日系二次元极简', '暖白、淡紫与轻轻错开的文字。', '居中首页 × 原生吸附 × 错落随笔'),
    ('future', '二次元未来科技', '轻量几何，为日常留一个开口。', '居中首页 × 原生吸附 × 几何框架'),
    ('glass', 'iOS 玻璃拟态', '在柔和的光里，收好生活片刻。', '居中首页 × 原生吸附 × 玻璃浮层'),
]
sections = []
for index, (key, title, subtitle, detail) in enumerate(studies, 1):
    for part in ('home', 'articles'):
        target = PREVIEWS / f'fusion-{key}-{part}.webp'
        with Image.open(QA / f'{key}-{part}-1366.png') as img:
            if img.size != (1366, 768):
                raise ValueError(f'Expected an actual 1366x768 viewport capture: {key}/{part}: {img.size}')
            img.convert('RGB').save(target, quality=90, method=6)
    recommended = '<span class="recommended">新增 · 从这一套开始看</span>' if key == 'anime-glass' else ''
    if index == 2 or index == 3:
        recommended = '<span class="recommended">新增交叉融合</span>'
    group = '<div class="comparison-label fusion-group"><span>上一轮三套融合版 · 原页面保留</span><span>继续对照</span></div>' if index == 4 else ''
    sections.append(group + f'''<section class="fresh-study" id="fusion-{key}"><div class="fresh-description"><span class="fresh-number">0{index} / FUSION STUDY</span>{recommended}<h2>{title}</h2><p>{subtitle}</p><small>{detail}</small><a class="fresh-enter" href="/fusion-{key}/">打开融合版 ↗</a></div><div class="fresh-previews"><a class="preview" href="/fusion-{key}/"><img src="/previews/fusion-{key}-home.webp" width="1366" height="768" alt="{title}融合版首页实际截图"><span>熟悉的首页 <b>从这里开始 ↗</b></span></a><a class="preview" href="/fusion-{key}/#articles"><img src="/previews/fusion-{key}-articles.webp" width="1366" height="768" alt="{title}融合版文章区实际截图" loading="lazy"><span>内容排版 <b>直接看文章区 ↗</b></span></a></div></section>''')

file = ROOT / 'dist/designs/index.html'
html = file.read_text(encoding='utf-8')
if '<!-- fusion-start -->' not in html:
    html = html.replace('<title>五种轻盈的日常 · 设计对比</title>', '<title>三种融合 · 设计对比</title>')
    html = html.replace('FIVE QUIET WAYS TO BE HERE', 'THREE WAYS TO COME BACK')
    beginning = html.index('<div class="intro">')
    old_start = html.index('<nav class="fresh-jump"')
    html = html[:beginning] + '<div class="intro"><span>熟悉的开场，新的阅读方式。</span><h1>把喜欢的部分，放在一起。</h1><p>保留居中首页和分块滚动。<br>三份融合版，各有自己的内容排版。</p></div>' + html[old_start:]
    old_start = html.index('<nav class="fresh-jump"')
    old_end = html.index('</main>')
    old = html[old_start:old_end]
    html = html[:old_start] + '<!-- fusion-start --><!-- fusion-end --><details class="history"><summary>此前的五套独立设计 <span>原页面继续保留 ＋</span></summary>' + old + '</details>' + html[old_end:]
    html = html.replace('新增五套无 AI 图片 · 旧图文为公共照片占位', '三份融合版无 AI 图片 · 原有页面全部保留')

start = html.index('<!-- fusion-start -->') + len('<!-- fusion-start -->')
end = html.index('<!-- fusion-end -->')
nav = '<nav class="fresh-jump" aria-label="选择融合版">' + ''.join(f'<a href="#fusion-{key}">0{i} {title}</a>' for i, (key, title, _, _) in enumerate(studies, 1)) + '</nav>'
label = '<div class="comparison-label"><span>新增三份交叉融合 · 六套一起比较</span><span>实际页面截图 · 1366 × 768</span></div>'
html = html[:start] + nav + label + ''.join(sections) + html[end:]
html = html.replace('<title>三种融合 · 设计对比</title>', '<title>六种融合 · 设计对比</title>')
html = html.replace('THREE WAYS TO COME BACK', 'SIX WAYS TO COME BACK')
html = html.replace('三份融合版，各有自己的内容排版。', '六套融合版，放在一起慢慢比较。')
html = html.replace('三份融合版无 AI 图片 · 原有页面全部保留', '新增三套交叉融合 · 原有页面全部保留')
file.write_text(html, encoding='utf-8')

# A derived contact sheet is for QA only; page previews above remain actual captures.
sheet = Image.new('RGB', (1366, 768 * 3), '#ffffff')
for row, (key, *_rest) in enumerate(studies[:3]):
    for col, part in enumerate(('home', 'articles')):
        img = Image.open(QA / f'{key}-{part}-1366.png').convert('RGB')
        sheet.paste(img.resize((683, 384)), (col * 683, row * 768))
        sheet.paste(ImageOps.grayscale(img).convert('RGB').resize((683, 384)), (col * 683, row * 768 + 384))
sheet.save(QA / 'comparison-color-gray.jpg', quality=92)

content_sheet = Image.new('RGB', (683 * 3, 384 * 2), '#ffffff')
for col, (key, *_rest) in enumerate(studies[:3]):
    for row, part in enumerate(('moments', 'about')):
        img = Image.open(QA / f'{key}-{part}-1366.png').convert('RGB')
        content_sheet.paste(ImageOps.grayscale(img).convert('RGB').resize((683, 384)), (col * 683, row * 384))
content_sheet.save(QA / 'content-gray.jpg', quality=92)
print('Prepared 12 real preview images; comparison has 6 studies')

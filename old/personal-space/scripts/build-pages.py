from pathlib import Path
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--fresh-only", action="store_true", help="Build the five new studies without regenerating retained designs")
parser.add_argument("--fusion-only", action="store_true", help="Build only the six fusion studies")
args = parser.parse_args()

if args.fusion_only:
    import runpy
    runpy.run_path(str(Path(__file__).with_name('build-fusion.py')))
    raise SystemExit(0)

ROOT = Path(__file__).resolve().parents[1]
start = (ROOT / 'templates/frame-start.html').read_text(encoding='utf-8')
end = (ROOT / 'templates/frame-end.html').read_text(encoding='utf-8')
pages = [('text', 'index.html', '/text.css', '文字目录'), ('photo', 'photo/index.html', '/photo/style.css', '图文随记'), ('anime', 'anime/index.html', '/anime/style.css', '轻二次元')]
if not args.fresh_only:
    for key, target, css, title in pages:
        body = (ROOT / f'templates/{key}.html').read_text(encoding='utf-8')
        head = start.replace('__SKIN__', css).replace('<title>林序的小站</title>', f'<title>林序的小站 · {title}</title>')
        output = ROOT / 'dist' / target
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(head + body + end, encoding='utf-8')
        print(f'Built {target}')

# New studies are complete documents, deliberately independent of the legacy frame.
for name in ('blog', 'poster', 'cinema', 'anime-minimal', 'ios-glass', 'japan-tech', 'anime-future', 'apple-minimal'):
    if args.fresh_only and name in ('blog', 'poster', 'cinema'):
        continue
    source = ROOT / f'templates/{name}.html'
    if not source.exists():
        raise FileNotFoundError(f'Missing independent design: {source}')
    target = ROOT / f'dist/{name}/index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(source.read_text(encoding='utf-8'), encoding='utf-8')
    print(f'Built {name}/index.html')

import runpy
runpy.run_path(str(Path(__file__).with_name('build-fusion.py')))

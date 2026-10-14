"""Resize deploy images to ~2.5-3x their largest on-screen size and re-encode PNG + WebP siblings.

Usage: python3 tools/optimize-images.py
Run after tools/prepare_images.py (which downloads/creates the originals). Aspect ratios are kept,
so the width/height attributes in the markup stay valid.
"""
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parent.parent / 'assets' / 'img'
CLIENT_LOGOS = ['ESA-1', 'BH-Labs-1', 'CW-Systems-1', 'Independent-Energy-1', 'Interview-Coach-1', 'Jayo-1',
                'modern-engineering-1', 'private-tax-solutions-1', 'S8T-1', 'broker-capital-1', 'crypto-consulting-1', 'guitierrez-1']
# name -> (max width, max height). Shown sizes: marquee logos 44px tall, partner badge 64px tall,
# integration logos 24-30px. The founder photo is already sized for its ~420px slot.
LIMITS = {**{n: (480, 132) for n in CLIENT_LOGOS}, 'HubSpot-Gold-Badge': (300, 200)}
LIMITS.update({p.stem: (128, 128) for p in root.glob('integration-logo-*.png')})

for stem, (mw, mh) in LIMITS.items():
    png = root / f'{stem}.png'
    if not png.exists():
        continue
    im = Image.open(png)
    if im.width <= mw and im.height <= mh:
        continue  # already within limits; re-encoding would only lose the original compression
    im = im.convert('RGBA') if im.mode in ('P', 'LA', 'RGBA') else im.convert('RGB')
    im.thumbnail((mw, mh), Image.LANCZOS)
    before = png.stat().st_size
    im.save(png, optimize=True)
    im.save(root / f'{stem}.webp', 'WEBP', quality=82, method=6)
    print(f'{stem}: {im.size} png {before // 1024}KB -> {png.stat().st_size // 1024}KB, webp {(root / f"{stem}.webp").stat().st_size // 1024}KB')

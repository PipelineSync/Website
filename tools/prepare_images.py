#!/usr/bin/env python3
"""Download the image manifest, write optimized originals, and create WebP siblings."""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urlparse
import io
import sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
manifest = ROOT / "tools/images-to-download.txt"
out = ROOT / "assets/img"
original = ROOT / "tools/images/original"
out.mkdir(parents=True, exist_ok=True)
original.mkdir(parents=True, exist_ok=True)

try:
    urls = [line.strip() for line in manifest.read_text().splitlines() if line.strip()]
except FileNotFoundError:
    print("Missing image manifest", file=sys.stderr)
    raise SystemExit(1)

for url in urls:
    name = Path(urlparse(url).path).name
    if not name:
        continue
    target = original / name
    try:
        req = Request(url, headers={"User-Agent": "PipelineSync image preparation"})
        with urlopen(req, timeout=30) as response:
            raw = response.read()
        image = Image.open(io.BytesIO(raw))
        image.load()
        # Keep the downloaded source for auditability, but normalize/optimize the deploy copy.
        image.save(target, format=image.format or "PNG", optimize=True)
        deploy = out / name
        fmt = image.format or ("JPEG" if image.mode == "RGB" else "PNG")
        if fmt == "JPEG" and image.mode not in ("RGB", "L"):
            image = image.convert("RGB")
        image.save(deploy, format=fmt, optimize=True, quality=88 if fmt == "JPEG" else None)
        webp = out / (Path(name).stem + ".webp")
        image.save(webp, format="WEBP", quality=88, method=6)
        print(f"prepared {name} ({image.width}x{image.height})")
    except Exception as exc:
        print(f"failed {url}: {exc}", file=sys.stderr)

print(f"processed {len(urls)} image URLs")

#!/usr/bin/env python3
"""Static-site integrity check for the PipelineSync website.

Walks every HTML page, extracts internal href/src references, and verifies
each one resolves to a file in this directory tree. Also verifies every
<loc> in sitemap.xml maps to a real page.

Usage: python3 tools/check_static.py
Exits non-zero (and prints failures) when anything is broken.
"""
from __future__ import annotations

import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ATTR_RE = re.compile(r'''(?:href|src)\s*=\s*["']([^"']+)["']''', re.IGNORECASE)


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in ("href", "src") and value:
                self.links.append(value)


def is_internal(url: str) -> bool:
    if not url or url.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
        return False
    if url.startswith("//"):
        return False
    if re.match(r"https?://", url, re.IGNORECASE):
        return False
    return url.startswith("/")


def resolve(url: str) -> Path | None:
    """Map an internal URL path to a file under ROOT, or None if missing."""
    path = url.split("?", 1)[0].split("#", 1)[0]
    if not path or path == "/":
        return ROOT / "index.html"
    rel = path.lstrip("/")
    candidates = [ROOT / rel]
    if not Path(rel).suffix:
        candidates.append(ROOT / rel / "index.html")
        candidates.append(ROOT / (rel + ".html"))
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def check_pages() -> list[str]:
    failures: list[str] = []
    pages = sorted(ROOT.rglob("*.html"))
    for page in pages:
        rel_page = page.relative_to(ROOT)
        parser = LinkCollector()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for link in parser.links:
            if is_internal(link) and resolve(link) is None:
                failures.append(f"{rel_page}: broken link -> {link}")
    return failures


def check_sitemap() -> list[str]:
    failures: list[str] = []
    sitemap = ROOT / "sitemap.xml"
    if not sitemap.is_file():
        return ["sitemap.xml is missing"]
    tree = ET.parse(sitemap)
    for loc in tree.getroot().iter():
        if loc.tag.endswith("loc") and loc.text:
            path = re.sub(r"^https?://[^/]+", "", loc.text.strip())
            if not path.startswith("/"):
                path = "/" + path
            if resolve(path) is None:
                failures.append(f"sitemap.xml: <loc> has no page -> {loc.text.strip()}")
    return failures


def main() -> int:
    failures = check_pages() + check_sitemap()
    page_count = len(list(ROOT.rglob("*.html")))
    if failures:
        print(f"FAILED: {len(failures)} broken reference(s) across {page_count} pages:")
        for failure in failures:
            print(f"  - {failure}")
        return 1
    print(f"OK: {page_count} pages, 0 broken internal references, sitemap valid.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

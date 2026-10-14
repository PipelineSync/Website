import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, '_site');
const failures = [];
const fail = (message) => failures.push(message);

if (!fs.existsSync(site)) {
  console.error('Missing _site. Run npm run build first.');
  process.exit(1);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = walk(site);
const htmlFiles = files.filter((file) => file.endsWith('.html') && path.basename(file) !== '404.html');
// Every page template under src/ except the sitemap and the 404 page becomes one production page.
const walkSrc = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.name.startsWith('_')) return [];
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walkSrc(full) : [full];
});
const expected = walkSrc(path.join(root, 'src')).filter((f) => f.endsWith('.njk') && !/sitemap\.xml\.njk$|404\.njk$/.test(f)).length;
const warnings = [];
const warn = (message) => warnings.push(message);
const seenTitles = new Map();
const seenDescriptions = new Map();
if (htmlFiles.length !== expected) fail(`Expected ${expected} production HTML pages, found ${htmlFiles.length}`);

const routeForFile = (file) => {
  const relative = path.relative(site, file).replaceAll(path.sep, '/');
  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) return `/${relative.slice(0, -'/index.html'.length)}/`;
  return `/${relative}`;
};
const fileForRoute = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  if (clean === '/') return path.join(site, 'index.html');
  if (clean.endsWith('/')) return path.join(site, clean.slice(1), 'index.html');
  return path.join(site, clean.slice(1));
};

const html = new Map();
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const route = routeForFile(file);
  html.set(file, { text, route });
  const canonical = text.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)/i)?.[1];
  const expectedCanonical = `https://pipelinesync.net${route}`;
  if (canonical !== expectedCanonical) fail(`${route}: canonical is ${canonical ?? 'missing'}, expected ${expectedCanonical}`);
  if (!/<title>[^<]+<\/title>/i.test(text)) fail(`${route}: missing title`);
  if (/<style\b/i.test(text)) fail(`${route}: inline <style> remains`);
  if (/http:\/\/www\.pipelinesync\.net|href=["'][^/][^"']*\.html/i.test(text)) fail(`${route}: legacy/internal absolute HTML link remains`);


  // ---- SEO quality gates ----
  const title = text.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';
  const description = text.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? '';
  if (/&amp;amp;|&amp;#/.test(text)) fail(`${route}: double-encoded HTML entity`);
  if (!description) fail(`${route}: missing meta description`);
  const titleText = title.replace(/&amp;/g, '&');
  const descText = description.replace(/&amp;/g, '&');
  if (titleText.length < 30 || titleText.length > 65) warn(`${route}: title is ${titleText.length} chars (aim for 30-60)`);
  if (descText.length < 120 || descText.length > 160) warn(`${route}: description is ${descText.length} chars (aim for 120-160)`);
  if (seenTitles.has(title)) fail(`${route}: duplicate title with ${seenTitles.get(title)}`); else seenTitles.set(title, route);
  if (seenDescriptions.has(description)) fail(`${route}: duplicate description with ${seenDescriptions.get(description)}`); else seenDescriptions.set(description, route);
  const h1s = text.match(/<h1\b/gi) || [];
  if (h1s.length !== 1) fail(`${route}: expected exactly one <h1>, found ${h1s.length}`);
  if (/<meta\s+name="robots"\s+content="[^"]*noindex/i.test(text)) fail(`${route}: indexable page is marked noindex`);
  const ogImage = text.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)?.[1];
  if (!ogImage) fail(`${route}: missing og:image`);
  else if (ogImage.startsWith('https://pipelinesync.net/') && !fs.existsSync(fileForRoute(ogImage.slice('https://pipelinesync.net'.length)))) fail(`${route}: og:image file missing ${ogImage}`);
  if (!/<meta\s+name="twitter:card"/i.test(text)) fail(`${route}: missing twitter:card`);
  for (const tag of text.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/.test(tag[0])) fail(`${route}: <img> without alt attribute ${tag[0].slice(0, 80)}`);
  }
  const ldBlocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (!ldBlocks.length) fail(`${route}: missing JSON-LD`);
  for (const block of ldBlocks) {
    let data;
    try { data = JSON.parse(block[1]); } catch (error) { fail(`${route}: JSON-LD does not parse (${error.message})`); continue; }
    if (data['@context'] !== 'https://schema.org') fail(`${route}: JSON-LD missing @context`);
    const nodes = data['@graph'] || [data];
    const types = nodes.flatMap((n) => [].concat(n['@type']));
    if (route !== '/' && !types.includes('BreadcrumbList')) fail(`${route}: missing BreadcrumbList`);
    for (const node of nodes) {
      const nodeTypes = [].concat(node['@type']);
      if (nodeTypes.some((t) => t === 'Article' || t === 'BlogPosting')) {
        for (const key of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image']) {
          if (!node[key]) fail(`${route}: ${nodeTypes.join('/')} missing ${key}`);
        }
      }
      if (nodeTypes.includes('FAQPage')) {
        for (const q of node.mainEntity || []) {
          if (!text.includes(q.name.replace(/&/g, '&amp;')) && !text.includes(q.name)) fail(`${route}: FAQ question not visible on page: ${q.name}`);
        }
      }
    }
  }
  for (const match of text.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = match[1];
    if (!target || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:') || target.startsWith('data:') || /^https?:\/\//i.test(target) || target.startsWith('//')) continue;
    if (!target.startsWith('/')) fail(`${route}: internal link is not root-relative: ${target}`);
    const targetPath = target.startsWith('/') ? target : `/${target}`;
    if (!fs.existsSync(fileForRoute(targetPath))) fail(`${route}: broken internal target ${target}`);
  }

  for (const match of text.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)) {
    const src = match[1];
    if (src.startsWith('/assets/')) {
      if (!fs.existsSync(fileForRoute(src))) fail(`${route}: missing image ${src}`);
      const tag = match[0];
      if (!/\bwidth=["']\d+/.test(tag) || !/\bheight=["']\d+/.test(tag)) fail(`${route}: image missing intrinsic dimensions ${src}`);
    }
  }
  for (const match of text.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',').map((item) => item.trim().split(/\s+/)[0])) {
      if (candidate.startsWith('/assets/') && !fs.existsSync(fileForRoute(candidate))) fail(`${route}: missing srcset asset ${candidate}`);
    }
  }
}

const sitemap = path.join(site, 'sitemap.xml');
if (!fs.existsSync(sitemap)) fail('Missing generated sitemap.xml');
else {
  const sitemapText = fs.readFileSync(sitemap, 'utf8');
  const sitemapUrls = [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  if (sitemapUrls.length !== expected) fail(`Expected ${expected} sitemap URLs, found ${sitemapUrls.length}`);
  for (const { route } of html.values()) {
    if (!sitemapUrls.includes(`https://pipelinesync.net${route}`)) fail(`Missing sitemap URL for ${route}`);
  }
  for (const lastmod of [...sitemapText.matchAll(/<lastmod>(.*?)<\/lastmod>/g)].map((m) => m[1])) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod) || Number.isNaN(Date.parse(lastmod))) fail(`Sitemap lastmod is not an ISO date: ${lastmod}`);
  }
}

for (const required of ['robots.txt', '_redirects', 'assets/css/site.css', 'assets/js/roi-calculator.js', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', 'assets/vendor/fa/icons.css']) {
  if (!fs.existsSync(path.join(site, required))) fail(`Missing published file ${required}`);
}

if (warnings.length) console.warn(warnings.map((item) => `⚠ ${item}`).join('\n'));
if (failures.length) {
  console.error(failures.map((item) => `✖ ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Site check passed: ${htmlFiles.length} pages, ${files.length} published files, canonical tags, internal links, images, SEO tags, JSON-LD, and sitemap validated (${warnings.length} warnings).`);

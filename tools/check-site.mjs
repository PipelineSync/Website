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
const expected = 18;
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
}

for (const required of ['robots.txt', '_redirects', 'assets/css/site.css', 'assets/js/roi-calculator.js']) {
  if (!fs.existsSync(path.join(site, required))) fail(`Missing published file ${required}`);
}

if (failures.length) {
  console.error(failures.map((item) => `✖ ${item}`).join('\n'));
  process.exit(1);
}
console.log(`Site check passed: ${htmlFiles.length} pages, ${files.length} published files, canonical tags, internal links, images, and sitemap validated.`);

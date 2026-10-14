// Renders a 1200×630 social share card for every built page into assets/img/og/.
// Usage: npm run build && npm run og-images
// Needs Playwright with Chromium available (e.g. `npm i -g playwright && npx playwright install chromium`).
// The generated PNGs are committed, so production builds never need a browser.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, '_site');
const outDir = path.join(root, 'assets/img/og');
const require = createRequire(import.meta.url);

function loadPlaywright() {
  for (const candidate of ['playwright', path.join(execSync('npm root -g').toString().trim(), 'playwright')]) {
    try { return require(candidate); } catch { /* try next */ }
  }
  console.error('Playwright not found. Install it globally: npm i -g playwright && npx playwright install chromium');
  process.exit(1);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const pages = walk(site).filter((f) => f.endsWith('.html')).map((file) => {
  const html = fs.readFileSync(file, 'utf8');
  const og = html.match(/property="og:image" content="([^"]+)"/)?.[1];
  if (!og || !og.includes('/assets/img/og/')) return null;
  const title = decode(html.match(/<title>([^<]*)<\/title>/)[1]).split(' | ')[0];
  const kind = html.match(/"articleSection":"([^"]+)"/)?.[1]
    || ({ '/': 'HubSpot Gold Solutions Partner', '/solutions/': 'Solutions', '/integrations/': 'Integrations', '/resources/': 'Resources', '/about/': 'About us' })[
      '/' + path.relative(site, path.dirname(file)).replace(/\\/g, '/') + (path.dirname(file) === site ? '' : '/')
    ] || (/[\\/]solutions[\\/]/.test(file) ? 'Solutions' : 'PipelineSync');
  return { title, kind, out: path.join(outDir, path.basename(og)) };
}).filter(Boolean);

const logo = 'data:image/png;base64,' + fs.readFileSync(path.join(root, 'assets/img/brand/pipelinesync-logo-512.png')).toString('base64');
const template = ({ title, kind }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@500;600;700&family=Geist+Mono:wght@500&display=block" rel="stylesheet">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:#05070c;color:#f1f4f9;font-family:Geist,Inter,system-ui,sans-serif;position:relative}
.orb{position:absolute;border-radius:50%;filter:blur(90px)}
.a{width:620px;height:620px;left:-180px;top:-260px;background:radial-gradient(circle,rgba(255,122,26,.6),transparent 65%)}
.b{width:700px;height:700px;right:-240px;bottom:-320px;background:radial-gradient(circle,rgba(91,140,255,.55),transparent 65%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(148,163,184,.07) 1px,transparent 1px),linear-gradient(to bottom,rgba(148,163,184,.07) 1px,transparent 1px);background-size:56px 56px;-webkit-mask-image:radial-gradient(ellipse 85% 75% at 30% 30%,#000 30%,transparent 80%)}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
.kind{display:inline-flex;align-items:center;gap:12px;width:fit-content;padding:9px 18px 9px 14px;border-radius:999px;border:1px solid rgba(148,163,184,.25);background:rgba(255,255,255,.04);font:500 20px/1 'Geist Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#aeb8c7}
.kind i{width:10px;height:10px;border-radius:50%;background:#ff7a1a;box-shadow:0 0 14px #ff7a1a}
h1{margin-top:40px;font-size:${title.length > 48 ? 64 : 76}px;line-height:1.04;letter-spacing:-.04em;font-weight:600;max-width:980px}
h1 span{background:linear-gradient(115deg,#ffc285 0%,#ff7a1a 38%,#7a9bff 78%,#5b8cff 100%);-webkit-background-clip:text;color:transparent}
.foot{margin-top:auto;display:flex;align-items:center;justify-content:space-between}
.brand{display:flex;align-items:center;gap:16px;font-size:30px;font-weight:600;letter-spacing:-.02em}
.brand img{width:56px;height:56px}
.url{font:500 22px/1 'Geist Mono',monospace;color:#8591a3}
.bar{position:absolute;left:0;right:0;bottom:0;height:6px;background:linear-gradient(90deg,#ffab5e,#ff7a1a 40%,#5b8cff)}
</style></head><body><div class="orb a"></div><div class="orb b"></div><div class="grid"></div>
<div class="wrap"><span class="kind"><i></i>${esc(kind)}</span>
<h1>${esc(title).replace(/(\S+)$/, '<span>$1</span>')}</h1>
<div class="foot"><div class="brand"><img src="${logo}" alt="">PipelineSync</div><div class="url">pipelinesync.net · HubSpot Gold Solutions Partner</div></div></div>
<div class="bar"></div></body></html>`;

const { chromium } = loadPlaywright();
const launch = { };
if (process.env.HTTPS_PROXY) launch.proxy = { server: process.env.HTTPS_PROXY };
const browser = await chromium.launch(launch);
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, ignoreHTTPSErrors: true });
fs.mkdirSync(outDir, { recursive: true });
for (const p of pages) {
  await page.setContent(template(p), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: p.out, type: 'png' });
  console.log('og', path.relative(root, p.out), '·', p.title);
}
await browser.close();

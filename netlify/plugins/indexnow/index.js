// After a successful production deploy, tell IndexNow (Bing, Yandex, Seznam, ...) which pages changed.
// Bing powers Copilot and much of ChatGPT search, so fresh pages reach AI answers sooner.
// Changed = sitemap <lastmod> within the last `days` days (lastmod comes from git history).
// Never fails the build: any problem is logged and skipped.
const fs = require('fs');
const path = require('path');

module.exports = {
  async onSuccess({ inputs, constants, utils }) {
    if (process.env.CONTEXT !== 'production') {
      console.log('IndexNow: skipped (not a production deploy).');
      return;
    }
    try {
      const xml = fs.readFileSync(path.join(constants.PUBLISH_DIR, 'sitemap.xml'), 'utf8');
      const cutoff = Date.now() - Number(inputs.days || 2) * 86400000;
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
        .filter(([, , lastmod]) => Date.parse(lastmod) >= cutoff)
        .map(([, loc]) => loc);
      for (const extra of ['https://pipelinesync.net/llms.txt']) if (urls.length && !urls.includes(extra)) urls.push(extra);
      if (!urls.length) {
        console.log('IndexNow: no recently changed URLs.');
        return;
      }
      const host = 'pipelinesync.net';
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ host, key: inputs.key, keyLocation: `https://${host}/${inputs.key}.txt`, urlList: urls })
      });
      const summary = `IndexNow: submitted ${urls.length} URL(s), HTTP ${res.status}`;
      console.log(summary + '\n' + urls.join('\n'));
      utils.status.show({ title: 'IndexNow', summary });
    } catch (error) {
      console.log(`IndexNow: skipped after error (${error.message}).`);
    }
  }
};

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/icon.png': 'icon.png' });
  eleventyConfig.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
  eleventyConfig.addPassthroughCopy({ 'src/_redirects': '_redirects' });
  eleventyConfig.addWatchTarget('assets/');

  // Cache-busting: append a short content hash so long-lived /assets/* caching stays safe.
  eleventyConfig.addFilter('v', (url) => {
    try {
      const data = fs.readFileSync(path.join(__dirname, url.replace(/^\//, '')));
      return `${url}?v=${crypto.createHash('md5').update(data).digest('hex').slice(0, 8)}`;
    } catch {
      return url;
    }
  });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      data: '_data',
      output: '_site'
    },
    templateFormats: ['njk'],
    markdownTemplateEngine: false,
    htmlTemplateEngine: 'njk'
  };
};

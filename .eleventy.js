const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const site = require('./src/_data/site.json');
const services = require('./src/_data/services.json');
const faq = require('./src/_data/faq.json');

const abs = (url) => (/^https?:\/\//.test(url) ? url : site.url + url);
const plainTitle = (title = '') => title.replace(/\s*\|\s*PipelineSync\s*$/, '').trim();

// Git dates per source file (first and last commit). Falls back to front-matter `lastmod` when
// history is unavailable (e.g. shallow CI clones only know one commit, which is still a real date).
const gitCache = new Map();
function gitDates(inputPath) {
  if (gitCache.has(inputPath)) return gitCache.get(inputPath);
  let dates = { first: null, last: null };
  try {
    const out = execFileSync('git', ['log', '--follow', '--format=%cI', '--', inputPath], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .trim().split('\n').filter(Boolean);
    if (out.length) dates = { first: out[out.length - 1], last: out[0] };
  } catch { /* not a git checkout */ }
  gitCache.set(inputPath, dates);
  return dates;
}
const isoDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : null);
function pageDates(data) {
  const git = gitDates(data.page.inputPath);
  // New, uncommitted pages fall back to the build date.
  const modified = data.dateModified || isoDate(git.last) || data.lastmod || isoDate(Date.now());
  const published = data.datePublished || isoDate(git.first) || modified;
  return { published, modified };
}

// Social share image: explicit `ogImage`, else the generated card for this URL.
function ogImageFor(data) {
  if (data.ogImage) return abs(data.ogImage);
  const slug = data.page.url === '/' ? 'home' : data.page.url.replace(/^\/|\/$/g, '').replace(/\//g, '--').replace(/\.html$/, '');
  return abs(`/assets/img/og/${slug}.png`);
}

const RESOURCE_TYPE = { guide: 'Article', article: 'BlogPosting', template: 'Article' };

function buildGraph(data) {
  const url = abs(data.page.url);
  const org = { '@id': `${site.url}/#organization` };
  const founderRef = { '@id': `${site.url}/#founder` };
  const graph = [];

  graph.push({
    '@type': ['Organization', 'ProfessionalService'],
    '@id': org['@id'],
    name: site.name,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', '@id': `${site.url}/#logo`, url: abs(site.logo), width: 512, height: 512 },
    image: { '@id': `${site.url}/#logo` },
    description: site.description,
    slogan: site.tagline,
    award: `HubSpot ${site.partnerTier} Solutions Partner`,
    // City-level only, as shown on the public HubSpot Solutions Directory listing.
    address: { '@type': 'PostalAddress', ...site.address },
    foundingDate: site.foundingDate,
    founder: founderRef,
    numberOfEmployees: { '@type': 'QuantitativeValue', value: site.employees },
    telephone: site.telephone,
    email: site.email,
    areaServed: site.areaServed.map((c) => ({ '@type': 'Country', name: c.name, identifier: c.code })),
    knowsAbout: site.knowsAbout,
    sameAs: [...site.sameAs, site.hubspotDirectoryUrl].filter(Boolean),
    contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: site.telephone, email: site.email, areaServed: site.areaServed.map((c) => c.code), availableLanguage: 'English' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'HubSpot services',
      itemListElement: services.map((s) => ({ '@type': 'Offer', itemOffered: { '@id': `${site.url}/solutions/#${s.id}` } }))
    }
  });
  graph.push({
    '@type': 'Person',
    '@id': founderRef['@id'],
    name: site.founder.name,
    jobTitle: site.founder.jobTitle,
    image: abs(site.founder.image),
    worksFor: org,
    url: `${site.url}/about/`,
    ...(site.founder.sameAs.length ? { sameAs: site.founder.sameAs } : {})
  });
  graph.push({ '@type': 'WebSite', '@id': `${site.url}/#website`, url: `${site.url}/`, name: site.name, description: site.tagline, publisher: org, inLanguage: 'en' });

  const type = data.pageType;
  const isResource = Boolean(RESOURCE_TYPE[type]);
  const pageTypes = { home: 'WebPage', about: 'AboutPage', collection: 'CollectionPage', services: 'WebPage', integrations: 'WebPage', page: 'WebPage' };
  const ogImage = ogImageFor(data);
  const { published, modified } = pageDates(data);
  const webPage = {
    '@type': isResource ? 'WebPage' : pageTypes[type] || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: data.title,
    description: data.description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: org,
    primaryImageOfPage: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
    inLanguage: 'en',
    dateModified: modified
  };
  if (data.page.url !== '/') webPage.breadcrumb = { '@id': `${url}#breadcrumb` };
  graph.push(webPage);

  if (data.page.url !== '/') {
    const crumbs = [{ name: 'Home', url: `${site.url}/` }];
    if (isResource) crumbs.push({ name: 'Resources', url: `${site.url}/resources/` });
    if (type === 'service') crumbs.push({ name: 'Solutions', url: `${site.url}/solutions/` });
    if (data.page.url.startsWith('/about/privacy-policy/')) crumbs.push({ name: 'About', url: `${site.url}/about/` });
    crumbs.push({ name: data.breadcrumbName || plainTitle(data.title), url });
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumb`,
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.url }))
    });
  }

  if (type === 'services' || type === 'home') {
    services.forEach((s) => graph.push({
      '@type': 'Service',
      '@id': `${site.url}/solutions/#${s.id}`,
      name: s.name,
      serviceType: s.serviceType,
      description: s.description,
      url: s.page ? abs(s.page) : `${site.url}/solutions/#${s.id}`,
      provider: org,
      areaServed: site.areaServed.map((c) => ({ '@type': 'Country', name: c.name }))
    }));
  }
  if (type === 'service') {
    const s = services.find((x) => x.id === data.serviceId);
    if (s) {
      graph.push({
        '@type': 'Service',
        '@id': `${site.url}/solutions/#${s.id}`,
        name: s.name,
        serviceType: s.serviceType,
        description: s.description,
        url,
        mainEntityOfPage: { '@id': `${url}#webpage` },
        provider: org,
        areaServed: site.areaServed.map((c) => ({ '@type': 'Country', name: c.name }))
      });
      webPage.about = { '@id': `${site.url}/solutions/#${s.id}` };
    }
    if (Array.isArray(data.faqs) && data.faqs.length) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        isPartOf: { '@id': `${url}#webpage` },
        mainEntity: data.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } }))
      });
    }
  }
  if (type === 'integrations') {
    graph.push({ '@type': 'Service', '@id': `${site.url}/solutions/#custom-integrations`, name: 'HubSpot integration services', serviceType: 'HubSpot integration development', description: data.description, url, provider: org, areaServed: site.areaServed.map((c) => ({ '@type': 'Country', name: c.name })) });
  }

  if (type === 'home' || type === 'collection') {
    const items = faq.filter((f) => type === 'collection' || !f.extendedOnly);
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      isPartOf: { '@id': `${url}#webpage` },
      mainEntity: items.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a + (type === 'collection' && f.extendedSuffix ? f.extendedSuffix : '') }
      }))
    });
  }

  if (type === 'collection' && data.collections && data.collections.resource) {
    const order = { guide: 0, article: 1, template: 2 };
    const list = [...data.collections.resource].sort((a, b) => order[a.data.pageType] - order[b.data.pageType] || a.url.localeCompare(b.url));
    graph.push({
      '@type': 'ItemList',
      '@id': `${url}#resource-list`,
      name: 'HubSpot guides, templates, and RevOps playbooks',
      itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: plainTitle(p.data.title), url: abs(p.url) }))
    });
  }

  if (isResource) {
    graph.push({
      '@type': RESOURCE_TYPE[type],
      '@id': `${url}#article`,
      headline: plainTitle(data.title),
      description: data.description,
      image: { '@type': 'ImageObject', url: ogImage, width: 1200, height: 630 },
      datePublished: published,
      dateModified: modified,
      // Byline stays organisational until the owner confirms individual authorship.
      author: org,
      publisher: org,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isPartOf: { '@id': `${site.url}/resources/#webpage` },
      inLanguage: 'en',
      ...(type === 'template' ? { learningResourceType: 'Template' } : {}),
      ...(type === 'guide' ? { articleSection: 'Guides' } : type === 'article' ? { articleSection: 'Articles' } : { articleSection: 'SOPs and Templates' })
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ assets: 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/icon.png': 'icon.png' });
  eleventyConfig.addPassthroughCopy({ 'src/static': '/' });
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

  eleventyConfig.addFilter('abs', abs);
  eleventyConfig.addFilter('plainTitle', plainTitle);

  // Nunjucks shortcodes get the full template data as `this.ctx`.
  eleventyConfig.addShortcode('jsonld', function () {
    if (this.ctx.pageType === 'none') return '';
    const json = JSON.stringify(buildGraph(this.ctx)).replace(/</g, '\\u003c');
    return `<script type="application/ld+json">${json}</script>`;
  });
  eleventyConfig.addShortcode('ogImage', function () { return ogImageFor(this.ctx); });
  eleventyConfig.addShortcode('pageDate', function (which) { return pageDates(this.ctx)[which]; });
  eleventyConfig.addFilter('sitemapDate', function (item) { return pageDates(item.data); });

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

module.exports.buildGraph = buildGraph;

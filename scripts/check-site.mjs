import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { readPages } from './site-files.mjs';

const origin = 'https://dimitrii.dev';
const pages = await readPages();
const byRoute = new Map(pages.map((page) => [page.route, page]));
const titles = new Set();
const descriptions = new Set();
const normalize = (path) => (path.endsWith('/') ? path : `${path}/`);
const published = pages.filter(
  (page) => !page.redirect && !page.$('meta[name="robots"]').attr('content')?.includes('noindex'),
);

for (const { $, route, redirect } of pages) {
  if (redirect) {
    assert(byRoute.has(normalize(new URL(redirect, origin).pathname)), `${route}: broken redirect`);
    continue;
  }
  assert.equal($('h1').length, 1, `${route}: needs exactly one h1`);
  assert.equal($('main').length, 1, `${route}: needs one main landmark`);
  assert.equal($('header.site-header h2').length, 0, `${route}: logo cannot be a heading`);
  assert.equal($('a.skip-link').attr('href'), '#main', `${route}: skip link missing`);
  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content');
  assert(title && !titles.has(title), `${route}: missing or duplicate title: ${title}`);
  assert(description && !descriptions.has(description), `${route}: missing or duplicate description`);
  titles.add(title);
  descriptions.add(description);
  assert.equal($('link[rel="canonical"]').attr('href'), `${origin}${route}`, `${route}: incorrect canonical`);
  assert.equal($('html').attr('lang'), route.startsWith('/it/') ? 'it' : 'en');
  for (const meta of ['og:title', 'og:description', 'og:image', 'og:url'])
    assert($(`meta[property="${meta}"]`).attr('content'), `${route}: ${meta} missing`);
  assert.equal($('meta[property="og:title"]').attr('content'), title);
  assert.equal($('meta[property="og:description"]').attr('content'), description);
  let lastHeading = 0;
  $('main h1, main h2, main h3, main h4, main h5, main h6').each((_, element) => {
    const level = Number(element.tagName.slice(1));
    assert(level <= lastHeading + 1, `${route}: heading skips from ${lastHeading} to ${level}`);
    lastHeading = level;
  });
  $('script[type="application/ld+json"]').each((_, element) => {
    const data = JSON.parse($(element).text());
    assert.equal(data['@context'], 'https://schema.org');
    assert(['Person', 'BlogPosting', 'CreativeWork'].includes(data['@type']));
    assert(!('worksFor' in data), `${route}: do not imply client employment`);
  });
  const talkPage = ['/', '/it/', '/lab/', '/it/lab/'].includes(route);
  if (talkPage) {
    assert.equal($('astro-island').length, 1, `${route}: exactly one talk island expected`);
    assert.equal($('astro-island').attr('client'), route.includes('/lab/') ? 'idle' : 'visible');
    assert($('astro-island').attr('component-url')?.includes('TalkGachaCard'), `${route}: unexpected island`);
  }
  if (!route.includes('/lab/dark-patterns/') && !talkPage)
    assert.equal(
      $('script:not([type="application/ld+json"])').length,
      0,
      `${route}: unnecessary application JavaScript`,
    );
  for (const element of $('a[href], link[href], img[src], script[src]').toArray()) {
    const href = $(element).attr('href') ?? $(element).attr('src');
    if (/^(mailto:|tel:)/.test(href)) continue;
    const target = new URL(href, `${origin}${route}`);
    if (target.origin !== origin) continue;
    const page = byRoute.get(normalize(target.pathname));
    if (page) {
      if (target.hash)
        assert(
          page.$(`[id="${decodeURIComponent(target.hash.slice(1))}"]`).length,
          `${route}: broken fragment ${href}`,
        );
    } else {
      await access(join('dist', decodeURIComponent(target.pathname))).catch(() =>
        assert.fail(`${route}: broken internal reference ${href}`),
      );
    }
  }
  $('img').each((_, element) => {
    assert($(element).attr('alt') !== undefined, `${route}: image alt missing`);
    assert(!/^(image|slide \d+|screenshot)$/i.test($(element).attr('alt')), `${route}: generic image alt`);
    assert(
      Number($(element).attr('width')) > 0 && Number($(element).attr('height')) > 0,
      `${route}: image dimensions missing`,
    );
    assert($(element).attr('srcset'), `${route}: responsive image sources missing`);
  });
  for (const element of $('a[target="_blank"]').toArray()) {
    const rel = $(element).attr('rel') ?? '';
    assert(rel.includes('noopener') && rel.includes('noreferrer'), `${route}: unsafe external link`);
  }
  for (const element of $('link[hreflang]').toArray()) {
    const target = $(element).attr('href');
    assert(target.startsWith(origin), `${route}: wrong alternate origin`);
    const alternate = byRoute.get(new URL(target).pathname);
    assert(alternate && !alternate.redirect, `${route}: missing translation ${target}`);
    assert(
      alternate.$(`link[hreflang="${$('html').attr('lang')}"]`).attr('href') === `${origin}${route}`,
      `${route}: nonreciprocal translation`,
    );
  }
  if (published.some((page) => page.route === route))
    assert.equal($('link[hreflang]').length, 3, `${route}: missing language alternates`);
}

for (const language of ['', '/it']) {
  for (const route of ['/', '/about/', '/skills/', '/work/', '/blog/', '/lab/', '/lab/dark-patterns/'])
    assert(byRoute.has(`${language}${route}`), `Missing ${language}${route}`);
  const home = byRoute.get(`${language}/`).$('main').text();
  assert(home.includes('Freelance Software Engineer') && home.includes('2026'));
  assert(home.includes('Dreamonkey s.r.l.') && home.includes('ErSistemi SPA'));
  const rss = await readFile(`dist${language}/rss.xml`, 'utf8');
  assert(rss.includes('<pubDate>') && rss.includes('<description>'));
  assert(!rss.includes('/blog/') || !rss.includes('.it/'));
}
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const { route } of published)
  assert(sitemap.includes(`${origin}${route}`), `${route}: missing from sitemap`);
for (const { route, redirect } of pages)
  if (redirect) assert(!sitemap.includes(`<loc>${origin}${route}</loc>`), `${route}: redirect in sitemap`);
assert((await readFile('dist/robots.txt', 'utf8')).includes(`${origin}/sitemap-index.xml`));
const csp = JSON.parse(await readFile('.astro/security-headers.json', 'utf8'))['Content-Security-Policy'];
assert(!csp.includes("'unsafe-inline'") && !csp.includes("'unsafe-eval'"));
console.log(
  `Checked ${published.length} indexable pages, ${pages.length - published.length} redirects/error pages, internal links, translations, metadata, headings, images, RSS, sitemap, and script budgets.`,
);

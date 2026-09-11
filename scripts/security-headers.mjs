import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { readPages } from './site-files.mjs';

const scripts = new Set();
const styles = new Set();
const styleAttributes = new Set();
const hash = (value) => `'sha256-${createHash('sha256').update(value).digest('base64')}'`;
const pages = await readPages();
for (const { $ } of pages) {
  $('script:not([src])').each((_, element) => scripts.add(hash($(element).html() ?? '')));
  $('style').each((_, element) => styles.add(hash($(element).html() ?? '')));
  $('[style]').each((_, element) => styleAttributes.add(hash($(element).attr('style'))));
}
const csp = [
  "default-src 'none'",
  `script-src 'self' ${[...scripts].sort().join(' ')}`,
  "script-src-attr 'none'",
  `style-src 'self' ${[...styles].sort().join(' ')}`,
  styleAttributes.size
    ? `style-src-attr 'unsafe-hashes' ${[...styleAttributes].sort().join(' ')}`
    : "style-src-attr 'none'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
  "form-action 'none'",
].join('; ');
const headers = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), browsing-topics=()',
  'Strict-Transport-Security': 'max-age=31536000',
};
await mkdir('.astro', { recursive: true });
await writeFile('.astro/security-headers.json', JSON.stringify(headers, null, 2));
await writeFile(
  '.astro/security-headers.conf',
  Object.entries(headers)
    .map(([key, value]) => `add_header ${key} "${value}" always;`)
    .join('\n') + '\n',
);
await writeFile(
  '.astro/redirects.json',
  JSON.stringify(
    Object.fromEntries(pages.filter((page) => page.redirect).map(({ route, redirect }) => [route, redirect])),
    null,
    2,
  ),
);
console.log(
  `Generated production security headers from ${pages.length} pages; no unsafe-inline or unsafe-eval.`,
);

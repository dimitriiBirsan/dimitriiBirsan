import { readdir, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { load } from 'cheerio';

export async function readPages(directory = 'dist') {
  const pages = [];
  async function walk(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      const file = join(folder, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (entry.name.endsWith('.html')) {
        const html = await readFile(file, 'utf8');
        const path = '/' + relative(directory, file).split(sep).join('/');
        const route = path.replace(/index\.html$/, '').replace(/\.html$/, '/');
        const $ = load(html);
        const refresh = $('meta[http-equiv="refresh"]').attr('content');
        const redirect = refresh?.match(/url=(.+)$/i)?.[1];
        pages.push({ file, html, route, $, redirect });
      }
    }
  }
  await walk(directory);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

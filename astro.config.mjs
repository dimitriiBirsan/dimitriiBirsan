import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import { readdirSync } from 'node:fs';

// Preserve old Italian article URLs while sharing slugs between translations.
const articleRedirects = Object.fromEntries(
  readdirSync('./src/content/blog')
    .filter((file) => file.endsWith('.it.mdx'))
    .map((file) => {
      const slug = file.replace('.it.mdx', '');
      return [`/it/blog/${slug}.it`, `/it/blog/${slug}/`];
    }),
);
const redirects = {
  ...articleRedirects,
  '/dark-patterns': '/lab/dark-patterns/',
  '/dark-patterns/overload': '/lab/dark-patterns/',
  '/it/dark-patterns': '/it/lab/dark-patterns/',
  '/it/dark-patterns/overload': '/it/lab/dark-patterns/',
  '/tags/architectural': '/tags/architecture/',
  '/tags/crossroads': '/tags/architecture/',
  '/it/tags/architettura': '/it/tags/architecture/',
  '/it/tags/scelte': '/it/tags/architecture/',
  '/it/tags/microservizi': '/it/tags/microservices/',
};
export default defineConfig({
  site: 'https://dimitrii.dev',
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-high-contrast' },
      defaultColor: false,
    },
  },
  redirects,
  integrations: [
    svelte(),
    mdx(),
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, '');
        return !pathname.endsWith('/404') && !(pathname in redirects);
      },
      i18n: { defaultLocale: 'en', locales: { en: 'en', it: 'it' } },
    }),
  ],
});

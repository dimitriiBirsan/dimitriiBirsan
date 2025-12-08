// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import websocketIntegration from './websocket-integration.mjs';

import db from '@astrojs/db';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: "server",
  integrations: [mdx(), sitemap(), db(), websocketIntegration()],

  adapter: node({
    mode: 'standalone',
  }),
});
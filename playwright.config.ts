import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4322', browserName: 'chromium', trace: 'retain-on-failure' },
  webServer: {
    command: 'node scripts/serve-preview.mjs',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
  },
});

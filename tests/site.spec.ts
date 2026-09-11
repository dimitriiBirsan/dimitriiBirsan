import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/about/',
  '/skills/',
  '/work/',
  '/blog/',
  '/blog/linkedin-extension-tracker/',
  '/blog/microservices/',
  '/blog/devfest-2025/',
  '/blog/codemotion-2025/',
  '/work/cloud-deployments/',
  '/work/react-microfrontends/',
  '/work/industrial-automation/',
  '/lab/',
  '/lab/dark-patterns/',
];

for (const language of ['', '/it']) {
  test(`${language || 'en'} navigation and translation links`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`${language}/`);
    await page.getByRole('navigation').first().getByRole('link').first().click();
    await expect(page).toHaveURL(`${language}/work/`);
    await page.locator('.work-list a').first().click();
    await expect(page.locator('article h1')).toBeVisible();
    await page.getByRole('link', { name: language ? 'English' : 'Italiano', exact: true }).click();
    await expect(page).toHaveURL(`${language ? '' : '/it'}/work/cloud-deployments/`);
  });
  test(`${language || 'en'} keyboard access and no-JS content`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 740 },
    });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4322${language}/`);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();
    await expect(page.locator('.talk-gacha noscript li')).toHaveCount(5);
    await expect(page.locator('.talk-gacha noscript')).toBeVisible();
    await page.locator('.hero .button').first().click();
    await expect(page).toHaveURL(`${language}/work/`);
    await context.close();
  });
  test(`${language || 'en'} Lab demonstrations work under production CSP`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (/Content Security Policy|Refused to/i.test(message.text())) errors.push(message.text());
    });
    await page.goto(`${language}/lab/dark-patterns/`);
    const draw = page.locator('.lottery-draw');
    for (let attempt = 1; attempt <= 3; attempt++) {
      await draw.click();
      await expect(page.locator('[data-balance]')).toHaveText(String(1500 - attempt * 500));
    }
    await expect(draw).toBeDisabled();
    await expect(page.locator('[data-prize="2"]')).not.toHaveAttribute('data-unlocked');
    await page.locator('.lottery-mode').click();
    await expect(page.locator('.lottery-mode')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-prize="2"]')).toHaveAttribute('data-unlocked');
    const downloadStarted = page.waitForEvent('download');
    await page.locator('.lottery-export').click();
    expect((await downloadStarted).suggestedFilename()).toBe('sample.csv');
    await page.locator('.lottery-reset').click();
    await expect(draw).toBeEnabled();
    await expect(page.locator('[data-balance]')).toHaveText('1500');
    for (const button of await page.locator('.demo-action').all()) {
      await button.click();
      const id = await button.getAttribute('aria-controls');
      await expect(page.locator(`#${id}`)).not.toBeEmpty();
    }
    expect(errors).toEqual([]);
  });
  for (const theme of ['light', 'dark'] as const) {
    test(`${language || 'en'} ${theme}: responsive pages and accessibility`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (/Content Security Policy|Refused to/i.test(message.text())) errors.push(message.text());
      });
      for (const route of routes) {
        await page.setViewportSize({ width: 320, height: 740 });
        const response = await page.goto(`${language}${route}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toHaveCount(1);
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
          `${language}${route}: overflow at 320px`,
        ).toBe(true);
        const audit = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(audit.violations, `${language}${route}: accessibility`).toEqual([]);
        await page.setViewportSize({ width: 1280, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
          true,
        );
      }
      expect(errors).toEqual([]);
    });
  }
}

test('old links redirect and missing routes return a useful 404', async ({ page }) => {
  await page.goto('/it/blog/microservices.it/');
  await expect(page).toHaveURL('/it/blog/microservices/');
  await page.goto('/dark-patterns/overload/');
  await expect(page).toHaveURL('/lab/dark-patterns/');
  const response = await page.goto('/missing-page/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await page.getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

for (const language of ['', '/it']) {
  test(`${language || 'en'} talk card: visible/idle hydration, keyboard drawer and responsive states`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (/Content Security Policy|Refused to|hydration_mismatch/i.test(message.text()))
        errors.push(message.text());
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const route of [`${language}/`, `${language}/lab/`]) {
      await page.goto(route);
      const card = page.locator('.talk-gacha');
      await card.scrollIntoViewIfNeeded();
      const toggle = card.getByRole('button');
      await expect(toggle).toBeEnabled();
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      const id = await toggle.getAttribute('aria-controls');
      const panel = page.locator(`[id="${id}"]`);
      await expect(panel).toHaveAttribute('aria-hidden', 'true');
      await toggle.focus();
      await page.keyboard.press('Enter');
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await expect(panel).toHaveAttribute('aria-hidden', 'false');
      await expect(panel.locator('li')).toHaveCount(5);
      for (const width of [320, 375, 768, 1024]) {
        await page.setViewportSize({ width, height: 900 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      }
      expect(
        (
          await new AxeBuilder({ page })
            .include('.talk-gacha')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
            .analyze()
        ).violations,
      ).toEqual([]);
      await expect(card.locator('[data-action="video"]')).toHaveAttribute(
        'href',
        'https://www.youtube.com/watch?v=ebdo-AsfJlk',
      );
      await expect(card.locator('[data-action="video"]')).toHaveAttribute('rel', 'noopener noreferrer');
      expect(await panel.evaluate((element) => getComputedStyle(element).transitionProperty)).toBe('none');
      await toggle.focus();
      await page.keyboard.press('Space');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
    }
    expect(errors).toEqual([]);
  });
}

test('content reflows at 200% text size', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  for (const route of routes.flatMap((route) => [route, `/it${route}`])) {
    await page.goto(route);
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('32px');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      `${route}: text zoom overflow`,
    ).toBe(true);
  }
});

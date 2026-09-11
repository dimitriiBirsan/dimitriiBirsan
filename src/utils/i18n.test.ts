import { describe, expect, it } from 'vitest';
import { getLocalizedPathname, getLanguageFromURL, getAlternateLinks } from './i18n';

describe('translation routing', () => {
  it.each([
    '/',
    '/about/',
    '/skills/',
    '/work/',
    '/blog/',
    '/lab/dark-patterns/',
    '/blog/microservices/',
    '/work/react-microfrontends/',
  ])('round-trips %s between languages', (path) => {
    const italian = getLocalizedPathname(path, 'it');
    expect(getLanguageFromURL(italian)).toBe('it');
    expect(getLocalizedPathname(italian, 'en')).toBe(path);
    expect(getLocalizedPathname(italian, 'it')).toBe(italian);
  });
  it('normalizes legacy Italian article slugs and preserves fragments', () => {
    expect(getLocalizedPathname('/it/blog/microservices.it/', 'en')).toBe('/blog/microservices/');
    expect(getLocalizedPathname('/lab/dark-patterns/#confirm-shaming', 'it')).toBe(
      '/it/lab/dark-patterns/#confirm-shaming',
    );
  });
  it('does not interpret a word beginning with it as a language prefix', () => {
    expect(getLanguageFromURL('/items/')).toBe('en');
    expect(getLocalizedPathname('/items/', 'it')).toBe('/it/items/');
  });
  it('uses the production origin and English default', () => {
    expect(getAlternateLinks('/it/about/')).toEqual([
      { hreflang: 'en', href: 'https://dimitrii.dev/about/' },
      { hreflang: 'it', href: 'https://dimitrii.dev/it/about/' },
      { hreflang: 'x-default', href: 'https://dimitrii.dev/about/' },
    ]);
  });
});

import { SITE_URL } from '../consts';
import type { SupportedLanguage } from '../types/i18n';

export function getLanguageFromURL(pathname: string): SupportedLanguage {
  return /^\/it(?:\/|$)/.test(pathname) ? 'it' : 'en';
}

export function getLocalizedPathname(pathname: string, language: SupportedLanguage): string {
  const [path, hash] = pathname.split('#');
  const base =
    path
      .replace(/^\/it(?=\/|$)/, '')
      .replace(/\.it\/?$/, '/')
      .replace(/\/+$/, '') || '';
  return `${language === 'it' ? '/it' : ''}${base}/${hash ? `#${hash}` : ''}`;
}

export function getAlternateLinks(pathname: string) {
  return (['en', 'it', 'x-default'] as const).map((hreflang) => ({
    hreflang,
    href: new URL(getLocalizedPathname(pathname, hreflang === 'it' ? 'it' : 'en'), SITE_URL).href,
  }));
}

export function formatDate(date: Date, language: SupportedLanguage, month: 'short' | 'long' = 'short') {
  return new Intl.DateTimeFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

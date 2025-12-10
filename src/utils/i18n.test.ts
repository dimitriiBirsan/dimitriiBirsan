import { describe, expect, it } from 'vitest';
import { getLocalizedPathname, getLanguageFromURL, getAlternateLinks } from './i18n';

describe('getLanguageFromURL', () => {
    it('returns "en" for paths without language prefix', () => {
        expect(getLanguageFromURL('/')).toBe('en');
        expect(getLanguageFromURL('/about')).toBe('en');
        expect(getLanguageFromURL('/blog')).toBe('en');
        expect(getLanguageFromURL('/blog/my-post')).toBe('en');
    });

    it('returns "it" for paths with /it prefix', () => {
        expect(getLanguageFromURL('/it')).toBe('it');
        expect(getLanguageFromURL('/it/')).toBe('it');
        expect(getLanguageFromURL('/it/about')).toBe('it');
        expect(getLanguageFromURL('/it/blog')).toBe('it');
        expect(getLanguageFromURL('/it/blog/my-post')).toBe('it');
    });
});

describe('getLocalizedPathname', () => {
    describe('homepage', () => {
        it('keeps "/" for English', () => {
            expect(getLocalizedPathname('/', 'en')).toBe('/');
        });

        it('converts "/" to "/it" for Italian', () => {
            expect(getLocalizedPathname('/', 'it')).toBe('/it');
        });

        it('converts "/it" back to "/" for English', () => {
            expect(getLocalizedPathname('/it', 'en')).toBe('/');
        });
    });

    describe('regular pages', () => {
        it('keeps English paths unchanged for English target', () => {
            expect(getLocalizedPathname('/about', 'en')).toBe('/about');
            expect(getLocalizedPathname('/blog', 'en')).toBe('/blog');
            expect(getLocalizedPathname('/skills', 'en')).toBe('/skills');
        });

        it('adds /it prefix for Italian target', () => {
            expect(getLocalizedPathname('/about', 'it')).toBe('/it/about');
            expect(getLocalizedPathname('/blog', 'it')).toBe('/it/blog');
            expect(getLocalizedPathname('/skills', 'it')).toBe('/it/skills');
        });

        it('removes /it prefix when switching to English', () => {
            expect(getLocalizedPathname('/it/about', 'en')).toBe('/about');
            expect(getLocalizedPathname('/it/blog', 'en')).toBe('/blog');
            expect(getLocalizedPathname('/it/skills', 'en')).toBe('/skills');
        });

        it('keeps /it prefix when already Italian', () => {
            expect(getLocalizedPathname('/it/about', 'it')).toBe('/it/about');
        });
    });

    describe('blog post paths', () => {
        it('converts English blog post to Italian', () => {
            expect(getLocalizedPathname('/blog/my-post', 'it')).toBe('/it/blog/my-post');
        });

        it('converts Italian blog post to English', () => {
            expect(getLocalizedPathname('/it/blog/my-post', 'en')).toBe('/blog/my-post');
        });

        it('handles nested blog paths', () => {
            expect(getLocalizedPathname('/blog/2024/my-post', 'it')).toBe('/it/blog/2024/my-post');
        });
    });

    describe('tags paths', () => {
        it('handles /tags paths correctly', () => {
            expect(getLocalizedPathname('/tags', 'it')).toBe('/it/tags');
            expect(getLocalizedPathname('/tags/javascript', 'it')).toBe('/it/tags/javascript');
            expect(getLocalizedPathname('/it/tags/javascript', 'en')).toBe('/tags/javascript');
        });
    });
});

describe('getAlternateLinks', () => {
    it('returns links for both languages', () => {
        const links = getAlternateLinks('/about');
        expect(links).toHaveLength(2);
        expect(links.find(l => l.hreflang === 'en-US')).toBeDefined();
        expect(links.find(l => l.hreflang === 'it-IT')).toBeDefined();
    });

    it('generates correct hrefs for English page', () => {
        const links = getAlternateLinks('/about');
        const enLink = links.find(l => l.hreflang === 'en-US');
        const itLink = links.find(l => l.hreflang === 'it-IT');

        expect(enLink?.href).toContain('/about');
        expect(itLink?.href).toContain('/it/about');
    });
});

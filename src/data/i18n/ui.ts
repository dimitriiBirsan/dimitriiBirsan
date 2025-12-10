import type { SupportedLanguage } from '../../types/i18n';

/**
 * Central UI translations for all static text.
 * Usage: t('key', lang) returns the translated string.
 */
export const ui = {
    en: {
        // Navigation
        'nav.home': 'HOME',
        'nav.about': 'ABOUT',
        'nav.blog': 'BLOG',
        'nav.skills': 'SKILLS',
        'nav.contact': 'CONTACT',

        // Footer
        'footer.tagline': 'Software Engineer & Developer',
        'footer.connect': 'Connect with me',
        'footer.copyright': '© {year} Dumitru Birsan. All rights reserved.',
        'footer.madeWith': 'Made with ♥ using Astro',

        // Home Page
        'home.greeting': "Hello, I'm",
        'home.title': 'Full Stack Developer',
        'home.tagline': 'Navigating the Full Stack ecosystem: From the depths of backend logic to the heights of DevFest stages, and every undefined variable in between.',
        'home.cta.learnMore': 'Learn More About Me →',
        'home.cta.blog': 'Read My Blog',
        'home.about.title': 'About Me',
        'home.about.readMore': 'Read My Story →',
        'home.skills.title': 'Technical Expertise',
        'home.skills.frontend': 'Frontend Development',
        'home.skills.backend': 'Backend & IoT',
        'home.skills.infrastructure': 'Infrastructure & DevOps',
        'home.skills.viewAll': 'View All Skills & Expertise →',
        'home.blog.title': 'Latest Articles',
        'home.blog.subtitle': 'Thoughts on technology, development, and industry',
        'home.blog.viewAll': 'View All Posts →',
        'home.contact.title': "Let's Build Something Together",
        'home.contact.description': "Interested in collaborating or just want to connect? I'm always open to discussing new projects and opportunities.",
        'home.contact.cta': 'Get In Touch',

        // About Page
        'about.title': 'About Me',
        'about.journey.title': 'My Journey',
        'about.journey.p1': 'My journey began in <highlight>Anenii Noi, Moldova</highlight>, moved through Romania, and took root in the industrial heartland of Italy. This migration path taught me a fundamental truth: any system—whether a new spoken language or a legacy codebase—can be mastered with patience and resilience.',
        'about.journey.p2': 'Today, I operate at the intersection of <highlight>Industrial IoT (IIoT)</highlight> and <highlight>Modern Web Architecture</highlight>. I don\'t just build websites; I engineer the digital nervous systems for industrial machinery, bridging the gap between high-level Cloud abstractions and the reality on the field automation.',
        'about.journey.p3': 'As a <highlight>Senior Developer at Change Wave SRL</highlight>, I focus on architecting robust Full Stack applications, building interactive user interfaces, and orchestrating event-driven microservices.',

        // Skills Page
        'skills.title': 'Skills & Expertise',
        'skills.subtitle': 'Technologies and tools I work with',

        // Blog
        'blog.title': 'Blog',
        'blog.subtitle': 'Articles on web development, technology, and more',
        'blog.readMore': 'Read more →',

        // Common
        'common.loading': 'Loading...',
        'common.error': 'Something went wrong',
    },
    it: {
        // Navigation
        'nav.home': 'HOME',
        'nav.about': 'CHI SONO',
        'nav.blog': 'BLOG',
        'nav.skills': 'SKILLS',
        'nav.contact': 'CONTATTI',

        // Footer
        'footer.tagline': 'Ingegnere Software & Sviluppatore',
        'footer.connect': 'Connettiti con me',
        'footer.copyright': '© {year} Dumitru Birsan. Tutti i diritti riservati.',
        'footer.madeWith': 'Fatto con ♥ usando Astro',

        // Home Page
        'home.greeting': 'Ciao, sono',
        'home.title': 'Sviluppatore Full Stack',
        'home.tagline': "Navigando l'ecosistema Full Stack: Dalle profondità della logica backend alle vette dei palchi DevFest, e ogni variabile undefined nel mezzo.",
        'home.cta.learnMore': 'Scopri di più su di me →',
        'home.cta.blog': 'Leggi il mio Blog',
        'home.about.title': 'Chi Sono',
        'home.about.readMore': 'Leggi la mia storia →',
        'home.skills.title': 'Competenze Tecniche',
        'home.skills.frontend': 'Sviluppo Frontend',
        'home.skills.backend': 'Backend & IoT',
        'home.skills.infrastructure': 'Infrastruttura & DevOps',
        'home.skills.viewAll': 'Vedi tutte le competenze →',
        'home.blog.title': 'Ultimi Articoli',
        'home.blog.subtitle': 'Riflessioni su tecnologia, sviluppo e industria',
        'home.blog.viewAll': 'Vedi tutti i post →',
        'home.contact.title': 'Costruiamo qualcosa insieme',
        'home.contact.description': 'Interessato a collaborare o semplicemente a connetterti? Sono sempre aperto a discutere nuovi progetti e opportunità.',
        'home.contact.cta': 'Contattami',

        // About Page
        'about.title': 'Chi Sono',
        'about.journey.title': 'Il mio percorso',
        'about.journey.p1': 'Il mio viaggio è iniziato ad <highlight>Anenii Noi, Moldavia</highlight>, è passato per la Romania e si è radicato nel cuore industriale dell\'Italia. Questo percorso migratorio mi ha insegnato una verità fondamentale: qualsiasi sistema—che sia una nuova lingua parlata o un codice legacy—può essere padroneggiato con pazienza e resilienza.',
        'about.journey.p2': 'Oggi opero all\'intersezione tra <highlight>IoT Industriale (IIoT)</highlight> e <highlight>Architettura Web Moderna</highlight>. Non costruisco solo siti web; progetto i sistemi nervosi digitali per macchinari industriali, colmando il divario tra le astrazioni Cloud di alto livello e la realtà dell\'automazione sul campo.',
        'about.journey.p3': 'Come <highlight>Senior Developer presso Change Wave SRL</highlight>, mi concentro sulla progettazione di robuste applicazioni Full Stack, sulla costruzione di interfacce utente interattive e sull\'orchestrazione di microservizi event-driven.',

        // Skills Page
        'skills.title': 'Competenze & Expertise',
        'skills.subtitle': 'Tecnologie e strumenti con cui lavoro',

        // Blog
        'blog.title': 'Blog',
        'blog.subtitle': 'Articoli su sviluppo web, tecnologia e altro',
        'blog.readMore': 'Leggi di più →',

        // Common
        'common.loading': 'Caricamento...',
        'common.error': 'Qualcosa è andato storto',
    },
} as const;

export type UIKey = keyof typeof ui.en;

/**
 * Get a translated string for the given key and language.
 * Supports placeholder replacement, e.g., t('footer.copyright', 'en', { year: 2024 })
 */
export function t(
    key: UIKey,
    lang: SupportedLanguage,
    params?: Record<string, string | number>
): string {
    let text: string = ui[lang][key] ?? ui.en[key] ?? key;

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            text = text.replace(`{${k}}`, String(v));
        });
    }

    return text;
}

/**
 * Create a translation function bound to a specific language.
 * Usage: const t = useTranslations('it'); t('nav.home')
 */
export function useTranslations(lang: SupportedLanguage) {
    return (key: UIKey, params?: Record<string, string | number>) => t(key, lang, params);
}

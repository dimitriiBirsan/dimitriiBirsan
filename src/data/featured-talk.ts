import type { TalkGachaCardProps } from '../components/TalkGachaCard.svelte';
import type { SupportedLanguage } from '../types/i18n';
import { getLocalizedPathname } from '../utils/i18n';

// Verified against the linked recording. This is its publication date, not an inferred event date.
// Add a slides action only when its actual URL is available.
export function featuredTalk(language: SupportedLanguage): TalkGachaCardProps {
  const it = language === 'it';
  return {
    title: 'Dark Patterns',
    subtitle: 'Defense Against the Dark Arts',
    event: 'Full Stack Events · YouTube',
    date: it ? 'Pubblicato il 18 maggio 2026' : 'Published 18 May 2026',
    dateTime: '2026-05-18',
    rarity: 5,
    rarityLabel: 'SSR',
    rarityDescription: it ? 'Rarità della vetrina: cinque stelle' : 'Showcase rarity: five stars',
    featuredLabel: it ? 'Talk in evidenza' : 'Featured talk',
    element: 'UX Ethics',
    description: it
      ? 'Abbonamenti da cui non riesci a uscire. Urgenza che non esiste. Scelte fatte al posto tuo. Un viaggio nei dark pattern, dalla loro tassonomia ai casi reali.'
      : 'Subscriptions you can’t escape. Urgency that isn’t real. Choices made on your behalf. A look at dark patterns, from their taxonomy to real examples.',
    stats: [
      { label: it ? 'Classe' : 'Class', value: 'Tech Talk' },
      { label: it ? 'Durata' : 'Duration', value: '47 min' },
      { label: it ? 'Lingua' : 'Language', value: it ? 'Italiano' : 'Italian' },
    ],
    affixesLabel: it ? 'Modificatori · cosa porti a casa' : 'Affixes · what you take away',
    affixes: it
      ? [
          { text: '+1 occhio allenato per il design ingannevole', tier: 'T1' },
          { text: 'Rivela i costi nascosti prima del checkout', tier: 'T1' },
          { text: 'Resistenza aumentata all’urgenza artificiale', tier: 'T2' },
          { text: 'Riconosce le trappole nei flussi di cancellazione', tier: 'T2' },
          { text: 'Il confirmshaming perde il suo incantesimo', tier: 'Leggendario' },
        ]
      : [
          { text: '+1 trained eye for deceptive design', tier: 'T1' },
          { text: 'Reveals hidden costs before checkout', tier: 'T1' },
          { text: 'Increased resistance to artificial urgency', tier: 'T2' },
          { text: 'Detects traps in cancellation flows', tier: 'T2' },
          { text: 'Confirmshaming loses its charm', tier: 'Legendary' },
        ],
    inspectLabel: it ? 'Ispeziona i modificatori' : 'Inspect affixes',
    closeLabel: it ? 'Chiudi i modificatori' : 'Close affixes',
    actions: [
      {
        type: 'video',
        eyebrow: it ? 'Registrazione' : 'Recording',
        label: it ? 'Guarda il talk' : 'Watch recording',
        href: 'https://www.youtube.com/watch?v=ebdo-AsfJlk',
        newTab: true,
      },
      {
        type: 'lab',
        eyebrow: it ? 'Prova sul campo' : 'Field test',
        label: it ? 'Entra nel Lab' : 'Enter the Lab',
        href: getLocalizedPathname('/lab/dark-patterns', language),
      },
    ],
    note: it
      ? 'I modificatori sono un riassunto giocoso dei temi del talk.'
      : 'Affixes are playful summaries of the talk’s themes.',
  };
}

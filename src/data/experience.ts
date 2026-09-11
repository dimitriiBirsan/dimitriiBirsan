import type { LocalizedContent, SupportedLanguage } from '../types/i18n';

export interface ClientEngagement {
  name: string;
  focus: string;
  role: string;
  summary: LocalizedContent;
  responsibilities: LocalizedContent<string[]>;
  technologies: string[];
}

// Client labels describe the work; they are not contractual job titles.
export const currentExperience = {
  start: '2026-03',
  end: null,
  title: 'Freelance Software Engineer',
  clients: [
    {
      name: 'Dreamonkey s.r.l.',
      focus: 'Cloud & DevOps',
      role: 'Cloud & DevOps Consultant',
      summary: {
        en: 'I look after Azure and Hetzner deployments, maintain CI/CD pipelines, and work through Azure costs and security configuration.',
        it: 'Seguo i deployment su Azure e Hetzner, mantengo le pipeline CI/CD e mi occupo di costi e configurazioni di sicurezza Azure.',
      },
      responsibilities: {
        en: [
          'Manage Azure infrastructure and deployments, alongside deployments to Hetzner.',
          'Create and maintain CI/CD pipelines and improve deployment reliability and repeatability.',
          'Work on Azure cost optimization, security configuration, and day-to-day operational practices.',
        ],
        it: [
          'Gestisco infrastruttura e deployment su Azure, oltre ai deployment su Hetzner.',
          'Creo e mantengo pipeline CI/CD e lavoro per rendere i deployment più affidabili e ripetibili.',
          'Mi occupo di ottimizzazione dei costi Azure, configurazioni di sicurezza e pratiche operative.',
        ],
      },
      technologies: ['Azure', 'Hetzner', 'CI/CD'],
    },
    {
      name: 'ErSistemi SPA',
      focus: 'Frontend & DevOps',
      role: 'Frontend & DevOps Consultant',
      summary: {
        en: 'I build functionality in a React microfrontend project, write Cypress E2E tests, and contribute to DevOps and CI/CD pipelines.',
        it: 'Sviluppo funzionalità in un progetto a microfrontend React, scrivo test E2E con Cypress e contribuisco ai processi DevOps e alle pipeline CI/CD.',
      },
      responsibilities: {
        en: [
          'Develop and maintain frontend functionality within a React microfrontend architecture.',
          'Create Cypress end-to-end tests and expand automated coverage of user workflows.',
          'Contribute to DevOps processes and create and maintain CI/CD pipelines for frontend delivery and testing.',
        ],
        it: [
          'Sviluppo e mantengo funzionalità frontend in un’architettura a microfrontend basata su React.',
          'Creo test end-to-end con Cypress ed estendo la copertura automatizzata dei flussi utente.',
          'Contribuisco ai processi DevOps e creo e mantengo pipeline CI/CD per il rilascio e il testing del frontend.',
        ],
      },
      technologies: ['React', 'Microfrontends', 'Cypress', 'CI/CD'],
    },
  ] satisfies ClientEngagement[],
};

export const previousExperience = [
  {
    start: '2023-07',
    end: '2025-12',
    title: 'Senior Full Stack Developer',
    company: 'Change Wave s.r.l.',
    description: {
      en: 'Industrial IoT solutions and web applications, connecting industrial equipment, backend services, cloud systems, and React interfaces.',
      it: 'Soluzioni Industrial IoT e applicazioni web che collegano macchinari industriali, servizi backend, sistemi cloud e interfacce React.',
    },
  },
  {
    start: '2020-10',
    end: '2023-05',
    title: 'Web Engineer',
    company: 'Industria Tecnologica Italiana SRL',
    description: {
      en: 'Software engineering for industrial applications, including web interfaces and systems integration.',
      it: 'Sviluppo software per applicazioni industriali, con interfacce web e integrazione di sistemi.',
    },
  },
];

export const education = {
  start: '2019-12',
  end: '2021-02',
  institution: 'CIS — Scuola per la Gestione d’Impresa',
  qualification: {
    en: 'Analyst Programmer — professional qualification, EQF level 6',
    it: 'Analista programmatore — qualifica professionale, livello EQF 6',
  },
};

export function careerDate(value: string, language: SupportedLanguage) {
  const text = new Intl.DateTimeFormat(language === 'it' ? 'it-IT' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}-01T00:00:00Z`));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function currentPeriod(language: SupportedLanguage) {
  return `${careerDate(currentExperience.start, language)} — ${language === 'it' ? 'Presente' : 'Present'}`;
}

export type SupportedLanguage = 'en' | 'it';
export type LocalizedContent<T = string> = Record<SupportedLanguage, T>;

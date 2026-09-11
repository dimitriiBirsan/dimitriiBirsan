import { getCollection, type CollectionEntry } from 'astro:content';
import type { SupportedLanguage } from '../types/i18n';
import { getLocalizedPathname } from './i18n';

export async function getPosts(language: SupportedLanguage) {
  return (await getCollection('blog', ({ data }) => !data.draft && data.lang === language)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
export async function getProjects(language: SupportedLanguage) {
  return (await getCollection('projects', ({ data }) => !data.draft && data.lang === language)).sort(
    (a, b) => a.data.order - b.data.order,
  );
}
export const postHref = (post: CollectionEntry<'blog'>) =>
  getLocalizedPathname(`/blog/${post.data.translationKey}`, post.data.lang);
export const projectHref = (project: CollectionEntry<'projects'>) =>
  getLocalizedPathname(`/work/${project.data.translationKey}`, project.data.lang);
export const tagSlug = (tag: string) => tag.toLowerCase().replace(/\s+/g, '-');

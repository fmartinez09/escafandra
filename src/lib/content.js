import { error } from '@sveltejs/kit';
import { createEntries, SECTIONS } from './content-metadata.js';

const modules = import.meta.glob(
  ['/src/notes/*.md', '/src/research/*.md', '/src/projects/*.md'],
  { eager: true },
);
const entries = createEntries(Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [path, module.metadata]),
));

export function getEntries(section) {
  return section ? entries.filter(entry => entry.section === section) : entries;
}

export function getSection(section) {
  return { section: SECTIONS.find(item => item.id === section), posts: getEntries(section) };
}

export async function getArticle(section, slug) {
  const entry = getEntries(section).find(item => item.slug === slug);
  if (!entry) error(404, 'Article not found');
  const article = modules[entry.path];
  return {
    content: article.default,
    meta: { ...article.metadata, summary: entry.summary, tags: entry.tags },
  };
}

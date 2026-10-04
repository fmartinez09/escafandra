import { getArticle, getEntries } from '$lib/content.js';

export const prerender = 'auto';

export function entries() {
  return getEntries('notes').map(({ slug }) => ({ slug }));
}

export function load({ params }) {
  return getArticle('notes', params.slug);
}

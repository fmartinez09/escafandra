import { getArticle, getEntries } from '$lib/content.js';

// Empty sections are valid; published entries are still prerendered.
export const prerender = 'auto';

export function entries() {
  return getEntries('research').map(({ slug }) => ({ slug }));
}

export function load({ params }) {
  return getArticle('research', params.slug);
}

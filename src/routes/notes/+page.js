import { getSection } from '$lib/content.js';

// Render query-string tag filters on direct visits as well as client navigation.
export const prerender = false;

export function load() {
  return getSection('notes');
}

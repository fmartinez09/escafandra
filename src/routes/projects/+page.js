import { getSection } from '$lib/content.js';

export const prerender = false;

export function load() {
  return getSection('projects');
}

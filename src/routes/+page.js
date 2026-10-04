import { getEntries } from '$lib/content.js';

export function load() {
  return {
    posts: getEntries().slice(0, 3),
  };
}

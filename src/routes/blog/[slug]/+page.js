import { redirect } from '@sveltejs/kit';

export const prerender = false;

export function load({ params, url }) {
  redirect(308, `/notes/${encodeURIComponent(params.slug)}${url.search}`);
}

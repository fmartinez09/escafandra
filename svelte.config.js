import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [
    mdsvex({
      extensions: ['.md', '.svx'],
      highlight: { alias: {} }
    })
  ],
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: { handleHttpError: 'warn' }
  }
};

export default config;

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: [
        // Allow the parent repo's node_modules (worktree shares dependencies)
        path.resolve('../../..'),
      ]
    }
  }
});

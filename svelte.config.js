import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

function extractText(node) {
  if (node.type === 'text') return node.value;
  if (node.children) return node.children.map(extractText).join('');
  return '';
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Adds id attributes to h1–h6 headings so TOC links work
function rehypeHeadingIds() {
  return function (tree) {
    function walk(node) {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        if (!node.properties) node.properties = {};
        if (!node.properties.id) {
          node.properties.id = slugify(extractText(node));
        }
      }
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
  };
}

// Escapes { and } in markdown text so mdsvex/Svelte doesn't interpret them as expressions.
// Code blocks and inline code are skipped automatically (they're leaf nodes with `value`).
function remarkEscapeBraces() {
  return function (tree) {
    function walk(node) {
      if (node.type === 'text' && (node.value.includes('{') || node.value.includes('}'))) {
        node.type = 'html';
        node.value = node.value.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
        return;
      }
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
  };
}

// Rewrites relative image src paths to /images/<filename>
// Convention: place images in static/images/ and reference them as ./image.png in markdown
function rehypeFixImages() {
  return function (tree) {
    function walk(node) {
      if (node.type === 'element' && node.tagName === 'img') {
        const src = node.properties && node.properties.src;
        if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
          node.properties.src = '/images/' + src.replace(/^\.\//, '').replace(/^\.\.\/[^/]+\//, '');
        }
      }
      if (node.children) node.children.forEach(walk);
    }
    walk(tree);
  };
}

const config = {
  extensions: ['.svelte', '.md', '.svx'],
  preprocess: [
    mdsvex({
      extensions: ['.md', '.svx'],
      highlight: { alias: {} },
      remarkPlugins: [remarkEscapeBraces],
      rehypePlugins: [rehypeHeadingIds, rehypeFixImages]
    })
  ],
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    prerender: { handleHttpError: 'warn' }
  }
};

export default config;

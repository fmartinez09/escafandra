import test from 'node:test';
import assert from 'node:assert/strict';
import { createEntries, filterByTag, getTags, tagHref } from '../src/lib/content-metadata.js';

test('content supports arbitrary, multiple, and optional tags across sections', () => {
  const entries = createEntries({
    '/src/notes/older.md': { title: 'Older', date: '30-09-2026', tags: [' New topic ', 'New topic', '', 'LLM Agents & Harnesses'] },
    '/src/research/newer.md': { date: '04-10-2026' },
    '/src/projects/artifact.md': { date: '01-10-2026', tags: ['New topic'] },
    '/src/research/draft.md': { date: '05-10-2026', draft: true },
  });

  assert.deepEqual(entries.map(entry => entry.href), ['/research/newer', '/projects/artifact', '/notes/older']);
  assert.deepEqual(entries[0].tags, []);
  assert.deepEqual(entries[2].tags, ['New topic', 'LLM Agents & Harnesses']);
  assert.deepEqual(getTags(entries), ['LLM Agents & Harnesses', 'New topic']);
  assert.deepEqual(filterByTag(entries, 'New topic').map(entry => entry.slug), ['artifact', 'older']);
  assert.deepEqual(filterByTag(entries, 'Unused topic'), []);
  assert.equal(filterByTag(entries, '').length, 3);
});

test('tag URLs preserve punctuation and unicode labels', () => {
  const tag = 'Agents & Harnesses / teoría #1 + tests';
  const url = new URL(tagHref('notes', tag), 'https://example.test');
  assert.equal(url.pathname, '/notes');
  assert.equal(url.searchParams.get('tag'), tag);
});

test('malformed tag metadata fails with the file path; excerpt remains supported', () => {
  assert.throws(() => createEntries({ '/src/notes/bad.md': { tags: 'Topic' } }), /Invalid tags in \/src\/notes\/bad.md/);
  assert.throws(() => createEntries({ '/src/notes/bad.md': { tags: [123] } }), /Invalid tags/);
  assert.equal(createEntries({ '/src/notes/legacy.md': { excerpt: 'Summary' } })[0].summary, 'Summary');
});

function parseDDMMYYYY(str) {
  if (!str || typeof str !== 'string') return 0;
  const parts = str.split('-').map(n => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [d, m, y] = parts;
  if (m < 1 || m > 12) console.warn(`[research] Invalid month in date "${str}"`);
  return Date.UTC(y, m - 1, d);
}

export async function load() {
  const postFiles = import.meta.glob('/src/research/*.md', { eager: true });

  const posts = Object.entries(postFiles).map(([path, module]) => {
    const slug = path.split('/').pop().replace('.md', '');
    const { metadata } = module;
    return {
      slug,
      title: metadata?.title ?? slug,
      date: metadata?.date ?? '',
      summary: metadata?.summary ?? '',
      tag: metadata?.tag ?? 'research',
    };
  });

  posts.sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));

  return { posts };
}

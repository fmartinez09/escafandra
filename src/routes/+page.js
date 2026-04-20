function parseDDMMYYYY(str) {
  if (!str || typeof str !== 'string') return 0;
  const parts = str.split('-').map(n => parseInt(n, 10));
  if (parts.length !== 3 || parts.some(isNaN)) return 0;
  const [d, m, y] = parts;
  return Date.UTC(y, m - 1, d);
}

export async function load() {
  const postFiles = import.meta.glob('/src/posts/*.md', { eager: true });

  const posts = Object.entries(postFiles).map(([path, module]) => {
    const slug = path.split('/').pop().replace('.md', '');
    const { metadata } = module;
    return {
      slug,
      title: metadata?.title ?? slug,
      date: metadata?.date ?? '',
      tag: metadata?.tag ?? metadata?.category ?? 'research',
    };
  });

  posts.sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date));

  return { latestPost: posts[0] ?? null };
}

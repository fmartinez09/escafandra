export async function load() {
  // Dynamically import all markdown posts
  const postFiles = import.meta.glob('/src/posts/*.md', { eager: true });

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

  // Sort newest first
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));

  return { posts };
}

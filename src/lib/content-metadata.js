export const SECTIONS = [
  {
    id: 'research',
    title: 'Research',
    description: 'Papers, preprints, and work aimed at making an original contribution.',
    empty: 'No research published yet.',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Built artifacts: tools, experiments, repositories, and systems.',
    empty: 'No projects published yet.',
  },
  {
    id: 'notes',
    title: 'Notes',
    description: 'Surveys, lecture and reading notes, technical notes, paper reproductions, idea explorations, and small experiments.',
    empty: 'No notes published yet.',
  },
];

function timestamp(date) {
  const [day, month, year] = String(date).split('-').map(Number);
  return Date.UTC(year, month - 1, day) || 0;
}

export function createEntries(files) {
  return Object.entries(files)
    .filter(([, metadata]) => metadata?.draft !== true)
    .map(([path, metadata]) => {
      const section = path.split('/').at(-2);
      const slug = path.split('/').at(-1).replace(/\.md$/, '');
      const tags = metadata?.tags ?? [];
      if (!Array.isArray(tags) || tags.some(tag => typeof tag !== 'string')) {
        throw new Error(`Invalid tags in ${path}. Use a list of text labels, or omit tags entirely.`);
      }
      return {
        section,
        slug,
        path,
        href: `/${section}/${slug}`,
        title: metadata?.title ?? slug,
        date: metadata?.date ?? '',
        summary: metadata?.summary ?? metadata?.excerpt ?? '',
        tags: [...new Set(tags.map(tag => tag.trim()).filter(Boolean))],
      };
    })
    .sort((a, b) => timestamp(b.date) - timestamp(a.date) || a.slug.localeCompare(b.slug));
}

export function filterByTag(entries, tag) {
  return tag ? entries.filter(entry => entry.tags.includes(tag)) : entries;
}

export function getTags(entries) {
  return [...new Set(entries.flatMap(entry => entry.tags))].sort((a, b) => a.localeCompare(b));
}

export function tagHref(section, tag) {
  return `/${section}?tag=${encodeURIComponent(tag)}`;
}

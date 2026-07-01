import { writable, derived } from 'svelte/store';

// Helper to determine starting locale
const getInitialLocale = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('locale');
    if (saved === 'es' || saved === 'en') {
      return saved;
    }
  }
  return 'en'; // Default
};

export const locale = writable(getInitialLocale());

if (typeof window !== 'undefined') {
  locale.subscribe((value) => {
    localStorage.setItem('locale', value);
  });
}

// UI Translations dictionary
const translations = {
  en: {
    nav: {
      home: 'Home',
      blog: 'Blog'
    },
    footer: {
      copyright: '© 2026 Fernando Martínez'
    },
    home: {
      title: 'fernando martínez',
      thesis: [
        "I'm a software engineer focused on distributed systems.",
        "Interested in building and understanding robust storage and query layers that form the backbone of modern data infrastructure."
      ],
      companies: [
        "Distributed Systems",
        "Concurrency",
        "Formal Verification",
        "Model Checking",
        "PBT",
        "DST"
      ],
      aboutLabel: "01 — About",
      aboutTitle: "Who am I",
      aboutBody: "I'm Fernando, a multidisciplinary software engineer based in Chile. I focus on distributed systems. Now, i'm focusing on formal verification of distributed systems, and coalgebraic and bisimulation modeling.",
      blogLabel: "02 — Blog",
      blogTitle: "Latest from the Blog",
      noPosts: "No posts yet.",
      allPosts: "All posts →"
    },
    blog: {
      title: 'Blog',
      label: 'Blog',
      heading: 'Writing',
      desc: 'Research, analysis, and notes.',
      noPosts: 'No posts yet.'
    },
    post: {
      titleFallback: 'Post',
      contents: 'Contents',
      back: '← Back to all posts'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      blog: 'Blog'
    },
    footer: {
      copyright: '© 2026 Fernando Martínez'
    },
    home: {
      title: 'fernando martínez',
      thesis: [
        "Soy un ingeniero de software enfocado en sistemas distribuidos.",
        "Interesado en construir y comprender capas robustas de almacenamiento y consulta que forman la columna vertebral de la infraestructura de datos moderna."
      ],
      companies: [
        "Sistemas Distribuidos",
        "Concurrencia",
        "Verificación Formal",
        "Verificación de Modelos",
        "PBT",
        "DST"
      ],
      aboutLabel: "01 — Sobre mí",
      aboutTitle: "Quién soy",
      aboutBody: "Soy Fernando, un ingeniero de software multidisciplinario residente en Chile. Me enfoco en sistemas distribuidos. Actualmente me centro en la verificación formal de sistemas distribuidos y en el modelado coalgebraico y de bisimulación.",
      blogLabel: "02 — Blog",
      blogTitle: "Lo último del Blog",
      noPosts: "Aún no hay publicaciones.",
      allPosts: "Todas las publicaciones →"
    },
    blog: {
      title: 'Blog',
      label: 'Blog',
      heading: 'Escritura',
      desc: 'Investigaciones, análisis y notas.',
      noPosts: 'Aún no hay publicaciones.'
    },
    post: {
      titleFallback: 'Publicación',
      contents: 'Contenidos',
      back: '← Volver a todas las publicaciones'
    }
  }
};

// Derived helper to easily query deep paths like $t('home.aboutTitle')
export const t = derived(locale, ($locale) => {
  return (path) => {
    const parts = path.split('.');
    let translation = translations[$locale] || translations['en'];
    for (const part of parts) {
      if (translation === undefined) return path;
      translation = translation[part];
    }
    return translation !== undefined ? translation : path;
  };
});

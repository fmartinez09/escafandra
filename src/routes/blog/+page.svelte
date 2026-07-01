<script>
  import { locale, t } from '../../lib/stores/locale.js';
  export let data;
  $: posts = data.posts || [];

  $: displayedPosts = (() => {
    const lang = $locale;
    const seen = new Set();
    const filtered = [];
    
    for (const post of posts) {
      const isSpanish = post.slug.endsWith('.es');
      const baseSlug = isSpanish ? post.slug.slice(0, -3) : post.slug;
      
      if (seen.has(baseSlug)) continue;
      
      if (lang === 'es') {
        const spanishVersion = posts.find(p => p.slug === `${baseSlug}.es`);
        if (spanishVersion) {
          filtered.push(spanishVersion);
          seen.add(baseSlug);
        } else {
          filtered.push(post);
          seen.add(baseSlug);
        }
      } else {
        if (!isSpanish) {
          filtered.push(post);
          seen.add(baseSlug);
        }
      }
    }
    return filtered;
  })();

  function formatDate(str, currentLocale) {
    if (!str) return '';
    const [d, m, y] = str.split('-');
    const mi = parseInt(m, 10) - 1;
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsEs = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const months = currentLocale === 'es' ? monthsEs : monthsEn;
    return `${months[mi] ?? ''} ${y ?? ''}`.trim();
  }
</script>

<svelte:head>
  <title>{$t('blog.title')}</title>
</svelte:head>

<div class="blog-index">
  <header class="blog-header">
    <span class="blog-label">{$t('blog.label')}</span>
    <h1>{$t('blog.heading')}</h1>
    <p class="blog-desc">{$t('blog.desc')}</p>
  </header>

  <div class="posts-list">
    {#each displayedPosts as post}
      <a href="/blog/{post.slug}" class="post-item">
        <div class="post-meta">
          <span class="post-tag">{post.tag ?? 'research'}</span>
          <span class="post-date">{formatDate(post.date, $locale)}</span>
        </div>
        <h2 class="post-title">{post.title}</h2>
        {#if post.summary}
          <p class="post-summary">{post.summary}</p>
        {/if}
      </a>
    {:else}
      <p class="empty">{$t('blog.noPosts')}</p>
    {/each}
  </div>
</div>

<style>
  .blog-index {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .blog-header {
    padding: 56px 0 32px;
    border-bottom: 1px solid var(--border);
  }

  .blog-label {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 10px;
  }

  h1 {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 8px;
    line-height: 1.1;
  }

  .blog-desc {
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
  }

  .post-item {
    display: block;
    padding: 22px 0;
    border-bottom: 1px solid var(--border);
  }

  .post-item:hover h2 {
    color: var(--accent);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .post-tag {
    font-size: 0.625rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    background: var(--bg-elevated);
    padding: 2px 6px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .post-date {
    font-size: 0.6875rem;
    color: var(--text-subtle);
    font-family: var(--font-mono);
  }

  h2 {
    font-family: var(--font-heading);
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 6px;
    transition: color 0.15s;
    line-height: 1.3;
  }

  .post-summary {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.55;
    max-width: 520px;
  }

  .empty {
    padding: 32px 0;
    color: var(--text-muted);
    font-size: 0.875rem;
  }
</style>

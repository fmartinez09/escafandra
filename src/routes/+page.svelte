<script>
  import { locale, t } from '../lib/stores/locale.js';

  export let data;
  $: posts = data.posts || [];

  $: latestPost = (() => {
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
    return filtered[0] || null;
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

  $: companies = $t('home.companies').map(name => ({ name }));
  $: thesis = $t('home.thesis');
</script>

<svelte:head>
  <title>{$t('home.title')}</title>
</svelte:head>

<div class="home">
  <section class="hero">
    <h1>Fernando Martínez</h1>
    <div class="thesis">
      {#each thesis as line, i}
        <p class:highlight={i === 0}>{line}</p>
      {/each}
    </div>
    <div class="companies">
      {#each companies as co}
        <span class="company-tag">{co.name}</span>
      {/each}
    </div>
  </section>

  <section class="section">
    <div class="section-label">{$t('home.aboutLabel')}</div>
    <div class="section-content">
      <h2>{$t('home.aboutTitle')}</h2>
      <div class="about-body">
        <p>
          {$t('home.aboutBody')}
        </p>
      </div>
      <!-- <a href="/about" class="section-cta">More →</a> -->
    </div>
  </section>

  <section class="section">
    <div class="section-label">{$t('home.blogLabel')}</div>
    <div class="section-content">
      <h2>{$t('home.blogTitle')}</h2>
      <div class="posts-preview">
        {#if latestPost}
          <a href="/blog/{latestPost.slug}" class="post-row">
            <div class="post-row-left">
              <span class="post-row-tag">{latestPost.tag}</span>
              <span class="post-row-title">{latestPost.title}</span>
            </div>
            <span class="post-row-date">{formatDate(latestPost.date, $locale)}</span>
          </a>
        {:else}
          <p class="post-row-title" style="color: var(--text-muted)">{$t('home.noPosts')}</p>
        {/if}
      </div>
      <a href="/blog" class="section-cta">{$t('home.allPosts')}</a>
    </div>
  </section>
</div>

<style>
  .home {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .hero {
    padding: 56px 0 40px;
    border-bottom: 1px solid var(--border);
  }

  h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.05;
    margin-bottom: 22px;
    color: var(--text);
  }

  .thesis {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 32px;
    max-width: 560px;
  }

  .thesis p {
    font-size: 0.875rem;
    color: var(--text-muted);
    line-height: 1.6;
  }

  .thesis p.highlight {
    color: var(--text);
    font-weight: 500;
  }

  .companies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 14px;
  }

  .company-tag {
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--text-muted);
    background: transparent;
    transition: color 0.15s;
  }

  .company-tag:hover {
    color: var(--text);
  }

  .co-num {
    display: none;
  }

  .company-tag.all {
    display: none;
  }

  /* Sections — compact */
  .section {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 24px;
    padding: 32px 0;
    border-bottom: 1px solid var(--border);
  }

  .section:last-child {
    border-bottom: none;
    padding-bottom: 56px;
  }

  .section-label {
    font-family: var(--font-mono);
    font-size: 0.5625rem;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-top: 3px;
  }

  .section-content {
    max-width: 500px;
  }

  h2 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 12px;
  }

  .section-cta {
    display: inline-block;
    margin-top: 14px;
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--text-muted);
    transition: color 0.15s;
  }

  .section-cta:hover {
    color: var(--accent);
  }

  .about-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .about-body p {
    color: var(--text-muted);
    font-size: 0.8125rem;
    line-height: 1.65;
  }

  .residency-desc {
    color: var(--text-muted);
    font-size: 0.875rem;
    line-height: 1.55;
  }

  /* Post rows — slim */
  .posts-preview {
    display: flex;
    flex-direction: column;
  }

  .post-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 8px 0;
    gap: 16px;
    transition: color 0.15s;
  }

  .post-row-left {
    display: flex;
    align-items: baseline;
    gap: 10px;
    min-width: 0;
  }

  .post-row-tag {
    font-size: 0.5625rem;
    font-family: var(--font-mono);
    color: var(--green);
    background: var(--green-muted);
    padding: 1px 5px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .post-row-title {
    font-size: 0.875rem;
    color: var(--text);
    transition: color 0.15s;
  }

  .post-row:hover .post-row-title {
    color: var(--accent);
  }

  .post-row-date {
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    .section {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
</style>

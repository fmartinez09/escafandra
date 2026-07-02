<script>
  import { onMount } from 'svelte';
  export let data;
  const { content: Content, meta } = data;

  let tocItems = [];
  let activeId = '';

  onMount(() => {
    const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3');
    tocItems = Array.from(headings).map(h => ({
      id: h.id,
      text: h.textContent.trim(),
      level: parseInt(h.tagName[1])
    }));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
            break;
          }
        }
      },
      { rootMargin: '-8% 0% -82% 0%', threshold: 0 }
    );

    headings.forEach(h => observer.observe(h));
    return () => observer.disconnect();
  });
</script>

<svelte:head>
  <title>{meta?.title ?? 'Research'} — Fernando Martínez</title>
</svelte:head>

<div class="post-layout">
  {#if tocItems.length > 0}
    <aside class="toc">
      <p class="toc-label">Contents</p>
      <nav class="toc-nav">
        {#each tocItems as item}
          <a
            href="#{item.id}"
            class="toc-link"
            class:toc-h3={item.level === 3}
            class:active={activeId === item.id}
          >{item.text}</a>
        {/each}
      </nav>
    </aside>
  {/if}

  <div class="post-container">
    <a href="/research" class="back-link">← Back to research</a>

    <header class="post-header">
      {#if meta?.tag}
        <span class="post-tag">{meta.tag}</span>
      {/if}
      <h1>{meta?.title}</h1>
      {#if meta?.summary}
        <p class="post-lead">{meta.summary}</p>
      {/if}
      <div class="post-byline">
        {#if meta?.author}
          <span class="author">{meta.author}</span>
        {/if}
        {#if meta?.date}
          <span class="date">{meta.date}</span>
        {/if}
      </div>
    </header>

    <article class="prose">
      <svelte:component this={Content} />
    </article>
  </div>
</div>

<style>
  .post-layout {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    gap: 96px;
    align-items: flex-start;
  }

  /* ── TOC sidebar ───────────────────────────────────────── */
  .toc {
    width: 196px;
    flex-shrink: 0;
    position: sticky;
    top: calc(var(--nav-h) + 28px);
    max-height: calc(100vh - var(--nav-h) - 56px);
    overflow-y: auto;
    padding-top: 64px;
  }

  .toc-label {
    font-size: 0.5625rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }

  .toc-nav {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .toc-link {
    display: block;
    font-size: 0.6875rem;
    font-family: var(--font-body);
    color: var(--text-subtle);
    line-height: 1.5;
    padding: 4px 8px;
    border-left: 1px solid var(--border);
    transition: color 0.15s, border-color 0.15s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .toc-link.toc-h3 {
    padding-left: 18px;
    font-size: 0.625rem;
  }

  .toc-link:hover {
    color: var(--text-muted);
    border-left-color: var(--text-subtle);
  }

  .toc-link.active {
    color: var(--accent);
    border-left-color: var(--accent);
  }

  /* ── Post content ──────────────────────────────────────── */
  .post-container {
    min-width: 0;
    flex: 1;
    max-width: 612px;
  }

  .back-link {
    display: inline-block;
    margin: 24px 0 28px;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
    transition: color 0.15s;
    letter-spacing: 0.02em;
  }

  .back-link:hover {
    color: var(--accent);
  }

  .post-header {
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border);
  }

  .post-tag {
    display: inline-block;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    background: var(--bg-elevated);
    padding: 2px 6px;
    border-radius: 3px;
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  h1 {
    font-family: var(--font-heading);
    font-size: 1.85rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 14px;
  }

  .post-lead {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.5;
    margin-bottom: 14px;
  }

  .post-byline {
    display: flex;
    gap: 12px;
    align-items: center;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
  }

  .author {
    color: var(--text-muted);
  }

  /* ── Prose ─────────────────────────────────────────────── */
  :global(.prose) {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 0.9375rem;
    line-height: 1.42;
    color: var(--text);
    padding-bottom: 64px;
  }

  :global(.prose h1),
  :global(.prose h2),
  :global(.prose h3),
  :global(.prose h4) {
    font-family: var(--font-heading);
    font-weight: 500;
    letter-spacing: -0.01em;
    margin: 1.7em 0 0.55em;
    line-height: 1.22;
    color: var(--text);
    scroll-margin-top: calc(var(--nav-h) + 16px);
  }

  :global(.prose h2) { font-size: 1.2rem; }
  :global(.prose h3) { font-size: 1rem; }
  :global(.prose h4) { font-size: 0.9375rem; color: var(--text-muted); }

  :global(.prose p) {
    margin: 0.9em 0;
    color: var(--text);
  }

  :global(.prose a) {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 2px;
    text-decoration-color: rgba(230, 73, 128, 0.3);
  }

  :global(.prose a:hover) {
    color: var(--accent-hover);
    text-decoration-color: var(--accent-hover);
  }

  :global(.prose strong) { font-weight: 600; }
  :global(.prose em) { font-style: italic; }

  :global(.prose ul),
  :global(.prose ol) {
    padding-left: 1.4em;
    margin: 0.75em 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  :global(.prose li) {
    color: var(--text);
    line-height: 1.45;
  }

  :global(.prose blockquote) {
    border-left: 2px solid var(--accent);
    padding: 2px 0 2px 16px;
    margin: 1.2em 0;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  :global(.prose hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2em 0;
  }

  :global(.prose code:not(pre code)) {
    font-family: var(--font-mono);
    font-size: 0.72rem;
    background: var(--bg-elevated);
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--accent);
  }

  :global(.prose pre) {
    background: var(--code-bg);
    border-radius: 0;
    padding: 10px 14px;
    overflow-x: auto;
    margin: 1em 0;
    border: 1px solid var(--border);
    max-width: 100%;
  }

  :global(.prose pre code) {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--code-text);
    background: none;
    border: none;
    padding: 0;
    line-height: 1.45;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    tab-size: 2;
  }

  :global(.prose table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8125rem;
    margin: 1.2em 0;
    font-family: var(--font-body);
  }

  :global(.prose th) {
    text-align: left;
    padding: 8px 12px 8px 0;
    border-bottom: 2px solid var(--border);
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  :global(.prose td) {
    padding: 8px 12px 8px 0;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: top;
  }

  :global(.prose tr:last-child td) { border-bottom: none; }

  :global(.prose img) {
    max-width: 100%;
    border-radius: 0;
    margin: 1.2em 0;
    border: 1px solid var(--border);
    display: block;
  }

  /* ── Responsive ────────────────────────────────────────── */
  @media (max-width: 900px) {
    .toc { display: none; }
    .post-layout { max-width: 652px; }
  }

  @media (max-width: 640px) {
    .post-layout { padding: 0 16px; }
  }
</style>

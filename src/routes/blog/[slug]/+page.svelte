<script>
  export let data;
  const { content: Content, meta } = data;
</script>

<svelte:head>
  <title>{meta?.title ?? 'Post'} — Escafandra</title>
</svelte:head>

<div class="post-wrap">
  <div class="post-container">
    <a href="/blog" class="back-link">← Back to all posts</a>

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
  .post-wrap {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .post-container {
    max-width: var(--max-w);
  }

  .back-link {
    display: inline-block;
    margin: 32px 0 40px;
    font-size: 0.8125rem;
    color: var(--text-subtle);
    font-family: var(--font-body);
    transition: color 0.15s;
  }

  .back-link:hover {
    color: var(--accent);
  }

  .post-header {
    margin-bottom: 48px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border);
  }

  .post-tag {
    display: inline-block;
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--text-subtle);
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: 3px;
    margin-bottom: 16px;
    text-transform: lowercase;
  }

  h1 {
    font-family: var(--font-serif);
    font-size: clamp(2.25rem, 5vw, 3rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.15;
    color: var(--text);
    margin-bottom: 16px;
  }

  .post-lead {
    font-size: 1.1875rem;
    color: var(--text);
    line-height: 1.55;
    margin-bottom: 20px;
    font-family: var(--font-serif);
    font-style: italic;
  }

  .post-byline {
    display: flex;
    gap: 16px;
    align-items: center;
    font-size: 0.8125rem;
    font-family: var(--font-body);
    color: var(--text-subtle);
  }

  .author {
    color: var(--text-muted);
  }

  /* Prose styles */
  :global(.prose) {
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--text);
    padding-bottom: 80px;
  }

  :global(.prose h1),
  :global(.prose h2),
  :global(.prose h3),
  :global(.prose h4) {
    font-family: var(--font-serif);
    font-weight: 400;
    letter-spacing: -0.01em;
    margin: 2.2em 0 0.8em;
    line-height: 1.25;
    color: var(--text);
  }

  :global(.prose h2) { font-size: 1.4rem; }
  :global(.prose h3) { font-size: 1.15rem; }
  :global(.prose h4) { font-size: 1rem; font-style: italic; }

  :global(.prose p) {
    margin: 1em 0;
    color: var(--text);
  }

  :global(.prose a) {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :global(.prose a:hover) {
    color: var(--accent-hover);
  }

  :global(.prose strong) {
    font-weight: 600;
  }

  :global(.prose em) {
    font-style: italic;
  }

  :global(.prose ul),
  :global(.prose ol) {
    padding-left: 1.5em;
    margin: 1em 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  :global(.prose li) {
    color: var(--text);
    line-height: 1.65;
  }

  :global(.prose blockquote) {
    border-left: 2px solid var(--accent);
    padding: 4px 0 4px 20px;
    margin: 1.5em 0;
    color: var(--text-muted);
    font-family: var(--font-serif);
    font-style: italic;
    font-size: 1.05rem;
  }

  :global(.prose hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2.5em 0;
  }

  /* Inline code */
  :global(.prose code:not(pre code)) {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 1px 5px;
    border-radius: 3px;
    color: var(--text);
  }

  /* Code blocks */
  :global(.prose pre) {
    background: var(--code-bg);
    border-radius: 6px;
    padding: 20px 24px;
    overflow-x: auto;
    margin: 1.5em 0;
    border: 1px solid #333;
  }

  :global(.prose pre code) {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    color: var(--code-text);
    background: none;
    border: none;
    padding: 0;
    line-height: 1.7;
  }

  /* Tables */
  :global(.prose table) {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    margin: 1.5em 0;
    font-family: var(--font-body);
  }

  :global(.prose th) {
    text-align: left;
    padding: 8px 16px 8px 0;
    border-bottom: 2px solid var(--border);
    font-size: 0.8125rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  :global(.prose td) {
    padding: 8px 16px 8px 0;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    vertical-align: top;
  }

  :global(.prose tr:last-child td) {
    border-bottom: none;
  }

  /* Images */
  :global(.prose img) {
    max-width: 100%;
    border-radius: 6px;
    margin: 1.5em 0;
    border: 1px solid var(--border);
  }
</style>

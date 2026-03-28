<script>
  export let data;
</script>

<svelte:head>
  <title>Writing — Escafandra</title>
</svelte:head>

<div class="blog-index">
  <header class="blog-header">
    <h1>Writing</h1>
    <p class="blog-desc">Research, analysis, and notes from the lab.</p>
  </header>

  <div class="posts-list">
    {#each data.posts as post}
      <a href="/blog/{post.slug}" class="post-item">
        <div class="post-meta">
          <span class="post-tag">{post.tag ?? 'research'}</span>
          <span class="post-date">{post.date}</span>
        </div>
        <h2 class="post-title">{post.title}</h2>
        {#if post.summary}
          <p class="post-summary">{post.summary}</p>
        {/if}
      </a>
    {:else}
      <p class="empty">No posts yet.</p>
    {/each}
  </div>
</div>

<style>
  .blog-index {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .blog-header {
    padding: 56px 0 40px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 0;
  }

  h1 {
    font-family: var(--font-serif);
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 8px;
  }

  .blog-desc {
    color: var(--text-muted);
    font-size: 0.9375rem;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
  }

  .post-item {
    display: block;
    padding: 28px 0;
    border-bottom: 1px solid var(--border);
    transition: none;
  }

  .post-item:hover h2 {
    color: var(--accent);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .post-tag {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
    background: var(--bg-card);
    border: 1px solid var(--border);
    padding: 2px 8px;
    border-radius: 3px;
    text-transform: lowercase;
  }

  .post-date {
    font-size: 0.8125rem;
    color: var(--text-subtle);
    font-family: var(--font-mono);
  }

  h2 {
    font-family: var(--font-serif);
    font-size: 1.25rem;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 8px;
    transition: color 0.15s;
    line-height: 1.3;
  }

  .post-summary {
    font-size: 0.9rem;
    color: var(--text-muted);
    line-height: 1.55;
    max-width: 560px;
  }

  .empty {
    padding: 40px 0;
    color: var(--text-muted);
  }
</style>

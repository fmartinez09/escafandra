<script>
  export let data;
</script>

<svelte:head>
  <title>Lab</title>
</svelte:head>

<div class="blog-index">
  <header class="blog-header">
    <span class="blog-label">Lab</span>
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
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .blog-header {
    padding: 40px 0 28px;
    border-bottom: 1px solid var(--border);
  }

  .blog-label {
    font-family: var(--font-mono);
    font-size: 0.5625rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 8px;
  }

  h1 {
    font-family: var(--font-heading);
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 6px;
  }

  .blog-desc {
    color: var(--text-muted);
    font-size: 0.8125rem;
  }

  .posts-list {
    display: flex;
    flex-direction: column;
  }

  .post-item {
    display: block;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
  }

  .post-item:hover h2 {
    color: var(--accent);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 6px;
  }

  .post-tag {
    font-size: 0.5625rem;
    font-family: var(--font-mono);
    color: var(--green);
    background: var(--green-muted);
    padding: 1px 5px;
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
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 4px;
    transition: color 0.15s;
    line-height: 1.35;
  }

  .post-summary {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.5;
    max-width: 480px;
  }

  .empty {
    padding: 32px 0;
    color: var(--text-muted);
    font-size: 0.8125rem;
  }
</style>

<script>
  import InteractiveNetwork from '$lib/components/InteractiveNetwork.svelte';
  import TagList from '$lib/components/TagList.svelte';
  export let data;

  const interests = [
    /*
    'Distributed Systems',
    'Formal Verification',
    'Model Checking',
    'Empirical Testing',
    'Automata and Computer Theory',
    */
  ];

  const thesis = [
    'Software Engineer and Independent Researcher.',
  ];

  function formatDate(str) {
    if (!str) return '';
    const [, m, y] = str.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(m, 10) - 1] ?? ''} ${y ?? ''}`.trim();
  }
</script>

<svelte:head>
  <title>fernando martínez</title>
</svelte:head>

<div class="home">
  <section class="hero">
    <h1>Fernando Martínez</h1>
    <div class="thesis">
      {#each thesis as line}<p>{line}</p>{/each}
    </div>
    {#if interests.length}
    <div class="interests">
      {#each interests as interest}<span>{interest}</span>{/each}
    </div>
    {/if}
  </section>

  <section class="latest-posts">
    <h2>Latest posts</h2>
    <div class="posts-preview">
      {#each data.posts as post}
        <article class="post-row">
          <div class="post-heading">
            <a href={post.href} class="post-title">{post.title}</a>
            <span class="post-date">{formatDate(post.date)}</span>
          </div>
          <TagList tags={post.tags} section={post.section} />
        </article>
      {:else}
        <p class="empty">No posts published yet.</p>
      {/each}
    </div>
  </section>

  <InteractiveNetwork />
</div>

<style>
  .home { max-width: 720px; margin: 0 auto; padding: 0 20px; }
  .hero { padding: 56px 0 40px; border-bottom: 1px solid var(--border); }
  h1 {
    font-family: var(--font-heading); font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 500; letter-spacing: -0.02em; line-height: 1.05;
    margin-bottom: 16px; color: var(--text);
  }
  .thesis { display: flex; flex-direction: column; gap: 4px; max-width: 560px; }
  .thesis p { color: var(--text-muted); font-size: 0.875rem; line-height: 1.65; }
  .interests { display: flex; flex-wrap: wrap; gap: 8px 14px; margin-top: 24px; }
  .interests span { font-size: 0.75rem; color: var(--text-muted); }
  .latest-posts { padding: 32px 0; border-bottom: 1px solid var(--border); }
  h2 {
    font-family: var(--font-heading); font-size: 1.25rem; font-weight: 500;
    letter-spacing: -0.01em; color: var(--text); margin-bottom: 12px;
  }
  .posts-preview { margin-top: 16px; }
  .post-row { padding: 10px 0; }
  .post-heading { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 8px; }
  .post-title { font-size: 0.875rem; line-height: 1.5; color: var(--text); }
  .post-title:hover { color: var(--accent); }
  .post-date { font-size: 0.6875rem; font-family: var(--font-mono); color: var(--text-subtle); flex-shrink: 0; }
  .empty { color: var(--text-subtle); font-size: 0.8125rem; }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  @media (max-width: 600px) {
    .post-heading { flex-wrap: wrap; gap: 4px 16px; }
  }
</style>

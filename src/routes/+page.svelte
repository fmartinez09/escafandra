<script>
  export let data;
  $: latestPost = data.latestPost;

  function formatDate(str) {
    if (!str) return '';
    const [d, m, y] = str.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mi = parseInt(m, 10) - 1;
    return `${months[mi] ?? ''} ${y ?? ''}`.trim();
  }

  const companies = [
    { name: "Distributed Systems"},
    { name: "Concurrency"},
    { name: "Formal Verification"},
    { name: "Model Checking"},
    { name: "PBT"},
    { name: "DST"},
  ];

  const thesis = [
    "I'm a software engineer focused on distributed systems.",
    "Interested in building and understanding robust storage and query layers that form the backbone of modern data infrastructure.",
  ];
</script>

<svelte:head>
  <title>fernando martínez</title>
</svelte:head>

<div class="home">
  <section class="hero">
    <div class="hero-label">Research & Development</div>
    <h1>Fernando Martínez</h1>
    <div class="thesis">
      {#each thesis as line, i}
        <p class:highlight={i === 0}>{line}</p>
      {/each}
    </div>
    <div class="companies">
      {#each companies as co, i}
        <a href={co.url} class="company-tag">
          <span class="co-num">{String(i + 1).padStart(2, "0")}</span>{co.name}
        </a>
      {/each}
      <!-- <a class="company-tag all">All areas</a> -->
    </div>
  </section>

  <section class="section">
    <div class="section-label">01 — About</div>
    <div class="section-content">
      <h2>Who am I</h2>
      <div class="about-body">
        <p>
          I'm Fernando, a multidisciplinary software engineer based in Chile. I
          focus on distributed systems. Now, i'm focusing on formal verification of distributed systems, and coalgebraic and bisimulation modeling.
        </p>
      </div>
      <!-- <a href="/about" class="section-cta">More →</a> -->
    </div>
  </section>

  <section class="section">
    <div class="section-label">02 — Lab</div>
    <div class="section-content">
      <h2>Latest from the Lab</h2>
      <div class="posts-preview">
        {#if latestPost}
          <a href="/blog/{latestPost.slug}" class="post-row">
            <div class="post-row-left">
              <span class="post-row-tag">{latestPost.tag}</span>
              <span class="post-row-title">{latestPost.title}</span>
            </div>
            <span class="post-row-date">{formatDate(latestPost.date)}</span>
          </a>
        {:else}
          <p class="post-row-title" style="color: var(--text-muted)">No posts yet.</p>
        {/if}
      </div>
      <a href="/blog" class="section-cta">All posts →</a>
    </div>
  </section>
</div>

<style>
  .home {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
  }

  .hero {
    padding: 48px 0 36px;
    border-bottom: 1px solid var(--border);
  }

  .hero-label {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 10px;
  }

  h1 {
    font-family: var(--font-heading);
    font-size: clamp(2.25rem, 5.5vw, 3.25rem);
    font-weight: 600;
    letter-spacing: -0.03em;
    line-height: 1.08;
    margin-bottom: 20px;
    color: var(--text);
  }

  .thesis {
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin-bottom: 28px;
    max-width: 520px;
  }

  .thesis p {
    font-size: 0.8125rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .thesis p.highlight {
    color: var(--text);
    font-weight: 500;
  }

  .companies {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .company-tag {
    padding: 3px 9px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--text-muted);
    background: transparent;
    transition: all 0.15s;
  }

  .company-tag:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .co-num {
    font-family: var(--font-mono);
    font-size: 0.5625rem;
    color: var(--text-subtle);
    margin-right: 6px;
  }

  .company-tag.all {
    background: var(--accent-muted);
    border-color: transparent;
    color: var(--accent);
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
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text);
    margin-bottom: 10px;
  }

  .section-cta {
    display: inline-block;
    margin-top: 12px;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--accent);
    transition: color 0.15s;
  }

  .section-cta:hover {
    color: var(--accent-hover);
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
    font-size: 0.8125rem;
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

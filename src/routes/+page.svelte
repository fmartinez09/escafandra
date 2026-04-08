<script>
  const companies = [
    { name: 'Augment Code', url: '#' },
    { name: 'KREA', url: '#' },
    { name: 'OpenMind', url: '#' },
    { name: 'Orchid', url: '#' },
    { name: 'Zeromatter', url: '#' },
    { name: 'Lemurian Labs', url: '#' },
    { name: 'Logical Intelligence', url: '#' },
  ];

  const thesis = [
    "We back the foundational layers of progress.",
    "Developer platforms that accelerate creation.",
    "Robot operating systems that make autonomy real.",
    "Simulation engines training the next generation of AI.",
    "Formal verification securing billions in value.",
    "Foundational systems that quietly compound — built by founders who see elegance in complexity and possibility in constraints.",
  ];
</script>

<svelte:head>
  <title>Escafandra</title>
</svelte:head>

<div class="home">
  <section class="hero">
    <h1>Escafandra</h1>
    <div class="thesis">
      {#each thesis as line}
        <p>{line}</p>
      {/each}
    </div>
    <div class="companies">
      {#each companies as co, i}
        <a href={co.url} class="company-tag"><span class="co-num">{String(i + 1).padStart(2, '0')}</span>{co.name}</a>
      {/each}
      <a href="#" class="company-tag all">All companies</a>
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <h2>Who we are</h2>
      <a href="/about" class="section-link">Interested in joining the team?</a>
    </div>
    <div class="about-body">
      <p>
        Escafandra is a research and development group. We aim to create large-scale distributed systems, compilers, and design programming languages ​​and kernels.
      </p>
      <p>
        We're operators first. Our team has built distributed systems at scale, shipped compilers, designed programming languages, and written kernels. We don't just fund builders — we are them.
      </p>
    </div>
  </section>

  <section class="section">
    <div class="section-header">
      <h2>Research Residency</h2>
      <a href="/blog" class="section-link">From the Lab</a>
    </div>
    <p class="residency-desc">Where we let researchers loose on ideas too weird for a roadmap.</p>
  </section>

  <section class="section">
    <div class="section-header">
      <h2>Writing</h2>
      <a href="/blog" class="section-link">All posts</a>
    </div>
    <div class="posts-preview">
      <a href="/blog/kernel-bugs" class="post-row">
        <span class="post-title">Kernel bugs hide for 2 years on average. Some hide for 20.</span>
        <span class="post-date">Mar 2026</span>
      </a>
    </div>
  </section>
</div>

<style>
  .home {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
  }

  .hero {
    padding: 72px 0 56px;
    border-bottom: 1px solid var(--border);
  }

  h1 {
    font-family: var(--font-serif);
    font-size: clamp(2.5rem, 6vw, 3.5rem);
    font-weight: 400;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin-bottom: 28px;
    color: var(--text);
  }

  .thesis {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 32px;
  }

  .thesis p {
    font-size: 0.9375rem;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .companies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .company-tag {
    padding: 5px 12px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 0.8125rem;
    color: var(--text-muted);
    background: var(--bg);
    transition: all 0.15s;
  }

  .company-tag:hover {
    border-color: var(--text-muted);
    color: var(--text);
    background: var(--bg-card);
  }

  .co-num {
    font-family: var(--font-body);
    font-size: 0.6875rem;
    color: var(--text-subtle);
    margin-right: 6px;
    letter-spacing: 0;
  }

  .company-tag.all {
    background: var(--bg-card);
    border-color: transparent;
  }

  .section {
    padding: 48px 0;
    border-bottom: 1px solid var(--border);
  }

  .section:last-child {
    border-bottom: none;
    padding-bottom: 80px;
  }

  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  h2 {
    font-family: var(--font-serif);
    font-size: 1.5rem;
    font-weight: 400;
    letter-spacing: -0.01em;
    color: var(--text);
  }

  .section-link {
    font-size: 0.8125rem;
    color: var(--text-subtle);
    transition: color 0.15s;
  }

  .section-link:hover {
    color: var(--accent);
  }

  .about-body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 560px;
  }

  .about-body p {
    color: var(--text-muted);
    font-size: 0.9375rem;
    line-height: 1.65;
  }

  .residency-desc {
    color: var(--text-muted);
    font-style: italic;
    font-family: var(--font-serif);
    font-size: 1.25rem;
    line-height: 1.5;
  }

  .posts-preview {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .post-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
    gap: 24px;
    transition: color 0.15s;
  }

  .post-row:hover .post-title {
    color: var(--accent);
  }

  .post-title {
    font-size: 0.9375rem;
    color: var(--text);
    transition: color 0.15s;
  }

  .post-date {
    font-size: 0.8125rem;
    color: var(--text-subtle);
    flex-shrink: 0;
    font-family: var(--font-body);
  }
</style>

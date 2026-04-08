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
    <div class="hero-label">Research & Development</div>
    <h1>Escafandra</h1>
    <div class="thesis">
      {#each thesis as line, i}
        <p class:highlight={i === 0}>{line}</p>
      {/each}
    </div>
    <div class="companies">
      {#each companies as co, i}
        <a href={co.url} class="company-tag">
          <span class="co-num">{String(i + 1).padStart(2, '0')}</span>{co.name}
        </a>
      {/each}
      <a href="#" class="company-tag all">All companies</a>
    </div>
  </section>

  <section class="section">
    <div class="section-label">01 — About</div>
    <div class="section-content">
      <h2>Who we are</h2>
      <div class="about-body">
        <p>
          Escafandra is a research and development group. We aim to create large-scale distributed systems, compilers, and design programming languages and kernels.
        </p>
        <p>
          We're operators first. Our team has built distributed systems at scale, shipped compilers, designed programming languages, and written kernels. We don't just fund builders — we are them.
        </p>
      </div>
      <a href="/about" class="section-cta">Interested in joining the team? →</a>
    </div>
  </section>

  <section class="section">
    <div class="section-label">02 — Research</div>
    <div class="section-content">
      <h2>Research Residency</h2>
      <p class="residency-desc">Where we let researchers loose on ideas too weird for a roadmap.</p>
      <a href="/blog" class="section-cta">From the Lab →</a>
    </div>
  </section>

  <section class="section">
    <div class="section-label">03 — Writing</div>
    <div class="section-content">
      <h2>Latest from the Lab</h2>
      <div class="posts-preview">
        <a href="/blog/kernel-bugs" class="post-row">
          <div class="post-row-left">
            <span class="post-row-tag">research</span>
            <span class="post-row-title">Kernel bugs hide for 2 years on average. Some hide for 20.</span>
          </div>
          <span class="post-row-date">Mar 2026</span>
        </a>
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

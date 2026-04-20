<svelte:head>
  <title>About</title>
</svelte:head>

<div class="about">
  <span class="about-label">About</span>
  <h1>About</h1>
  <p>Coming soon.</p>
</div>

<style>
  .about {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 40px 20px;
  }
  .about-label {
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
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 12px;
  }
  p { color: var(--text-muted); font-size: 0.8125rem; }
</style>

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
    font-size: 0.625rem;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 10px;
  }
  h1 {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 500;
    letter-spacing: -0.02em;
    margin-bottom: 14px;
    line-height: 1.1;
  }
  p { color: var(--text-muted); font-size: 0.875rem; }
</style>

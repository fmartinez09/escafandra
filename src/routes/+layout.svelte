<script>
  import '../app.css';
  import { page } from '$app/stores';

  const subtitles = [
    "The quantum fluctuations are particularly poetic today.",
    "Where we let researchers loose on ideas too weird for a roadmap.",
    "Foundational systems that quietly compound.",
    "Built by founders who see elegance in complexity.",
    "A home for builders.",
    "Formal verification securing billions in value.",
    "We back the foundational layers of progress.",
  ];

  let displayed = '';
  let subtitleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let cursorVisible = true;

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function typeLoop() {
    while (true) {
      const target = subtitles[subtitleIndex];

      // Type
      while (charIndex < target.length) {
        charIndex++;
        displayed = target.slice(0, charIndex);
        await sleep(38 + Math.random() * 25);
      }

      // Hold
      await sleep(2800);

      // Delete
      while (charIndex > 0) {
        charIndex--;
        displayed = target.slice(0, charIndex);
        await sleep(18 + Math.random() * 12);
      }

      await sleep(400);
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
    }
  }

  // Cursor blink
  import { onMount } from 'svelte';
  onMount(() => {
    typeLoop();
    const interval = setInterval(() => {
      cursorVisible = !cursorVisible;
    }, 530);
    return () => clearInterval(interval);
  });

  $: isHome = $page.url.pathname === '/';
  $: isBlog = $page.url.pathname.startsWith('/blog');
</script>

<nav>
  <div class="nav-inner">
    <div class="nav-brand">
      <a href="/" class="nav-logo">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="6" height="6" fill="currentColor"/>
          <rect x="8" width="6" height="6" fill="currentColor"/>
          <rect y="8" width="6" height="6" fill="currentColor"/>
          <rect x="8" y="8" width="6" height="6" fill="currentColor" opacity="0.4"/>
        </svg>
        <span>escafandra</span>
      </a>
      <div class="nav-subtitle">
        <span class="subtitle-text">{displayed}</span><span class="cursor" class:visible={cursorVisible}>|</span>
      </div>
    </div>
    <div class="nav-links">
      <a href="/" class:active={isHome}>Home</a>
      <a href="/blog" class:active={isBlog}>Writing</a>
    </div>
  </div>
</nav>

<main>
  <slot />
</main>

<footer>
  <div class="footer-inner">
    <span>© 2026 Escafandra · San Francisco, CA</span>
    <span class="footer-mid">🦀 Made with Claude. Long live slop.</span>
    <a href="https://escafandra.com" class="footer-link">escafandra</a>
  </div>
</footer>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  .nav-brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.01em;
    color: var(--text);
    line-height: 1.2;
  }

  .nav-logo svg {
    flex-shrink: 0;
    color: var(--text);
  }

  .nav-logo:hover {
    color: var(--text);
  }

  .nav-subtitle {
    font-size: 0.75rem;
    color: var(--text-subtle);
    font-family: var(--font-mono);
    padding-left: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
    height: 16px;
    line-height: 16px;
  }

  .cursor {
    opacity: 0;
    transition: opacity 0.1s;
  }

  .cursor.visible {
    opacity: 1;
  }

  .nav-links {
    display: flex;
    gap: 24px;
    flex-shrink: 0;
  }

  .nav-links a {
    font-size: 0.875rem;
    color: var(--text-muted);
    transition: color 0.15s;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--text);
  }

  main {
    flex: 1;
    width: 100%;
  }

  footer {
    border-top: 1px solid var(--border);
    margin-top: auto;
  }

  .footer-inner {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.8125rem;
    color: var(--text-muted);
  }

  .footer-mid {
    color: var(--text-subtle);
  }

  .footer-link {
    font-size: 0.8125rem;
    color: var(--text-subtle);
    transition: color 0.15s;
  }

  .footer-link:hover {
    color: var(--text);
  }

  @media (max-width: 600px) {
    .nav-subtitle { display: none; }
    .footer-inner { flex-direction: column; align-items: flex-start; }
    .nav-links { gap: 16px; }
  }
</style>

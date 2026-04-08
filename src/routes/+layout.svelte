<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  // ── Typing animation ──────────────────────────────────
  const subtitles = [
    "The quantum fluctuations are particularly poetic today.",
    "Where we let researchers loose on ideas too weird for a roadmap.",
    "Foundational systems that quietly compound.",
    "Built by founders who see elegance in complexity.",
    "Formal verification securing billions in value.",
  ];

  let displayed = '';
  let subtitleIndex = 0;
  let charIndex = 0;
  let cursorVisible = true;

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  async function typeLoop() {
    while (true) {
      const target = subtitles[subtitleIndex];
      while (charIndex < target.length) {
        charIndex++;
        displayed = target.slice(0, charIndex);
        await sleep(38 + Math.random() * 25);
      }
      await sleep(2800);
      while (charIndex > 0) {
        charIndex--;
        displayed = target.slice(0, charIndex);
        await sleep(18 + Math.random() * 12);
      }
      await sleep(400);
      subtitleIndex = (subtitleIndex + 1) % subtitles.length;
    }
  }

  // ── Theme toggle ──────────────────────────────────────
  let isDark = true;

  function toggleTheme() {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  onMount(() => {
    // Restore saved theme
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      isDark = false;
      document.documentElement.setAttribute('data-theme', 'light');
    }

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
      <a href="/" class="nav-logo">escafandra</a>
      <div class="nav-subtitle">
        <span>{displayed}</span><span class="cursor" class:visible={cursorVisible}>_</span>
      </div>
    </div>
    <div class="nav-right">
      <div class="nav-links">
        <a href="/" class:active={isHome}>Home</a>
        <a href="/blog" class:active={isBlog}>Lab</a>
      </div>
      <button class="theme-toggle" on:click={toggleTheme} aria-label="Toggle theme">
        {#if isDark}
          <!-- Sun icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        {:else}
          <!-- Moon icon -->
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        {/if}
      </button>
    </div>
  </div>
</nav>

<main>
  <slot />
</main>

<footer>
  <div class="footer-inner">
    <span>© 2026 Escafandra · Temuco, Chile</span>
    <a href="https://en.wikipedia.org/wiki/AI_slop" class="footer-slop">Made with Claude. Long live slop.</a>
    <span>Embrace AI</span>
  </div>
</footer>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    transition: background 0.2s, border-color 0.2s;
  }

  .nav-inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .nav-brand {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }

  .nav-logo {
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.01em;
    line-height: 1.2;
    transition: color 0.15s;
  }

  .nav-logo:hover {
    color: var(--accent);
  }

  .nav-subtitle {
    font-size: 0.6875rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
    white-space: nowrap;
    overflow: hidden;
    height: 15px;
    line-height: 15px;
    margin-top: 1px;
  }

  .cursor {
    opacity: 0;
    transition: opacity 0.1s;
    color: var(--accent);
  }

  .cursor.visible {
    opacity: 1;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  .nav-links {
    display: flex;
    gap: 20px;
  }

  .nav-links a {
    font-size: 0.75rem;
    font-family: var(--font-body);
    color: var(--text-subtle);
    transition: color 0.15s;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-weight: 500;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--accent);
  }

  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    color: var(--text-subtle);
    cursor: pointer;
    padding: 4px;
    transition: color 0.15s, border-color 0.15s;
    line-height: 0;
  }

  .theme-toggle:hover {
    color: var(--accent);
    border-color: var(--accent);
  }

  main {
    flex: 1;
    width: 100%;
  }

  footer {
    position: sticky;
    bottom: 0;
    z-index: 100;
    background: var(--bg);
    border-top: 1px solid var(--border);
    transition: background 0.2s, border-color 0.2s;
  }

  .footer-inner {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 20px;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.6875rem;
    font-family: var(--font-mono);
    color: var(--text-subtle);
  }

  .footer-slop {
    color: var(--text-subtle);
    text-decoration: none;
    transition: color 0.15s;
  }

  .footer-slop:hover {
    color: var(--accent);
  }

  @media (max-width: 600px) {
    .nav-subtitle { display: none; }
    .nav-links { gap: 14px; }
  }
</style>

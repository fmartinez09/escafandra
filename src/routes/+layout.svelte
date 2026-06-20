<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let isDark = true;

  function toggleTheme() {
    isDark = !isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  onMount(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
      isDark = false;
      document.documentElement.setAttribute('data-theme', 'light');
    }
  });

  $: isHome = $page.url.pathname === '/';
  $: isBlog = $page.url.pathname.startsWith('/blog');
</script>

<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">fm</a>
    <div class="nav-right">
      <div class="nav-links">
        <a href="/" class:active={isHome}>Home</a>
        <a href="/blog" class:active={isBlog}>Blog</a>
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
    <span>© 2026 Fernando Martínez</span>
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
    max-width: 720px;
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
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-weight: 500;
    color: var(--text);
    letter-spacing: -0.01em;
    line-height: 1;
    transition: color 0.15s;
    font-style: italic;
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

  .nav-subtitle,
  .cursor { display: none; }

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
    font-size: 0.8125rem;
    font-family: var(--font-body);
    color: var(--text-subtle);
    transition: color 0.15s;
    letter-spacing: 0;
    text-transform: none;
    font-weight: 400;
  }

  .nav-links a:hover {
    color: var(--text);
  }

  .nav-links a.active {
    color: var(--text);
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
    margin-top: auto;
    background: var(--bg);
    border-top: 1px solid var(--border);
    transition: background 0.2s, border-color 0.2s;
  }

  .footer-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 0 20px;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 0.75rem;
    font-family: var(--font-body);
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

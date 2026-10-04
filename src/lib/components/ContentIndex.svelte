<script>
  import { page } from '$app/stores';
  import { filterByTag, getTags, tagHref } from '$lib/content-metadata.js';
  import TagList from './TagList.svelte';
  export let data;

  $: section = data.section;
  $: selectedTag = $page.url.searchParams.get('tag') ?? '';
  $: posts = filterByTag(data.posts, selectedTag);
  $: tags = getTags(data.posts);
</script>

<svelte:head>
  <title>{section.title} — Fernando Martínez</title>
</svelte:head>

<div class="content-index">
  <header>
    <h1>{section.title}</h1>
    <p class="description">{section.description}</p>
  </header>

  {#if tags.length || selectedTag}
  <nav class="tag-filters" aria-label="Filter by tag">
    <a href="/{section.id}" class:active={!selectedTag} aria-current={!selectedTag ? 'true' : undefined}>
      All <span>{data.posts.length}</span>
    </a>
    {#each tags as tag}
      <a href={tagHref(section.id, tag)} class:active={selectedTag === tag}
        aria-current={selectedTag === tag ? 'true' : undefined}>
        {tag} <span>{filterByTag(data.posts, tag).length}</span>
      </a>
    {/each}
  </nav>
  {/if}

  <div class="posts-list" aria-live="polite">
    {#each posts as post}
      <article class="post-item">
        <div class="post-meta">
          <TagList tags={post.tags} section={section.id} />
          {#if post.date}<span class="post-date">{post.date}</span>{/if}
        </div>
        <a class="post-link" href={post.href}>
          <h2>{post.title}</h2>
          {#if post.summary}<p class="post-summary">{post.summary}</p>{/if}
        </a>
      </article>
    {:else}
      <div class="empty">
        <p>{selectedTag ? `No ${section.title.toLowerCase()} tagged “${selectedTag}” yet.` : section.empty}</p>
        {#if selectedTag}<a href="/{section.id}">View all {section.title.toLowerCase()} →</a>{/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .content-index { max-width: 720px; margin: 0 auto; padding: 0 20px; }
  header { padding: 56px 0 32px; border-bottom: 1px solid var(--border); }
  h1 {
    font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 2.75rem);
    font-weight: 500; letter-spacing: -0.02em; line-height: 1.1;
    color: var(--text); margin-bottom: 12px;
  }
  .description { color: var(--text-muted); font-size: 0.875rem; max-width: 580px; }
  .tag-filters { display: flex; flex-wrap: wrap; gap: 8px; padding: 24px 0; border-bottom: 1px solid var(--border); }
  .tag-filters a {
    font-size: 0.6875rem; line-height: 1.6; color: var(--text-muted);
    border: 1px solid var(--border); border-radius: 4px; padding: 5px 8px;
    transition: color 0.15s, border-color 0.15s;
  }
  .tag-filters a:hover, .tag-filters a.active { color: var(--accent); border-color: var(--accent); }
  .tag-filters a.active { background: var(--accent-muted); }
  .tag-filters span { margin-left: 5px; font-family: var(--font-mono); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
  .posts-list { padding-bottom: 56px; }
  .post-item { padding: 22px 0; border-bottom: 1px solid var(--border); }
  .post-meta { display: flex; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; }
  .post-date { font-size: 0.6875rem; color: var(--text-subtle); font-family: var(--font-mono); }
  h2 {
    font-family: var(--font-heading); font-size: 1.2rem; font-weight: 500;
    letter-spacing: -0.01em; line-height: 1.3; color: var(--text);
    margin-bottom: 6px; transition: color 0.15s;
  }
  .post-link:hover h2 { color: var(--accent); }
  .post-summary { font-size: 0.875rem; color: var(--text-muted); line-height: 1.55; max-width: 560px; }
  .empty { padding: 32px 0; color: var(--text-muted); font-size: 0.875rem; }
  .empty a { display: inline-block; margin-top: 10px; color: var(--accent); }
</style>

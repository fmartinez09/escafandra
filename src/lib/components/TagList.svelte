<script>
  import { tagHref } from '$lib/content-metadata.js';
  export let tags = [];
  export let section = 'notes';
</script>

{#if tags.length}
  <ul class="tags" aria-label="Article tags">
    {#each tags as tag}
      <li><a href={tagHref(section, tag)}>{tag}</a></li>
    {/each}
  </ul>
{/if}

<style>
  .tags { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; }
  a {
    display: inline-block;
    font-size: 0.625rem;
    font-family: var(--font-mono);
    line-height: 1.6;
    color: var(--text-muted);
    background: var(--bg-elevated);
    padding: 3px 7px;
    border: 1px solid var(--border);
    border-radius: 3px;
    transition: color 0.15s, border-color 0.15s;
  }
  a:hover { color: var(--accent); border-color: var(--accent); }
  a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
</style>

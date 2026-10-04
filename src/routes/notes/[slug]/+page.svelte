<script>
  import Article from '$lib/components/Article.svelte';
  export let data;
</script>

{#key data.meta}
  <Article {data} section="notes" />
{/key}

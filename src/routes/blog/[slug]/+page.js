export async function load({ params }) {
  try {
    const post = await import(`../../../posts/${params.slug}.md`);
    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    return {
      status: 404,
      error: new Error(`Post not found: ${params.slug}`),
    };
  }
}

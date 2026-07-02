export async function load({ params }) {
  try {
    const post = await import(`../../../projects/${params.slug}.md`);
    return {
      content: post.default,
      meta: post.metadata,
    };
  } catch (e) {
    return {
      status: 404,
      error: new Error(`Project article not found: ${params.slug}`),
    };
  }
}

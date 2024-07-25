import BlogPostFeed from "@/components/BlogPostFeed";
import { getBlogPosts } from "@/lib/notion";

export default async function Page() {
  const initialPosts = await getBlogPosts();
  return (
    <div>
      <BlogPostFeed
        initialPosts={initialPosts.posts}
        initialNextCursor={initialPosts.next_cursor}
      />
    </div>
  );
}

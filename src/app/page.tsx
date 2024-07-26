import BlogPostFeed from "@/components/BlogPostFeed";
import { config } from "@/config";
import { getBlogPosts } from "@/lib/notion";

export const revalidate = config.revalidateSeconds;

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

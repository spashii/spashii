import BlogPostFeed from "@/components/BlogPostFeed";
import { getAllBlogPosts } from "@/lib/notion";

export const dynamic = "force-static";
export const revalidate = 1800;

export default async function Page() {
  const initialPosts = await getAllBlogPosts();

  return (
    <div>
      <BlogPostFeed initialPosts={initialPosts} initialNextCursor={undefined} />
    </div>
  );
}

import { config } from "@/config";
import { getAllBlogPosts } from "@/lib/notion";
import { signOgImageUrl } from "@/lib/og-image";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateMetadata() {
  return {
    title: "Tags",
    description: "Different blog post categories",
    openGraph: {
      title: "Tags",
      description: "Different blog post categories",
      images: [
        signOgImageUrl({
          title: "Blog Post Categories",
          brand: config.blog.name,
        }),
      ],
    },
  };
}

export default async function Page() {
  const allPosts = await getAllBlogPosts();

  const tags = new Set<string>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag.name));
  });

  return (
    <div>
      <div className="">
        <h1 className="mb-2 text-5xl font-bold">Tags</h1>
        <p className="text-lg opacity-50">List of all tags</p>
      </div>
      <div className="my-10 max-w-6xl text-balance text-center text-xl mb-48 flex gap-8 flex-wrap">
        {Array.from(tags)
          .sort()
          .map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="text-primary inline-block"
            >
              #{tag}
            </Link>
          ))}
      </div>
    </div>
  );
}

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

  const tagCounts = new Map<string, number>();
  allPosts.forEach((post) => {
    post.tags.forEach((tag) => {
      if (tagCounts.has(tag.name)) {
        tagCounts.set(tag.name, (tagCounts.get(tag.name) ?? 0) + 1);
      } else {
        tagCounts.set(tag.name, 1);
      }
    });
  });

  return (
    <div>
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-bold">Tags</h1>
        <p className="text-lg opacity-50">List of all tags</p>
      </div>
      <div className="my-10 max-w-6xl text-center text-xl mb-48 flex gap-8 flex-wrap justify-center">
        {Array.from(tagCounts.entries())
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([tag, count]) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="text-primary inline-block"
            >
              #{tag} ({count})
            </Link>
          ))}
      </div>
    </div>
  );
}

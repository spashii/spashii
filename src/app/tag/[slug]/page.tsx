import { BlogPostPreviewGrid } from "@/components/BlogPostPreview";

import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts } from "@/lib/notion";
import { wisp } from "@/lib/wisp";
import { CircleX } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = 1800;

interface Params {
  slug: string;
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  return {
    title: `#${slug}`,
    description: `Posts tagged with #${slug}`,
  };
}

const Page = async ({
  params: { slug },
  searchParams,
}: {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const allPosts = await getAllBlogPosts();

  const results = allPosts.filter((post) =>
    post.tags.some((tag) => tag.name === slug)
  );

  return (
    <div className="mb-16">
      <Link href="/">
        <Badge className="px-2 py-1 my-6">
          <CircleX className="inline-block w-4 h-4 mr-2" />
          Posts tagged with <strong className="mx-2">#{slug}</strong>{" "}
        </Badge>
      </Link>
      <BlogPostPreviewGrid posts={results} />
    </div>
  );
};

export default Page;

import { BlogPostContent } from "@/components/BlogPostContent";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import {
  getAllBlogPosts,
  getPageContentById,
  getPagePropertiesById,
  // getPageContentById,
  getPagePropertiesBySlug,
  getRelatedPostsBySlug,
} from "@/lib/notion";
import { signOgImageUrl } from "@/lib/og-image";
import { notFound, redirect } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

// revalidate
export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateStaticParams() {
  // Fetch all possible slugs
  const results = await getAllBlogPosts();

  // Generate static paths
  return [
    ...results.map(({ id }) => ({
      params: { id },
    })),
  ];
}

interface Params {
  id: string;
}

const Page = async ({ params: { id } }: { params: Params }) => {
  const pageProperties = await getPagePropertiesById(id);

  if (!pageProperties) {
    return notFound();
  }

  const slug = pageProperties.slug;
  return redirect(`/blog/${slug}`);
};

export default Page;

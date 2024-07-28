import { BlogPostContent } from "@/components/BlogPostContent";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import {
  getAllBlogPosts,
  getPageContentById,
  // getBlocks,
  getPagePropertiesBySlug,
  getRelatedPostsBySlug,
} from "@/lib/notion";
import { signOgImageUrl } from "@/lib/og-image";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

// revalidate
export const dynamic = "force-static";
export const revalidate = 1800;

export async function generateStaticParams() {
  // Fetch all possible slugs
  const results = await getAllBlogPosts();

  console.log(
    "render pages",
    results.map(({ slug }) => slug)
  );

  // Generate static paths
  return results.map(({ slug }) => ({
    params: { slug },
  }));
}

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  const result = await getPagePropertiesBySlug(slug);

  const { title, description, image } = result;
  const generatedOgImage = signOgImageUrl({ title, brand: config.blog.name });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: image ? [image, generatedOgImage] : [generatedOgImage],
    },
  };
}

interface Params {
  slug: string;
}

const Page = async ({ params: { slug } }: { params: Params }) => {
  let pageProperties: BlogPost;
  try {
    pageProperties = await getPagePropertiesBySlug(slug);
  } catch {
    return notFound();
  }

  const [pageContent, relatedPosts] = await Promise.all([
    // getBlocks(pageProperties.id),
    getPageContentById(pageProperties.id),
    getRelatedPostsBySlug(slug),
  ]);

  const { title, publishedAt, updatedAt, image } = pageProperties;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    image: image ? image : undefined,
    datePublished: publishedAt ? publishedAt.toString() : undefined,
    dateModified: updatedAt.toString(),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div>
        <BlogPostContent
          pageContent={pageContent}
          pageProperties={pageProperties}
        />

        <RelatedPosts posts={relatedPosts} />
      </div>
    </>
  );
};

export default Page;

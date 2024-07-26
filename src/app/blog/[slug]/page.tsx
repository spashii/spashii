import { BlogPostContent } from "@/components/BlogPostContent";
import { RelatedPosts } from "@/components/RelatedPosts";
import { config } from "@/config";
import {
  getPageContentById,
  getPagePropertiesBySlug,
  getRelatedPostsBySlug,
} from "@/lib/notion";
import { signOgImageUrl } from "@/lib/og-image";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";

export async function generateMetadata({
  params: { slug },
}: {
  params: Params;
}) {
  const result = await getPagePropertiesBySlug(slug);
  if (!result) {
    return {
      title: "Blog post not found",
    };
  }

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

// revalidate
export const revalidate = config.revalidateSeconds;

const Page = async ({ params: { slug } }: { params: Params }) => {
  const pageProperties = await getPagePropertiesBySlug(slug);

  if (!pageProperties) {
    return notFound();
  }

  const [pageContent, relatedPosts] = await Promise.all([
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

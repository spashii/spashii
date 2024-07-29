import { config } from "@/config";
import { getAllBlogPosts } from "@/lib/notion";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const result: BlogPost[] = await getAllBlogPosts();

  return [
    {
      url: urlJoin(config.baseUrl, "journal"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result.map((post) => {
      return {
        url: urlJoin(config.baseUrl, "journal", post.slug),
        lastModified: new Date(post.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}

// const allPosts = await getAllBlogPosts();

import { config } from "@/config";
import { getAllBlogPosts } from "@/lib/notion";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts: BlogPost[] = await getAllBlogPosts();

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

  return [
    {
      url: urlJoin(config.baseUrl, "tag"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...Array.from(tagCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([tag, _]) => {
        return {
          url: urlJoin(config.baseUrl, "tag", tag),
          lastModified: new Date(),
          priority: 0.8,
        };
      }),
  ];
}

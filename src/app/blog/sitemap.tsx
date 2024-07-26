import { config } from "@/config";
import { getBlogPosts } from "@/lib/notion";
import { wisp } from "@/lib/wisp";
import type { MetadataRoute } from "next";
import urlJoin from "url-join";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let result: BlogPost[] = [];

  let prev_next_cursor: string = "";
  while (true) {
    const { posts, has_more, next_cursor } = await getBlogPosts(
      prev_next_cursor != "" ? prev_next_cursor : undefined,
      10
    );

    prev_next_cursor = next_cursor ?? "";

    result = [...result, ...posts];

    if (!has_more) {
      break;
    }
  }

  return [
    {
      url: urlJoin(config.baseUrl, "blog"),
      lastModified: new Date(),
      priority: 0.8,
    },
    ...result.map((post) => {
      return {
        url: urlJoin(config.baseUrl, "blog", post.slug),
        lastModified: new Date(post.updatedAt),
        priority: 0.8,
      };
    }),
  ];
}

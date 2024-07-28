export const revalidate = 60 * 60; // 1 hour

import { NextResponse } from "next/server";
import RSS from "rss";
import urlJoin from "url-join";
import { config } from "@/config";
import { getAllBlogPosts } from "@/lib/notion";

const baseUrl = config.baseUrl;

export async function GET() {
  const result = await getAllBlogPosts();

  const posts = result.map((post) => {
    return {
      title: post.title,
      description: post.description || "",
      url: urlJoin(baseUrl, `/journal/id/${post.id}`),
      date: post.publishedAt || new Date(),
    };
  });

  const feed = new RSS({
    title: config.blog.name,
    description: config.blog.metadata.description,
    site_url: baseUrl,
    feed_url: urlJoin(baseUrl, "/rss"),
    pubDate: new Date(),
  });
  posts.forEach((post) => {
    feed.item(post);
  });

  const xml: string = feed.xml({ indent: true });

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET",
    },
  });
}

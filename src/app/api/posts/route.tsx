import { NextResponse } from "next/server";
import { getBlogPosts, notionToWisp } from "@/lib/notion";

export type GetPostsResponse = {
  posts: BlogPost[];
  next_cursor: string | undefined;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") ?? undefined;
  const limit = searchParams.get("limit") ?? 10;

  const response = await getBlogPosts(cursor, Number(limit));

  return NextResponse.json<GetPostsResponse>(response);
}

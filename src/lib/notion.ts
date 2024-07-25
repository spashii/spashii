import { Client } from "@notionhq/client";
import { GetPostResult, GetPostsResult } from "@wisp-cms/client";

const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
  throw new Error("NOTION_API_KEY is not set");
}

const notion = new Client({ auth: apiKey });

export async function getBlogPosts(
  start_cursor: string | undefined = undefined,
  page_size: number = 5
) {
  const blogPosts = await notion.databases.query({
    page_size,
    start_cursor,
    database_id: "1748c1c8e5d64a2782209ad917ad83d8",
    sorts: [
      {
        property: "When",
        direction: "descending",
      },
    ],
    filter: {
      and: [
        {
          property: "Project",
          relation: {
            contains: "64b6780a-3221-4e50-88d2-15e6760d893f",
          },
        },
        {
          property: "Publish",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
  });

  return {
    posts: blogPosts.results.map((post) => notionToWisp(post)),
    has_more: blogPosts.has_more,
    next_cursor: blogPosts.next_cursor ?? undefined,
  };
}

export function notionToWisp(notionData: any): BlogPost {
  const wispObject = {
    id: notionData.id,
    createdAt: new Date(notionData.created_time),
    teamId: notionData.created_by?.id ?? "",
    description:
      notionData.properties.Description?.rich_text?.[0]?.plain_text ?? null,
    title: notionData.properties.Name?.title?.[0]?.plain_text ?? "Untitled",
    slug: notionData.properties.Slug?.formula?.string ?? "",
    image: null, // Assuming you don't have an image property in your Notion data
    authorId: notionData.created_by?.id ?? "",
    updatedAt: new Date(notionData.last_edited_time),
    publishedAt: notionData.properties.When?.date?.start
      ? new Date(notionData.properties.When.date.start)
      : null,
    tags:
      notionData.properties.Tags?.multi_select?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
      })) ?? [],
  };

  return wispObject;
}

import { cache } from "react";
import { Client } from "@notionhq/client";
// @ts-ignore
import { NotionCompatAPI } from "notion-compat";

const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
  throw new Error("NOTION_API_KEY is not set");
}

const notion = new Client({ auth: apiKey });
const notionClientForPageContent = new NotionCompatAPI(
  new Client({ auth: apiKey })
);

export const getPageContentById = cache(async (id: string) => {
  const page = await notionClientForPageContent.getPage(id);
  return page;
});

export const getPagePropertiesBySlug = cache(async (slug: string) => {
  const results = await notion.databases.query({
    database_id: "1748c1c8e5d64a2782209ad917ad83d8",
    filter: {
      and: [
        {
          property: "Slug",
          formula: {
            string: {
              equals: slug,
            },
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

  if (results.results.length === 0) {
    return null;
  }

  return notionToBlogPost(results.results[0]);
});

export const getRelatedPostsBySlug = cache(
  async (slug: string, limit: number = 3) => {
    const post = await getPagePropertiesBySlug(slug);

    if (!post) {
      return [];
    }

    const relatedPosts = await notion.databases.query({
      database_id: "1748c1c8e5d64a2782209ad917ad83d8",
      filter: {
        and: [
          {
            or: post.tags.map((tag) => ({
              property: "Tags",
              multi_select: {
                contains: tag.id,
              },
            })),
          },
          {
            property: "Publish",
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "When",
          direction: "descending",
        },
      ],
      page_size: limit,
    });

    return relatedPosts.results
      .map((post) => notionToBlogPost(post))
      .filter((p) => p.id !== post.id);
  }
);

export const getBlogPosts = cache(
  async (
    start_cursor: string | undefined = undefined,
    page_size: number = 5
  ) => {
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
      posts: blogPosts.results.map((post) => notionToBlogPost(post)),
      has_more: blogPosts.has_more,
      next_cursor: blogPosts.next_cursor ?? undefined,
    };
  }
);

function getFullPlainTextString(title: any) {
  return title?.map((text: any) => text.plain_text).join(" ") ?? "Untitled";
}

export function notionToBlogPost(notionData: any): BlogPost {
  const wispObject = {
    id: notionData.id,
    createdAt: new Date(notionData.created_time),
    teamId: notionData.created_by?.id ?? "",
    title: getFullPlainTextString(notionData.properties.Name?.title),
    description: getFullPlainTextString(
      notionData.properties.Description?.rich_text
    ),
    slug: notionData.properties.Slug?.formula?.string ?? "",
    image: notionData.properties.Image?.files[0]?.file?.url ?? "",
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

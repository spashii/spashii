import "server-only";

import { cache } from "react";
import { Client } from "@notionhq/client";
import { getRandomInt } from "./utils";
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

export const getPage = cache(async (pageId: string) => {
  const response = await notion.pages.retrieve({ page_id: pageId });
  return response;
});

export const getBlocks = cache(async (blockID: string) => {
  const blockId = blockID.replace(/-/g, "");

  const parentBlocks: any[] = [];
  let hasMore = true;
  let nextCursor = undefined;

  while (hasMore) {
    const { results, has_more, next_cursor } =
      await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
        start_cursor: nextCursor ?? undefined,
      });
    parentBlocks.push(...results);
    hasMore = has_more;
    nextCursor = next_cursor;
  }

  // Fetches all child blocks recursively
  // be mindful of rate limits if you have large amounts of nested blocks
  // See https://developers.notion.com/docs/working-with-page-content#reading-nested-blocks
  const childBlocks: any = await Promise.all(
    parentBlocks.map(async (block) => {
      if ((block as any).has_children) {
        const children = await getBlocks(block.id);
        return { ...block, children };
      }
      return block;
    })
  );

  return childBlocks;

  return childBlocks.reduce((acc: any[], curr: any) => {
    if (curr.type === "bulleted_list_item") {
      if (acc[acc.length - 1]?.type === "bulleted_list") {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: getRandomInt(10 * 99, 10 * 100).toString(),
          type: "bulleted_list",
          bulleted_list: { children: [curr] },
        });
      }
    } else if (curr.type === "numbered_list_item") {
      if (acc[acc.length - 1]?.type === "numbered_list") {
        acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
      } else {
        acc.push({
          id: getRandomInt(10 * 99, 10 * 100).toString(),
          type: "numbered_list",
          numbered_list: { children: [curr] },
        });
      }
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as any[]);
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
    throw new Error("Post not found");
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

export const getAllBlogPosts = cache(async () => {
  let has_more = true;
  let next_cursor: string | undefined = undefined;
  let posts: BlogPost[] = [];

  while (has_more) {
    const {
      posts: newPosts,
      has_more: newHasMore,
      next_cursor: newCursor,
    } = await getBlogPosts(next_cursor, 100);
    posts.push(...newPosts);
    has_more = newHasMore;
    next_cursor = newCursor;
  }

  return posts;
});

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

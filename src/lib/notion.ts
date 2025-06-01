import { cache } from 'react'
import { Client } from '@notionhq/client'
// @ts-ignore
import { NotionCompatAPI } from 'notion-compat'

const NOTION_API_KEY = import.meta.env.NOTION_API_KEY
const NOTION_DATABASE_ID = import.meta.env.NOTION_DATABASE_ID
const NOTION_PROJECT_ID = import.meta.env.NOTION_PROJECT_ID

if (import.meta.env.NOTION_API_KEY == null) {
  throw new Error('Missing NOTION_API_KEY environment variable.')
}
if (import.meta.env.NOTION_DATABASE_ID == null) {
  throw new Error('Missing NOTION_DATABASE_ID environment variable.')
}
if (import.meta.env.NOTION_PROJECT_ID == null) {
  throw new Error('Missing NOTION_PROJECT_ID environment variable.')
}

const notion = new Client({ auth: NOTION_API_KEY })

const notionClientForPageContent = new NotionCompatAPI(
  new Client({ auth: NOTION_API_KEY }),
)

export interface JournalPost {
  id: string
  createdAt: string
  teamId: string
  title: string
  description: string
  slug: string
  image: string
  authorId: string
  updatedAt: string
  publishedAt: string | null
  tags: { id: string; name: string }[]
}

export const getPagePropertiesById = cache(async (id: string) => {
  const page = await notion.pages.retrieve({ page_id: id })

  if (!page) {
    throw new Error('Post not found')
  }

  // @ts-ignore
  if (!page.properties.Publish.checkbox) {
    throw new Error(`Page is not published: ${id}`)
  }

  return notionToJournalPost(page)
})

export const getPageContentById = cache(async (id: string) => {
  try {
    const page = await notionClientForPageContent.getPage(id)

    if (!page) {
      throw new Error('Post not found')
    }

    // @ts-ignore
    if (!page.raw.page.properties.Publish.checkbox) {
      throw new Error(`Page is not published: ${id}`)
    }

    return page
  } catch (error) {
    console.error(`Error fetching page content for ${id}:`, error)
    // Return a minimal page structure to prevent build failures
    return {
      recordMap: {
        block: {},
        notion_user: {},
        collection: {},
        collection_view: {},
        space: {},
      },
    }
  }
})

export const getRelatedPostsById = cache(
  async (id: string, limit: number = 3) => {
    const post = await getPagePropertiesById(id)

    if (!post) {
      return []
    }

    const relatedPosts = await notion.databases.query({
      database_id: NOTION_DATABASE_ID!,
      filter: {
        and: [
          {
            or: [
              ...post.tags.map((tag) => ({
                property: 'Tags',
                multi_select: {
                  contains: tag.name,
                },
              })),
            ],
          },
          {
            property: 'Publish',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: 'When',
          direction: 'descending',
        },
      ],
      page_size: limit,
    })

    return relatedPosts.results
      .map((post) => notionToJournalPost(post))
      .filter((p) => p.id !== post.id)
  },
)

export const getJournalPosts = cache(
  async (
    start_cursor: string | undefined = undefined,
    page_size: number = 10,
  ) => {
    const journalPosts = await notion.databases.query({
      page_size,
      start_cursor,
      database_id: NOTION_DATABASE_ID!,
      sorts: [
        {
          property: 'When',
          direction: 'descending',
        },
      ],
      filter: {
        and: [
          {
            property: 'Project',
            relation: {
              contains: NOTION_PROJECT_ID!,
            },
          },
          {
            property: 'Publish',
            checkbox: {
              equals: true,
            },
          },
        ],
      },
    })

    return {
      posts: journalPosts.results.map((post) => notionToJournalPost(post)),
      has_more: journalPosts.has_more,
      next_cursor: journalPosts.next_cursor ?? undefined,
    }
  },
)

export const getAllJournalPosts = cache(async () => {
  let has_more = true
  let next_cursor: string | undefined = undefined
  let posts: JournalPost[] = []

  while (has_more) {
    const {
      posts: newPosts,
      has_more: newHasMore,
      next_cursor: newCursor,
    } = await getJournalPosts(next_cursor, 100)
    posts.push(...newPosts)
    has_more = newHasMore
    next_cursor = newCursor
  }

  return posts
})

function getFullPlainTextString(
  title: { plain_text: string }[] | undefined | null,
) {
  if (!title || !Array.isArray(title)) {
    return 'Untitled'
  }
  return title.map((text) => text?.plain_text || '').join(' ') || 'Untitled'
}

export function notionToJournalPost(notionData: any): JournalPost {
  const post = {
    id: notionData.id,
    createdAt: new Date(notionData.created_time).toISOString(),
    teamId: notionData.created_by?.id ?? '',
    title: getFullPlainTextString(notionData.properties.Name?.title),
    description: getFullPlainTextString(
      notionData.properties.Description?.rich_text,
    ),
    // TODO: add slug
    slug: notionData.id,
    image: notionData.properties.Image?.files[0]?.file?.url ?? '',
    authorId: notionData.created_by?.id ?? '',
    updatedAt: new Date(notionData.last_edited_time).toISOString(),
    publishedAt: notionData.properties.When?.date?.start
      ? new Date(notionData.properties.When.date.start).toISOString()
      : null,
    tags:
      notionData.properties.Tags?.multi_select?.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
      })) ?? [],
  }

  return post
}

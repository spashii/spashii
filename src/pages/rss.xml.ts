import { SITE } from '@/consts'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getAllJournalPosts } from '@/lib/notion'

export async function GET(context: APIContext) {
  try {
    const posts = await getAllJournalPosts()

    return rss({
      title: SITE.title,
      description: SITE.description,
      site: context.site ?? SITE.href,
      items: posts.map((post) => ({
        title: post.title,
        description: post.description,
        pubDate: new Date(post.publishedAt || post.createdAt),
        link: `/journal/${post.slug}/`,
      })),
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}

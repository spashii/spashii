// @ts-ignore
import FlexSearch from 'flexsearch'
import type { JournalPost } from './notion'

export interface SearchablePost extends JournalPost {
  content?: string
  type: 'journal'
}

export interface SearchableProject {
  id: string
  title: string
  description: string
  slug: string
  tags: string[]
  type: 'project'
  content?: string
}

export interface SearchableContent {
  id: string
  title: string
  description: string
  slug: string
  tags: { id: string; name: string }[] | string[]
  type: 'journal' | 'project' | 'video'
  content?: string
  publishedAt?: string | null
  createdAt: string
}

export interface SearchResult {
  id: string
  title: string
  description: string
  slug: string
  tags: { id: string; name: string }[] | string[]
  publishedAt?: string | null
  createdAt: string
  type: 'journal' | 'project' | 'video'
  score?: number
}

export interface CategorizedSearchResults {
  results: {
    journal: SearchResult[]
    project: SearchResult[]
    video: SearchResult[]
  }
  totalCount: number
}

class SearchService {
  private index: any
  private content: Map<string, SearchableContent> = new Map()
  private initialized = false

  constructor() {
    // @ts-ignore
    this.index = new FlexSearch.Index({
      tokenize: 'forward',
      resolution: 9,
    })
  }

  async initialize(content: SearchableContent[]) {
    if (this.initialized) return

    this.content.clear()

    for (const item of content) {
      // Store the content for retrieval
      this.content.set(item.id, item)

      // Create searchable content combining title, description, tags, and content
      const tagNames = Array.isArray(item.tags)
        ? item.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
        : []

      const searchableText = [
        item.title,
        item.description,
        ...tagNames,
        item.content || '',
      ].join(' ')

      // Add to search index
      this.index.add(item.id, searchableText)
    }

    this.initialized = true
  }

  search(query: string, limit: number = 20): CategorizedSearchResults {
    if (!this.initialized || !query.trim()) {
      return {
        results: {
          journal: [],
          project: [],
          video: [],
        },
        totalCount: 0,
      }
    }

    const results = this.index.search(query, { limit })

    const searchResults = (results as string[])
      .map((id: string) => {
        const item = this.content.get(id)
        if (!item) return null

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.slug,
          tags: item.tags || [],
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          type: item.type,
        }
      })
      .filter(Boolean) as SearchResult[]

    // Categorize results by type
    const categorized: CategorizedSearchResults = {
      results: {
        journal: searchResults.filter((r) => r.type === 'journal'),
        project: searchResults.filter((r) => r.type === 'project'),
        video: searchResults.filter((r) => r.type === 'video'),
      },
      totalCount: searchResults.length,
    }

    return categorized
  }

  searchByTag(tagName: string): CategorizedSearchResults {
    const results: SearchResult[] = []

    for (const item of this.content.values()) {
      const tagNames = Array.isArray(item.tags)
        ? item.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
        : []

      if (tagNames.some((tag) => tag.toLowerCase() === tagName.toLowerCase())) {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.slug,
          tags: item.tags || [],
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          type: item.type,
        })
      }
    }

    // Sort by date
    const sortedResults = results.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })

    // Categorize results by type
    return {
      results: {
        journal: sortedResults.filter((r) => r.type === 'journal'),
        project: sortedResults.filter((r) => r.type === 'project'),
        video: sortedResults.filter((r) => r.type === 'video'),
      },
      totalCount: sortedResults.length,
    }
  }

  getAllTags(): { name: string; count: number; types: string[] }[] {
    const tagData = new Map<string, { count: number; types: Set<string> }>()

    for (const item of this.content.values()) {
      const tagNames = Array.isArray(item.tags)
        ? item.tags.map((tag) => (typeof tag === 'string' ? tag : tag.name))
        : []

      for (const tagName of tagNames) {
        const existing = tagData.get(tagName) || { count: 0, types: new Set() }
        existing.count += 1
        existing.types.add(item.type)
        tagData.set(tagName, existing)
      }
    }

    return Array.from(tagData.entries())
      .map(([name, data]) => ({
        name,
        count: data.count,
        types: Array.from(data.types),
      }))
      .sort((a, b) => b.count - a.count)
  }

  getContentByType(type: 'journal' | 'project' | 'video'): SearchResult[] {
    const results: SearchResult[] = []

    for (const item of this.content.values()) {
      if (item.type === type) {
        results.push({
          id: item.id,
          title: item.title,
          description: item.description,
          slug: item.slug,
          tags: item.tags || [],
          publishedAt: item.publishedAt,
          createdAt: item.createdAt,
          type: item.type,
        })
      }
    }

    return results.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt)
      const dateB = new Date(b.publishedAt || b.createdAt)
      return dateB.getTime() - dateA.getTime()
    })
  }
}

// Create a singleton instance
export const searchService = new SearchService()

// Utility function to convert journal posts to searchable content
export function journalPostToSearchableContent(
  post: JournalPost,
  content?: string,
): SearchableContent {
  return {
    id: post.id,
    title: post.title,
    description: post.description,
    slug: post.slug,
    tags: post.tags || [],
    type: 'journal',
    content,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
  }
}

// Utility function to extract text content from Notion blocks
export function extractTextFromNotionBlocks(blocks: any[]): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  return blocks
    .map((block) => {
      if (block.type === 'text') return block.text
      if (block.type === 'paragraph' && block.paragraph?.rich_text) {
        return block.paragraph.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      if (block.type === 'heading_1' && block.heading_1?.rich_text) {
        return block.heading_1.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      if (block.type === 'heading_2' && block.heading_2?.rich_text) {
        return block.heading_2.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      if (block.type === 'heading_3' && block.heading_3?.rich_text) {
        return block.heading_3.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      if (
        block.type === 'bulleted_list_item' &&
        block.bulleted_list_item?.rich_text
      ) {
        return block.bulleted_list_item.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      if (
        block.type === 'numbered_list_item' &&
        block.numbered_list_item?.rich_text
      ) {
        return block.numbered_list_item.rich_text
          .map((text: any) => text.plain_text)
          .join('')
      }
      return ''
    })
    .join(' ')
}

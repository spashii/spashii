import React, { useEffect, useState } from 'react'
import SearchBox from './ui/search'
import {
  searchService,
  journalPostToSearchableContent,
  type CategorizedSearchResults,
} from '@/lib/search'
import type { JournalPost } from '@/lib/notion'

interface SearchProviderProps {
  posts: JournalPost[]
  className?: string
  onTagClick?: (tag: string) => void
}

const SearchProvider: React.FC<SearchProviderProps> = ({
  posts,
  className,
  onTagClick,
}) => {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initializeSearch = async () => {
      // Convert journal posts to searchable content
      const searchableContent = posts.map((post) =>
        journalPostToSearchableContent(post),
      )

      // TODO: Add projects and videos data here when available
      // const projectContent = projects.map(project => projectToSearchableContent(project))
      // const videoContent = videos.map(video => videoToSearchableContent(video))
      // searchableContent.push(...projectContent, ...videoContent)

      await searchService.initialize(searchableContent)
      setIsInitialized(true)
    }

    initializeSearch()
  }, [posts])

  const handleSearch = (query: string): CategorizedSearchResults => {
    if (!isInitialized) {
      return {
        results: {
          journal: [],
          project: [],
          video: [],
        },
        totalCount: 0,
      }
    }

    return searchService.search(query)
  }

  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag)
    } else {
      // Default behavior: navigate to tag page
      window.location.href = `/tags/${encodeURIComponent(tag)}`
    }
  }

  if (!isInitialized) {
    return (
      <div className={className}>
        <div className="relative">
          <div className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2">
            <div className="border-muted-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
          <input
            disabled
            placeholder="Loading search..."
            className="border-input bg-background w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm opacity-50"
          />
        </div>
      </div>
    )
  }

  return (
    <SearchBox
      onSearch={handleSearch}
      onTagClick={handleTagClick}
      className={className}
    />
  )
}

export default SearchProvider

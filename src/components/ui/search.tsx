import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Hash, Calendar, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CategorizedSearchResults } from '@/lib/search'

interface SearchProps {
  onSearch: (query: string) => CategorizedSearchResults
  onTagClick?: (tag: string) => void
  placeholder?: string
  className?: string
}

const SearchBox: React.FC<SearchProps> = ({
  onSearch,
  onTagClick,
  placeholder = 'Search posts, tags, and content...',
  className,
}) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CategorizedSearchResults | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    if (searchQuery.trim()) {
      const searchResults = onSearch(searchQuery)
      setResults(searchResults)
      setIsOpen(true)
    } else {
      setResults(null)
      setIsOpen(false)
    }
  }

  const handleClear = () => {
    setQuery('')
    setResults(null)
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const getTotalResults = () => {
    if (!results) return 0
    return (
      results.results.journal.length +
      results.results.project.length +
      results.results.video.length
    )
  }

  const getIcon = (type: 'journal' | 'project' | 'video') => {
    switch (type) {
      case 'journal':
        return <FileText className="h-4 w-4" />
      case 'project':
        return <Hash className="h-4 w-4" />
      case 'video':
        return <Calendar className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring w-full rounded-lg border py-2.5 pr-10 pl-10 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
        />
        {query && (
          <button
            onClick={handleClear}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results && getTotalResults() > 0 && (
        <div className="bg-popover absolute top-full z-50 mt-1 max-h-96 w-full overflow-y-auto rounded-lg border shadow-lg">
          <div className="border-b p-3">
            <span className="text-muted-foreground text-sm">
              {getTotalResults()} result{getTotalResults() !== 1 ? 's' : ''}{' '}
              found
            </span>
          </div>

          {/* Journal Results */}
          {results.results.journal.length > 0 && (
            <div className="p-2">
              <div className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-medium">
                {getIcon('journal')}
                Journal ({results.results.journal.length})
              </div>
              {results.results.journal.map((item) => (
                <a
                  key={item.id}
                  href={`/journal/${item.slug}`}
                  className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {item.description}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {formatDate(item.publishedAt || item.createdAt)}
                    </span>
                    {Array.isArray(item.tags) && item.tags.length > 0 && (
                      <div className="flex gap-1">
                        {item.tags.slice(0, 2).map((tag) => {
                          const tagName =
                            typeof tag === 'string' ? tag : tag.name
                          return (
                            <span
                              key={typeof tag === 'string' ? tag : tag.id}
                              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                onTagClick?.(tagName)
                                setIsOpen(false)
                              }}
                            >
                              #{tagName}
                            </span>
                          )
                        })}
                        {item.tags.length > 2 && (
                          <span className="text-muted-foreground text-xs">
                            +{item.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Project Results */}
          {results.results.project.length > 0 && (
            <div className="border-t p-2">
              <div className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-medium">
                {getIcon('project')}
                Projects ({results.results.project.length})
              </div>
              {results.results.project.map((item) => (
                <a
                  key={item.id}
                  href={`/projects/${item.slug}`}
                  className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {item.description}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* Video Results */}
          {results.results.video.length > 0 && (
            <div className="border-t p-2">
              <div className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-medium">
                {getIcon('video')}
                Videos ({results.results.video.length})
              </div>
              {results.results.video.map((item) => (
                <a
                  key={item.id}
                  href={`/videos/${item.slug}`}
                  className="hover:bg-accent hover:text-accent-foreground block rounded-md p-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                    {item.description}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* View All Results Link */}
          <div className="border-t p-2">
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground block w-full rounded-md p-2 text-center text-sm"
              onClick={() => setIsOpen(false)}
            >
              View all results for "{query}"
            </a>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && results && getTotalResults() === 0 && (
        <div className="bg-popover absolute top-full z-50 mt-1 w-full rounded-lg border shadow-lg">
          <div className="p-4 text-center">
            <div className="text-muted-foreground text-sm">
              No results found for "{query}"
            </div>
            <div className="text-muted-foreground mt-1 text-xs">
              Try searching with different keywords
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBox

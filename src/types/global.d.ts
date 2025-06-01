import type { JournalPost } from '@/lib/notion'

declare global {
  interface Window {
    __JOURNAL_DATA__?: JournalPost[]
    __SEARCH_QUERY__?: string
  }
}

export {}

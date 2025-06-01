import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'spashii',
  description:
    'My development journal and portfolio powered by Notion API. A clean, minimal site showcasing thoughts, projects, and learning journey.',
  href: 'https://spashii.vercel.app',
  author: 'spashii',
  locale: 'en-US',
  featuredPostCount: 3,
  postsPerPage: 10,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/journal',
    label: 'journal',
  },
  {
    href: '/about',
    label: 'about',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/spashii',
    label: 'GitHub',
  },
  {
    href: 'https://discord.gg/ykDp8R6x7q',
    label: 'Discord',
  },
  {
    href: 'https://www.youtube.com/@ashn',
    label: 'YouTube',
  },
  {
    href: 'https://twitter.com/s4mmm0',
    label: 'Twitter',
  },
  {
    href: 'https://www.linkedin.com/in/sameer-pashikanti/',
    label: 'LinkedIn',
  },
  {
    href: 'mailto:sameerpashikanti@icloud.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  Discord: 'simple-icons:discord',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  YouTube: 'lucide:youtube',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

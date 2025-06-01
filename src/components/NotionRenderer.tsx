import { NotionRenderer as NotionRendererBase } from 'react-notion-x'
import { useEffect, useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {
  oneDark,
  oneLight,
} from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface NotionRendererProps {
  recordMap: any
}

// Enhanced Code component with syntax highlighting and copy functionality
const Code = ({ block, defaultLanguage = 'javascript', className }: any) => {
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const language = block?.properties?.language?.[0]?.[0] || defaultLanguage
  const code = block?.properties?.title?.[0]?.[0] || ''

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div
      className={`notion-code-wrapper relative rounded-lg ${className || ''}`}
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 text-sm">
        <span className="text-gray-300">{language}</span>
        <button
          onClick={copyToClipboard}
          className="rounded bg-gray-700 px-2 py-1 text-gray-300 hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          fontSize: '0.875rem',
        }}
        wrapLongLines
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

export function NotionRenderer({ recordMap }: NotionRendererProps) {
  const [isDark, setIsDark] = useState(false)

  // Validate recordMap structure - check if it has actual content
  const isValidRecordMap =
    recordMap &&
    typeof recordMap === 'object' &&
    (recordMap.recordMap || recordMap.block) &&
    typeof (recordMap.recordMap || recordMap) === 'object'

  // Check if recordMap has actual blocks (not just empty structure)
  const hasContent =
    recordMap &&
    ((recordMap.recordMap &&
      Object.keys(recordMap.recordMap.block || {}).length > 0) ||
      (recordMap.block && Object.keys(recordMap.block).length > 0))

  // If recordMap is invalid or empty, show a fallback
  if (!isValidRecordMap || !hasContent) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Content is not available.</p>
      </div>
    )
  }

  useEffect(() => {
    // Check initial theme
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark')

    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-theme'
        ) {
          setIsDark(
            document.documentElement.getAttribute('data-theme') === 'dark',
          )
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  try {
    return (
      <NotionRendererBase
        recordMap={recordMap}
        fullPage={false}
        darkMode={isDark}
        disableHeader
        components={{
          Code,
        }}
      />
    )
  } catch (error) {
    console.error('Error rendering Notion content:', error)
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">Unable to render content.</p>
      </div>
    )
  }
}

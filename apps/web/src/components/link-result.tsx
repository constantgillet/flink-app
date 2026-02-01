import { ArrowRightIcon, CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { ShortenedLink } from '../types'
import { Button } from './button'

interface LinkResultProps {
  link: ShortenedLink
}

export function LinkResult({ link }: LinkResultProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link.shortUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="mt-6 p-6 border border-border">
      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
        <ArrowRightIcon className="size-3 text-muted-foreground" /> Your shortened link
      </p>
      <div className="flex items-center gap-3">
        <a
          href={link.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 truncate text-xl font-semibold text-primary-600 hover:text-primary-700 hover:underline"
        >
          {link.shortUrl}
        </a>
        <Button
          type="button"
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-2 font-medium transition-all"
        >
          {copied ? (
            <>
              <CheckIcon className="size-5 text-positive" />
              Copied !
            </>
          ) : (
            <>
              <ClipboardIcon className="size-5 text-muted-foreground" />
              Copy
            </>
          )}
        </Button>
      </div>
      <p className="mt-3 truncate text-sm text-muted-foreground">Original: {link.originalUrl}</p>
    </div>
  )
}

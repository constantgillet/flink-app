import { CheckIcon, ClipboardIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import type { ShortenedLink } from '../types'

interface RecentLinksProps {
  links: ShortenedLink[]
}

export function RecentLinks({ links }: RecentLinksProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = async (link: ShortenedLink) => {
    await navigator.clipboard.writeText(link.shortUrl)
    setCopiedCode(link.shortCode)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  return (
    <div className="rounded-none bg-white p-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 flex items-center gap-2">
        <ClockIcon className="size-5 text-muted-foreground" /> Recent Links
      </h2>
      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.shortCode} className="rounded-none bg-background-intent/50 p-4">
            <div className="flex items-center gap-1">
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {link.shortUrl}
              </a>
              {copiedCode === link.shortCode ? (
                <CheckIcon className="size-4 text-positive" />
              ) : (
                <ClipboardIcon
                  className="size-4 text-muted-foreground cursor-pointer"
                  onClick={() => handleCopy(link)}
                />
              )}
            </div>
            <p className="mt-1 truncate text-sm  text-muted-foreground">{link.originalUrl}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

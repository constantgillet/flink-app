import type { ApiError, ShortenedLink } from './types'

// Build with: VITE_API_URL=https://api.example.com/api pnpm build
const API_URL = import.meta.env.VITE_API_URL || '/api'

export async function shortenUrl(url: string): Promise<ShortenedLink> {
  const response = await fetch(`${API_URL}/links`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error: ApiError = await response.json()
    throw new Error(error.message || 'Failed to shorten URL')
  }

  return response.json()
}

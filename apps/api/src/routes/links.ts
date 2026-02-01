import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { customAlphabet } from 'nanoid'
import { z } from 'zod'

// Only alphanumeric characters (no _ or -)
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', 7)

import { db, links } from '../db'
import { RATE_LIMITS, checkRateLimit } from '../lib/rate-limit'

export const linksRouter = new Hono()

const createLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL').max(2048, 'URL is too long'),
})

// Get client IP from request headers (works behind proxies)
const getClientIp = (c: { req: { header: (name: string) => string | undefined } }):
  | string
  | null => {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || null
}

// Create a short link
linksRouter.post('/', zValidator('json', createLinkSchema), async (c) => {
  const { url } = c.req.valid('json')

  // Get client IP for rate limiting and abuse tracking
  const clientIp = getClientIp(c)

  // Check rate limit by IP
  if (clientIp) {
    const rateLimit = await checkRateLimit(`create:${clientIp}`, RATE_LIMITS.createLink)

    // Set rate limit headers
    c.header('X-RateLimit-Limit', RATE_LIMITS.createLink.maxRequests.toString())
    c.header('X-RateLimit-Remaining', rateLimit.remaining.toString())
    c.header('X-RateLimit-Reset', Math.ceil(rateLimit.resetAt / 1000).toString())

    if (!rateLimit.allowed) {
      return c.json(
        {
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
        },
        429,
      )
    }
  }

  // Generate a unique short code
  const shortCode = nanoid()

  // Use API_URL env var if set, otherwise detect from request headers
  const baseUrl =
    process.env.API_URL ||
    (() => {
      const protocol = c.req.header('x-forwarded-proto') || 'http'
      const host = c.req.header('host') || 'localhost:3000'
      return `${protocol}://${host}`
    })()

  try {
    const [newLink] = await db
      .insert(links)
      .values({
        shortCode,
        originalUrl: url,
        createdByIp: clientIp,
      })
      .returning()

    return c.json({
      id: newLink.id,
      shortCode: newLink.shortCode,
      originalUrl: newLink.originalUrl,
      shortUrl: `${baseUrl}/${newLink.shortCode}`,
      createdAt: newLink.createdAt.toISOString(),
    })
  } catch (error) {
    console.error('Failed to create link:', error)
    return c.json({ error: 'server_error', message: 'Failed to create short link' }, 500)
  }
})

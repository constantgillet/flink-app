import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { db, links } from '../db'
import { CACHE_TTL, getLinkCacheKey, redis } from '../lib/redis'

export const redirectRouter = new Hono()

// Redirect short URLs to original URLs
redirectRouter.get('/:shortCode', async (c) => {
  const shortCode = c.req.param('shortCode')

  // Skip API paths and static files
  if (shortCode.startsWith('api') || shortCode.includes('.')) {
    return c.notFound()
  }

  const cacheKey = getLinkCacheKey(shortCode)

  // Try to get from Redis cache first
  try {
    const cachedUrl = await redis.get(cacheKey)
    if (cachedUrl) {
      return c.redirect(cachedUrl, 302)
    }
  } catch {
    // If Redis fails, continue to database lookup
  }

  // Cache miss - fetch from database (only active links)
  const [link] = await db
    .select()
    .from(links)
    .where(and(eq(links.shortCode, shortCode), eq(links.isActive, true)))
    .limit(1)

  if (!link) {
    return c.json({ error: 'not_found', message: 'Link not found' }, 404)
  }

  // Store in Redis cache for future requests
  try {
    await redis.set(cacheKey, link.originalUrl, 'EX', CACHE_TTL)
  } catch {
    // If Redis fails, continue without caching
  }

  return c.redirect(link.originalUrl, 302)
})

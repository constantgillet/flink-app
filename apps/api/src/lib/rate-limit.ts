import { redis } from './redis'

// Rate limit configurations (per IP)
export const RATE_LIMITS = {
  createLink: { windowMs: 60_000, maxRequests: 10 }, // 10 requests per minute
} as const

type RateLimitConfig = (typeof RATE_LIMITS)[keyof typeof RATE_LIMITS]

/**
 * Sliding window rate limiter using Redis sorted sets.
 * Scalable across multiple API instances.
 */
export async function checkRateLimit(key: string, config: RateLimitConfig) {
  const now = Date.now()
  const redisKey = `ratelimit:${key}`

  try {
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(redisKey, 0, now - config.windowMs) // Remove expired entries
    pipeline.zcard(redisKey) // Count requests in window
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`) // Add current request
    pipeline.pexpire(redisKey, config.windowMs) // Set key expiry

    const results = await pipeline.exec()
    const count = (results?.[1]?.[1] as number) || 0
    const allowed = count < config.maxRequests

    // Remove the request we just added if not allowed
    if (!allowed) {
      await redis.zremrangebyscore(redisKey, now, now + 1)
    }

    return {
      allowed,
      remaining: Math.max(0, config.maxRequests - count - 1),
      resetAt: now + config.windowMs,
    }
  } catch {
    // Fail open: allow request if Redis is unavailable
    return { allowed: true, remaining: config.maxRequests, resetAt: now + config.windowMs }
  }
}

import Redis from 'ioredis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
})

redis.on('error', (err) => {
  console.error('Redis connection error:', err.message)
})

redis.on('connect', () => {
  console.log('Connected to Redis')
})

// Cache TTL in seconds (1 hour)
export const CACHE_TTL = 60 * 60

// Cache key prefix for link redirects
export const getLinkCacheKey = (shortCode: string) => `link:${shortCode}`

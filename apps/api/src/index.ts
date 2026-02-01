import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { linksRouter } from './routes/links'
import { redirectRouter } from './routes/redirect'

const app = new Hono()

// Middleware
app.use('*', logger())

// CORS - set WEBAPP_URL to your frontend domain
const webappUrl = process.env.WEBAPP_URL || 'http://localhost'
app.use(
  '/api/*',
  cors({
    origin: [webappUrl, 'http://localhost:5173', 'http://localhost:4173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
  })
)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API routes
app.route('/api/links', linksRouter)

// Redirect route (must be last to catch /:shortCode)
app.route('/', redirectRouter)

const port = Number(process.env.API_PORT) || 3000

console.log(`Starting server on port ${port}...`)

serve({
  fetch: app.fetch,
  port,
})

console.log(`Server running at http://localhost:${port}`)

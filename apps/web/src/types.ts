export interface ShortenedLink {
  id: number
  shortCode: string
  originalUrl: string
  shortUrl: string
  createdAt: string
}

export interface ApiError {
  error: string
  message: string
}

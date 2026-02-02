// Get client IP from request headers (works behind proxies)
export const getClientIp = (c: { req: { header: (name: string) => string | undefined } }):
  | string
  | null => {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || null
}

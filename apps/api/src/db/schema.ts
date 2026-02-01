import { bigserial, boolean, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'

export const links = pgTable(
  'links',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    shortCode: varchar('short_code', { length: 20 }).notNull().unique(),
    originalUrl: varchar('original_url', { length: 2048 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    createdByIp: varchar('created_by_ip', { length: 45 }), // Supports IPv6
  },
  (table) => [
    index('short_code_idx').on(table.shortCode),
    index('is_active_idx').on(table.isActive),
  ],
)

export type Link = typeof links.$inferSelect
export type NewLink = typeof links.$inferInsert

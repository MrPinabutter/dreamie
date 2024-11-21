import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const dreams = sqliteTable("dreams", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description").notNull(),
  date: text("date").notNull(),
  mood: text("mood"),
  images: text("images"),
  audioUrl: text("audio_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Dream = typeof dreams.$inferSelect;
export type NewDream = typeof dreams.$inferInsert;

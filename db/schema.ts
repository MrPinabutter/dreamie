import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const dreams = sqliteTable("dreams", {
  id: text("id").primaryKey(),
  title: text("title"),
  description: text("description").notNull(),
  date: text("date").notNull(),
  mood: integer("mood").$type<0 | 1 | 2 | 3 | 4 | 5>(),
  images: text("images"),
  favorite: integer("favorite").$type<0 | 1>().default(0),
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

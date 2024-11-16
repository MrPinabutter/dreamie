import { drizzle } from "drizzle-orm/expo-sqlite";
import * as SQLite from "expo-sqlite";

import * as schema from "./schema";
import { sql } from "drizzle-orm";

const DREAMS_DB = "dreams.db";

class DreamsDatabase {
  public readonly sqlite: SQLite.SQLiteDatabase;
  private readonly db: ReturnType<typeof drizzle>;

  constructor() {
    this.sqlite = SQLite.openDatabaseSync(DREAMS_DB);
    this.db = drizzle(this.sqlite, { schema });
  }

  async init() {
    const query = `
      CREATE TABLE IF NOT EXISTS dreams (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        mood TEXT,
        tags TEXT,
        images TEXT,
        audio_url TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await this.sqlite.execAsync(query);
  }

  async getDreams(options?: {
    sortOrder?: "asc" | "desc";
    limit?: number;
    offset?: number;
  }) {
    const { sortOrder = "desc", limit = 20, offset = 0 } = options ?? {};

    return this.db
      .select()
      .from(schema.dreams)
      .orderBy(
        sql`${schema.dreams.date} ${sql.raw(sortOrder)}, ${
          schema.dreams.createdAt
        } ${sql.raw(sortOrder)}`
      )
      .limit(limit)
      .offset(offset)
      .all();
  }

  async getDreamById(id: string) {
    const result = this.db
      .select()
      .from(schema.dreams)
      .where(sql`id = ${id}`)
      .all();
    return result[0];
  }

  async createDream(dream: Omit<schema.NewDream, "createdAt" | "updatedAt">) {
    try {
      this.db
        .insert(schema.dreams)
        .values({
          ...dream,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .run();
    } catch (error) {
      console.error("Error creating dream:", error);
      throw error;
    }
  }

  async updateDream(id: string, dream: Partial<Omit<schema.NewDream, "id">>) {
    try {
      this.db
        .update(schema.dreams)
        .set({
          ...dream,
          updatedAt: new Date().toISOString(),
        })
        .where(sql`id = ${id}`)
        .run();
    } catch (error) {
      console.error("Error updating dream:", error);
      throw error;
    }
  }

  async deleteDream(id: string) {
    try {
      this.db
        .delete(schema.dreams)
        .where(sql`id = ${id}`)
        .run();
    } catch (error) {
      console.error("Error deleting dream:", error);
      throw error;
    }
  }

  async searchDreams(query: string) {
    try {
      return this.db
        .select()
        .from(schema.dreams)
        .where(sql`title LIKE %${query}% OR description LIKE %${query}%`)
        .all();
    } catch (error) {
      console.error("Error searching dreams:", error);
      throw error;
    }
  }

  async getDreamsByDateRange(startDate: string, endDate: string) {
    try {
      return this.db
        .select()
        .from(schema.dreams)
        .where(sql`date >= ${startDate} AND date <= ${endDate}`)
        .all();
    } catch (error) {
      console.error("Error getting dreams by date range:", error);
      throw error;
    }
  }

  async getDreamsByMood(mood: string) {
    try {
      return this.db
        .select()
        .from(schema.dreams)
        .where(sql`mood = ${mood}`)
        .all();
    } catch (error) {
      console.error("Error getting dreams by mood:", error);
      throw error;
    }
  }

  async getDreamsByTag(tag: string) {
    try {
      return this.db
        .select()
        .from(schema.dreams)
        .where(sql`tags LIKE %${tag}%`)
        .all();
    } catch (error) {
      console.error("Error getting dreams by tag:", error);
      throw error;
    }
  }
}

export const database = new DreamsDatabase();

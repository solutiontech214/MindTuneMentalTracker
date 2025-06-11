import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Mood entries table
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: varchar("mood").notNull(), // 'terrible', 'bad', 'okay', 'good', 'great'
  moodScore: integer("mood_score").notNull(), // 1-5
  journalEntry: text("journal_entry"),
  aiAnalysis: jsonb("ai_analysis"), // JSON with detected emotions, keywords, etc.
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Therapy activities table
export const therapyActivities = pgTable("therapy_activities", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  duration: integer("duration").notNull(), // in minutes
  category: varchar("category").notNull(), // 'breathing', 'meditation', 'journaling', etc.
  difficulty: varchar("difficulty").notNull(), // 'beginner', 'intermediate', 'advanced'
  instructions: text("instructions").notNull(),
  icon: varchar("icon").notNull(),
  moodRecommendations: varchar("mood_recommendations").array(), // moods this activity is good for
});

// User activity completions table
export const activityCompletions = pgTable("activity_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  activityId: integer("activity_id").notNull().references(() => therapyActivities.id),
  completedAt: timestamp("completed_at").defaultNow(),
  rating: integer("rating"), // 1-5 how helpful it was
});

// Music recommendations table
export const musicRecommendations = pgTable("music_recommendations", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  artist: varchar("artist").notNull(),
  mood: varchar("mood").notNull(),
  genre: varchar("genre"),
  spotifyUrl: varchar("spotify_url"),
  youtubeUrl: varchar("youtube_url"),
});

// User's saved music
export const savedMusic = pgTable("saved_music", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  musicId: integer("music_id").notNull().references(() => musicRecommendations.id),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Schemas
export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
});

export const insertActivityCompletionSchema = createInsertSchema(activityCompletions).omit({
  id: true,
  completedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type TherapyActivity = typeof therapyActivities.$inferSelect;
export type ActivityCompletion = typeof activityCompletions.$inferSelect;
export type InsertActivityCompletion = z.infer<typeof insertActivityCompletionSchema>;
export type MusicRecommendation = typeof musicRecommendations.$inferSelect;
export type SavedMusic = typeof savedMusic.$inferSelect;

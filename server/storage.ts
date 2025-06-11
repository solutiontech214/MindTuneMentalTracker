import {
  users,
  moodEntries,
  therapyActivities,
  activityCompletions,
  musicRecommendations,
  savedMusic,
  type User,
  type UpsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type TherapyActivity,
  type ActivityCompletion,
  type InsertActivityCompletion,
  type MusicRecommendation,
  type SavedMusic,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Mood entries
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getUserMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  getUserMoodEntriesInRange(userId: string, startDate: string, endDate: string): Promise<MoodEntry[]>;
  getMoodEntry(id: number): Promise<MoodEntry | undefined>;
  
  // Therapy activities
  getAllTherapyActivities(): Promise<TherapyActivity[]>;
  getTherapyActivitiesByMood(mood: string): Promise<TherapyActivity[]>;
  getTherapyActivity(id: number): Promise<TherapyActivity | undefined>;
  
  // Activity completions
  createActivityCompletion(completion: InsertActivityCompletion): Promise<ActivityCompletion>;
  getUserActivityCompletions(userId: string, limit?: number): Promise<ActivityCompletion[]>;
  getUserWeeklyActivityCount(userId: string): Promise<number>;
  
  // Music recommendations
  getMusicByMood(mood: string): Promise<MusicRecommendation[]>;
  saveUserMusic(userId: string, musicId: number): Promise<SavedMusic>;
  getUserSavedMusic(userId: string): Promise<SavedMusic[]>;
  
  // Analytics
  getUserMoodStats(userId: string): Promise<{
    averageMood: number;
    totalEntries: number;
    currentStreak: number;
    positiveDays: number;
    totalDays: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Mood entries
  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [moodEntry] = await db
      .insert(moodEntries)
      .values(entry)
      .returning();
    return moodEntry;
  }

  async getUserMoodEntries(userId: string, limit = 30): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date))
      .limit(limit);
  }

  async getUserMoodEntriesInRange(userId: string, startDate: string, endDate: string): Promise<MoodEntry[]> {
    return await db
      .select()
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, userId),
          gte(moodEntries.date, startDate),
          lte(moodEntries.date, endDate)
        )
      )
      .orderBy(desc(moodEntries.date));
  }

  async getMoodEntry(id: number): Promise<MoodEntry | undefined> {
    const [entry] = await db.select().from(moodEntries).where(eq(moodEntries.id, id));
    return entry;
  }

  // Therapy activities
  async getAllTherapyActivities(): Promise<TherapyActivity[]> {
    return await db.select().from(therapyActivities);
  }

  async getTherapyActivitiesByMood(mood: string): Promise<TherapyActivity[]> {
    return await db
      .select()
      .from(therapyActivities)
      .where(sql`${therapyActivities.moodRecommendations} && ARRAY[${mood}]`);
  }

  async getTherapyActivity(id: number): Promise<TherapyActivity | undefined> {
    const [activity] = await db.select().from(therapyActivities).where(eq(therapyActivities.id, id));
    return activity;
  }

  // Activity completions
  async createActivityCompletion(completion: InsertActivityCompletion): Promise<ActivityCompletion> {
    const [activityCompletion] = await db
      .insert(activityCompletions)
      .values(completion)
      .returning();
    return activityCompletion;
  }

  async getUserActivityCompletions(userId: string, limit = 20): Promise<ActivityCompletion[]> {
    return await db
      .select()
      .from(activityCompletions)
      .where(eq(activityCompletions.userId, userId))
      .orderBy(desc(activityCompletions.completedAt))
      .limit(limit);
  }

  async getUserWeeklyActivityCount(userId: string): Promise<number> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const [result] = await db
      .select({ count: count() })
      .from(activityCompletions)
      .where(
        and(
          eq(activityCompletions.userId, userId),
          gte(activityCompletions.completedAt, weekAgo)
        )
      );
    
    return result.count;
  }

  // Music recommendations
  async getMusicByMood(mood: string): Promise<MusicRecommendation[]> {
    return await db
      .select()
      .from(musicRecommendations)
      .where(eq(musicRecommendations.mood, mood))
      .limit(10);
  }

  async saveUserMusic(userId: string, musicId: number): Promise<SavedMusic> {
    const [saved] = await db
      .insert(savedMusic)
      .values({ userId, musicId })
      .returning();
    return saved;
  }

  async getUserSavedMusic(userId: string): Promise<SavedMusic[]> {
    return await db
      .select()
      .from(savedMusic)
      .where(eq(savedMusic.userId, userId))
      .orderBy(desc(savedMusic.savedAt));
  }

  // Analytics
  async getUserMoodStats(userId: string): Promise<{
    averageMood: number;
    totalEntries: number;
    currentStreak: number;
    positiveDays: number;
    totalDays: number;
  }> {
    // Get all mood entries for the user
    const entries = await db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.date));

    if (entries.length === 0) {
      return {
        averageMood: 0,
        totalEntries: 0,
        currentStreak: 0,
        positiveDays: 0,
        totalDays: 0,
      };
    }

    // Calculate average mood
    const totalMoodScore = entries.reduce((sum, entry) => sum + entry.moodScore, 0);
    const averageMood = Math.round((totalMoodScore / entries.length) * 10) / 10;

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    for (let i = 0; i < entries.length; i++) {
      const entryDate = entries[i].date;
      const checkDateStr = checkDate.toISOString().split('T')[0];
      
      if (entryDate === checkDateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate positive days (mood score >= 4)
    const positiveDays = entries.filter(entry => entry.moodScore >= 4).length;

    return {
      averageMood,
      totalEntries: entries.length,
      currentStreak,
      positiveDays,
      totalDays: entries.length,
    };
  }
}

export const storage = new DatabaseStorage();

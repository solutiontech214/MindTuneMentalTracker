import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { analyzeMoodFromText, generateTherapySuggestion } from "./openai";
import { insertMoodEntrySchema, insertActivityCompletionSchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Mood entries
  app.post('/api/mood-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertMoodEntrySchema.parse({ ...req.body, userId });
      
      // Get mood score from mood string
      const moodScores: Record<string, number> = {
        'terrible': 1,
        'bad': 2,
        'okay': 3,
        'good': 4,
        'great': 5
      };
      
      data.moodScore = moodScores[data.mood] || 3;
      
      // Analyze mood if journal entry exists
      let aiAnalysis = null;
      if (data.journalEntry && data.journalEntry.trim()) {
        aiAnalysis = await analyzeMoodFromText(data.journalEntry, data.mood);
      }
      
      const entry = await storage.createMoodEntry({
        ...data,
        aiAnalysis: aiAnalysis ? JSON.stringify(aiAnalysis) : null,
      });
      
      res.json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating mood entry:", error);
        res.status(500).json({ message: "Failed to create mood entry" });
      }
    }
  });

  app.get('/api/mood-entries', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 30;
      const entries = await storage.getUserMoodEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.get('/api/mood-entries/range', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate are required" });
      }
      
      const entries = await storage.getUserMoodEntriesInRange(userId, startDate as string, endDate as string);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching mood entries:", error);
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  // Therapy activities
  app.get('/api/therapy-activities', isAuthenticated, async (req: any, res) => {
    try {
      const mood = req.query.mood as string;
      let activities;
      
      if (mood) {
        activities = await storage.getTherapyActivitiesByMood(mood);
      } else {
        activities = await storage.getAllTherapyActivities();
      }
      
      res.json(activities);
    } catch (error) {
      console.error("Error fetching therapy activities:", error);
      res.status(500).json({ message: "Failed to fetch therapy activities" });
    }
  });

  app.post('/api/activity-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertActivityCompletionSchema.parse({ ...req.body, userId });
      
      const completion = await storage.createActivityCompletion(data);
      res.json(completion);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating activity completion:", error);
        res.status(500).json({ message: "Failed to create activity completion" });
      }
    }
  });

  app.get('/api/activity-completions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const completions = await storage.getUserActivityCompletions(userId);
      res.json(completions);
    } catch (error) {
      console.error("Error fetching activity completions:", error);
      res.status(500).json({ message: "Failed to fetch activity completions" });
    }
  });

  // Music recommendations
  app.get('/api/music', isAuthenticated, async (req: any, res) => {
    try {
      const mood = req.query.mood as string;
      if (!mood) {
        return res.status(400).json({ message: "mood parameter is required" });
      }
      
      const music = await storage.getMusicByMood(mood);
      res.json(music);
    } catch (error) {
      console.error("Error fetching music:", error);
      res.status(500).json({ message: "Failed to fetch music recommendations" });
    }
  });

  app.post('/api/saved-music', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { musicId } = req.body;
      
      if (!musicId) {
        return res.status(400).json({ message: "musicId is required" });
      }
      
      const saved = await storage.saveUserMusic(userId, musicId);
      res.json(saved);
    } catch (error) {
      console.error("Error saving music:", error);
      res.status(500).json({ message: "Failed to save music" });
    }
  });

  // User analytics
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserMoodStats(userId);
      const weeklyActivities = await storage.getUserWeeklyActivityCount(userId);
      
      res.json({
        ...stats,
        weeklyActivities,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // AI suggestions
  app.post('/api/ai/suggestion', isAuthenticated, async (req: any, res) => {
    try {
      const { mood, text } = req.body;
      
      if (!mood) {
        return res.status(400).json({ message: "mood is required" });
      }
      
      const analysis = await analyzeMoodFromText(text || "", mood);
      const suggestion = await generateTherapySuggestion(mood, analysis);
      
      res.json({
        analysis,
        suggestion,
      });
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

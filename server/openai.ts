import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface MoodAnalysis {
  detectedEmotions: string[];
  keywords: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  suggestions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function analyzeMoodFromText(text: string, mood: string): Promise<MoodAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a mental health AI assistant. Analyze the user's text for emotional content and provide structured insights. The user has indicated their mood as "${mood}". Respond with JSON in this format: {
            "detectedEmotions": ["emotion1", "emotion2"],
            "keywords": ["keyword1", "keyword2"],
            "sentiment": "positive|negative|neutral",
            "confidence": 0.0-1.0,
            "suggestions": ["suggestion1", "suggestion2"],
            "riskLevel": "low|medium|high"
          }`
        },
        {
          role: "user",
          content: `My mood today is ${mood}. Here's what I wrote: "${text}"`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      detectedEmotions: result.detectedEmotions || [],
      keywords: result.keywords || [],
      sentiment: result.sentiment || 'neutral',
      confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
      suggestions: result.suggestions || [],
      riskLevel: result.riskLevel || 'low',
    };
  } catch (error) {
    console.error("Failed to analyze mood:", error);
    // Return a basic fallback analysis
    return {
      detectedEmotions: [mood],
      keywords: [],
      sentiment: mood === 'great' || mood === 'good' ? 'positive' : 
                mood === 'terrible' || mood === 'bad' ? 'negative' : 'neutral',
      confidence: 0.5,
      suggestions: ["Consider doing a mindfulness exercise", "Take some time for self-care"],
      riskLevel: mood === 'terrible' ? 'medium' : 'low',
    };
  }
}

export async function generateTherapySuggestion(mood: string, analysis: MoodAnalysis): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a mental health assistant. Provide a personalized, encouraging therapy suggestion based on the user's mood and analysis. Keep it concise and actionable."
        },
        {
          role: "user",
          content: `User's mood: ${mood}. Analysis: ${JSON.stringify(analysis)}. Please suggest a specific therapeutic activity or coping strategy.`
        }
      ],
    });

    return response.choices[0].message.content || "Take a few deep breaths and be kind to yourself today.";
  } catch (error) {
    console.error("Failed to generate therapy suggestion:", error);
    return "Take a few minutes to practice mindful breathing and remember that it's okay to have difficult days.";
  }
}

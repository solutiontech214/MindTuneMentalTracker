import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, PenTool, Brain, Wind, BookOpen, Users, Palette, Scan, Heart } from "lucide-react";

interface TherapyActivity {
  id: number;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: string;
  instructions: string;
  icon: string;
  moodRecommendations: string[];
}

const activityIcons = {
  wind: Wind,
  "book-open": BookOpen,
  zap: Zap,
  footprints: Zap,
  heart: Heart,
  palette: Palette,
  scan: Scan,
  users: Users,
};

const difficultyColors = {
  beginner: "bg-[var(--mindtune-secondary)]/20 text-[var(--mindtune-secondary)]",
  intermediate: "bg-[var(--mindtune-accent)]/20 text-[var(--mindtune-accent)]",
  advanced: "bg-[var(--mindtune-primary)]/20 text-[var(--mindtune-primary)]",
  "all-levels": "bg-[var(--mindtune-primary)]/20 text-[var(--mindtune-primary)]",
};

const categoryColors = {
  breathing: "from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)]",
  journaling: "from-[var(--mindtune-primary)] to-[var(--mindtune-accent)]",
  meditation: "from-[var(--mindtune-accent)] to-[var(--mindtune-secondary)]",
};

export default function TherapyActivities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [userMood, setUserMood] = useState("good");

  // Fetch user's latest mood
  const { data: moodEntries } = useQuery<any[]>({
    queryKey: ["/api/mood-entries"],
  });

  // Fetch all therapy activities
  const { data: activities, isLoading } = useQuery<TherapyActivity[]>({
    queryKey: ["/api/therapy-activities"],
  });

  // Update user mood based on latest entry
  useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      setUserMood(moodEntries[0].mood);
    }
  }, [moodEntries]);

  const completionMutation = useMutation({
    mutationFn: async (activityId: number) => {
      const response = await apiRequest("POST", "/api/activity-completions", {
        activityId,
        rating: 5,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Activity completed!",
        description: "Great job on taking care of your mental health.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-completions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartActivity = (activity: TherapyActivity) => {
    completionMutation.mutate(activity.id);
  };

  // Filter activities based on user's current mood
  const recommendedActivities = activities?.filter(activity => 
    activity.moodRecommendations.includes(userMood)
  ) || [];

  if (isLoading) {
    return (
      <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
            Loading Activities...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayActivities = recommendedActivities.length > 0 ? recommendedActivities : activities?.slice(0, 3) || [];

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
          {recommendedActivities.length > 0 ? `Activities for ${userMood} mood` : "Recommended Activities"}
        </CardTitle>
        <Leaf className="w-5 h-5 text-[var(--mindtune-secondary)]" />
      </CardHeader>

      <CardContent className="space-y-4">
        {displayActivities.length === 0 ? (
          <p className="text-[var(--mindtune-neutral-600)]">No activities available at the moment.</p>
        ) : (
          displayActivities.map((activity) => {
            const IconComponent = activityIcons[activity.icon as keyof typeof activityIcons] || Brain;
            const categoryColor = categoryColors[activity.category as keyof typeof categoryColors] || categoryColors.meditation;
            const difficultyColor = difficultyColors[activity.difficulty as keyof typeof difficultyColors] || difficultyColors.beginner;

            return (
              <div key={activity.id} className="therapy-card rounded-xl p-4 border border-[var(--mindtune-neutral-200)]">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${categoryColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{activity.name}</h4>
                    <p className="text-xs text-[var(--mindtune-neutral-600)] mb-2">{activity.description}</p>
                    <p className="text-xs text-[var(--mindtune-neutral-500)] mb-3 italic">{activity.instructions}</p>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs bg-[var(--mindtune-secondary)]/20 text-[var(--mindtune-secondary)]">
                        {activity.duration} min
                      </Badge>
                      <Badge variant="secondary" className={`text-xs ${difficultyColor}`}>
                        {activity.difficulty}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleStartActivity(activity)}
                  disabled={completionMutation.isPending}
                  className="w-full mt-4 bg-[var(--mindtune-secondary)] hover:bg-[var(--mindtune-secondary)]/90 text-white text-sm font-medium"
                >
                  {completionMutation.isPending ? "Completing..." : "Complete Activity"}
                </Button>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

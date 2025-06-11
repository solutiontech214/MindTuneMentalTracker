import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Leaf, Zap, PenTool, Brain } from "lucide-react";

// Mock therapy activities data
const mockActivities = [
  {
    id: 1,
    name: "5-Minute Breathing Exercise",
    description: "Calm your mind with guided deep breathing",
    duration: 5,
    category: "breathing",
    difficulty: "beginner",
    instructions: "Breathe in for 4 counts, hold for 4 counts, exhale for 6 counts",
    icon: "lungs",
    moodRecommendations: ["terrible", "bad", "anxious"],
  },
  {
    id: 2,
    name: "Gratitude Journal",
    description: "Write down three things you're grateful for",
    duration: 10,
    category: "journaling",
    difficulty: "all-levels",
    instructions: "Write down 3 things you're grateful for today and why",
    icon: "pen",
    moodRecommendations: ["bad", "okay", "good"],
  },
  {
    id: 3,
    name: "Mindful Meditation",
    description: "Focus on the present moment",
    duration: 15,
    category: "meditation",
    difficulty: "intermediate",
    instructions: "Sit comfortably and focus on your breath for 15 minutes",
    icon: "om",
    moodRecommendations: ["terrible", "bad", "okay"],
  },
];

const activityIcons = {
  lungs: Zap,
  pen: PenTool,
  om: Brain,
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

  const { data: activities } = useQuery({
    queryKey: ["/api/therapy-activities"],
    enabled: false, // Disable for now, use mock data
  });

  const completionMutation = useMutation({
    mutationFn: async (activityId: number) => {
      const response = await apiRequest("POST", "/api/activity-completions", {
        activityId,
        rating: 5, // Default rating, could be made interactive
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

  const handleStartActivity = (activity: any) => {
    // In a real app, this would open a modal or navigate to an activity page
    // For now, we'll just mark it as completed
    completionMutation.mutate(activity.id);
  };

  // Use mock data for now
  const displayActivities = activities || mockActivities;

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
          Recommended Activities
        </CardTitle>
        <Leaf className="w-5 h-5 text-[var(--mindtune-secondary)]" />
      </CardHeader>

      <CardContent className="space-y-4">
        {displayActivities.map((activity: any) => {
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
                  <p className="text-xs text-[var(--mindtune-neutral-600)] mb-3">{activity.description}</p>
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
                {completionMutation.isPending ? "Starting..." : "Start Activity"}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

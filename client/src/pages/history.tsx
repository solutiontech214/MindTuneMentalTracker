import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodCalendar from "@/components/mood-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, Activity, Target } from "lucide-react";
import { useState } from "react";

const moodEmojis = {
  terrible: "😢",
  bad: "😔", 
  okay: "😐",
  good: "😊",
  great: "😄"
};

const moodColors = {
  terrible: "bg-red-100 text-red-800",
  bad: "bg-orange-100 text-orange-800",
  okay: "bg-yellow-100 text-yellow-800", 
  good: "bg-green-100 text-green-800",
  great: "bg-blue-100 text-blue-800"
};

export default function History() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('week');
  
  const { data: moodEntries } = useQuery({
    queryKey: ["/api/mood-entries"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: activityCompletions } = useQuery({
    queryKey: ["/api/activity-completions"],
  });

  const progressPercentages = {
    positive: stats?.totalDays > 0 ? Math.round((stats.positiveDays / stats.totalDays) * 100) : 0,
    activities: Math.min(100, Math.round((stats?.weeklyActivities || 0) / 7 * 100)),
    consistency: stats?.totalDays > 0 ? Math.min(100, Math.round((stats.currentStreak / 7) * 100)) : 0,
  };

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--mindtune-neutral-900)]">Your Mood Journey</h1>
          </div>
          <p className="text-[var(--mindtune-neutral-600)]">
            Track your progress and discover patterns in your mental health journey.
          </p>
        </div>

        {/* Time Frame Selector */}
        <div className="flex items-center space-x-2 mb-8">
          <Button
            variant={timeFrame === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFrame('week')}
            className={timeFrame === 'week' ? 'bg-[var(--mindtune-primary)] text-white' : ''}
          >
            Week
          </Button>
          <Button
            variant={timeFrame === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFrame('month')}
            className={timeFrame === 'month' ? 'bg-[var(--mindtune-primary)] text-white' : ''}
          >
            Month
          </Button>
          <Button
            variant={timeFrame === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFrame('year')}
            className={timeFrame === 'year' ? 'bg-[var(--mindtune-primary)] text-white' : ''}
          >
            Year
          </Button>
        </div>

        {/* Mood Calendar */}
        <MoodCalendar />

        {/* Progress Stats */}
        <Card className="border-[var(--mindtune-neutral-200)] shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-[var(--mindtune-primary)]" />
              <span>Progress Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Positive Days */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="var(--mindtune-secondary)" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray="176" 
                      strokeDashoffset={176 - (176 * progressPercentages.positive / 100)}
                      className="progress-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[var(--mindtune-secondary)]">
                      {progressPercentages.positive}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Positive Days</p>
                <p className="text-xs text-[var(--mindtune-neutral-600)]">
                  {stats?.positiveDays || 0} out of {stats?.totalDays || 0} days
                </p>
              </div>

              {/* Activities */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="var(--mindtune-primary)" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray="176" 
                      strokeDashoffset={176 - (176 * progressPercentages.activities / 100)}
                      className="progress-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[var(--mindtune-primary)]">
                      {progressPercentages.activities}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Activities</p>
                <p className="text-xs text-[var(--mindtune-neutral-600)]">
                  {stats?.weeklyActivities || 0} completed this week
                </p>
              </div>

              {/* Consistency */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="var(--mindtune-neutral-200)" strokeWidth="4" fill="none"/>
                    <circle 
                      cx="32" 
                      cy="32" 
                      r="28" 
                      stroke="var(--mindtune-accent)" 
                      strokeWidth="4" 
                      fill="none"
                      strokeDasharray="176" 
                      strokeDashoffset={176 - (176 * progressPercentages.consistency / 100)}
                      className="progress-ring"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-semibold text-[var(--mindtune-accent)]">
                      {progressPercentages.consistency}%
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">Consistency</p>
                <p className="text-xs text-[var(--mindtune-neutral-600)]">
                  {stats?.currentStreak || 0} day streak
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Entries */}
          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-[var(--mindtune-primary)]" />
                <span>Recent Mood Entries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodEntries?.slice(0, 5).map((entry: any) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[var(--mindtune-neutral-50)] transition-colors">
                    <div className="text-2xl">
                      {moodEmojis[entry.mood as keyof typeof moodEmojis]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={moodColors[entry.mood as keyof typeof moodColors]}>
                          {entry.mood}
                        </Badge>
                        <span className="text-xs text-[var(--mindtune-neutral-500)]">
                          {new Date(entry.date).toLocaleDateString()}
                        </span>
                      </div>
                      {entry.journalEntry && (
                        <p className="text-sm text-[var(--mindtune-neutral-600)] line-clamp-2">
                          {entry.journalEntry}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                
                {(!moodEntries || moodEntries.length === 0) && (
                  <div className="text-center py-8 text-[var(--mindtune-neutral-500)]">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No mood entries yet</p>
                    <p className="text-sm">Start tracking your mood to see your progress here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Activity Completions */}
          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-[var(--mindtune-secondary)]" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityCompletions?.slice(0, 5).map((completion: any) => (
                  <div key={completion.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--mindtune-neutral-50)] transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Activity Completed</p>
                      <p className="text-xs text-[var(--mindtune-neutral-500)]">
                        {new Date(completion.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {completion.rating && (
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: completion.rating }).map((_, i) => (
                          <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {(!activityCompletions || activityCompletions.length === 0) && (
                  <div className="text-center py-8 text-[var(--mindtune-neutral-500)]">
                    <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activities completed yet</p>
                    <p className="text-sm">Complete therapy activities to track your progress</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

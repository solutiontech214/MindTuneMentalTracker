import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import MoodCalendar from "@/components/mood-calendar";
import MusicPlayer from "@/components/music-player";
import TherapyActivities from "@/components/therapy-activities";
import EmergencySupport from "@/components/emergency-support";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Flame, TrendingUp, Leaf } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: recentEntries } = useQuery({
    queryKey: ["/api/mood-entries"],
  });

  const userName = user?.firstName || "there";
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Welcome Section */}
        <section className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2">
                {greeting}, {userName}! 🌅
              </h2>
              <p className="text-lg opacity-90 mb-6">
                How are you feeling today? Take a moment to check in with yourself.
              </p>
              <Link href="/mood-check">
                <Button className="bg-white text-[var(--mindtune-primary)] hover:bg-white/90 px-6 py-3 rounded-xl font-medium">
                  <Heart className="w-4 h-4 mr-2" />
                  Start Daily Check-in
                </Button>
              </Link>
            </div>
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white opacity-10 rounded-full"></div>
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white opacity-5 rounded-full"></div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-primary)] mb-2">
                {stats?.currentStreak || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">days in a row</p>
            </CardContent>
          </Card>

          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-secondary)] mb-2">
                {stats?.averageMood || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">average mood</p>
            </CardContent>
          </Card>

          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activities</CardTitle>
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-accent)] rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[var(--mindtune-accent)] mb-2">
                {stats?.weeklyActivities || 0}
              </div>
              <p className="text-[var(--mindtune-neutral-600)] text-sm">completed this week</p>
            </CardContent>
          </Card>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MusicPlayer />
          <TherapyActivities />
        </div>

        {/* Mood History */}
        <MoodCalendar />

        {/* Emergency Support */}
        <EmergencySupport />
      </main>

      <BottomNav />
    </div>
  );
}

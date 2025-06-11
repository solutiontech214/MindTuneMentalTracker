import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Music, Target, Users, Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--mindtune-neutral-50)] to-[var(--mindtune-neutral-100)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--mindtune-neutral-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-[var(--mindtune-neutral-800)]">MindTune</h1>
            </div>
            
            <Button onClick={handleLogin} className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-8 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-2xl flex items-center justify-center">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--mindtune-neutral-900)] mb-6">
              Your Mental Health,
              <br />
              <span className="bg-gradient-to-r from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] bg-clip-text text-transparent">
                Tuned Perfectly
              </span>
            </h1>
            <p className="text-xl text-[var(--mindtune-neutral-600)] mb-8 max-w-3xl mx-auto">
              Track your mood, get AI-powered insights, discover music that matches your feelings, 
              and receive personalized therapy recommendations—all in one beautiful, secure app.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleLogin}
                size="lg"
                className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white px-8 py-4 text-lg"
              >
                Start Your Journey
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-[var(--mindtune-primary)] text-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)] hover:text-white px-8 py-4 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--mindtune-neutral-900)] mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-lg text-[var(--mindtune-neutral-600)] max-w-2xl mx-auto">
              MindTune combines modern technology with proven therapeutic techniques 
              to support your mental health journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">Daily Mood Tracking</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Log your emotions with intuitive emoji selectors and journal entries
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">AI-Powered Insights</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Get personalized analysis and suggestions based on your mood patterns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center mb-4">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">Mood-Based Music</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Discover songs and playlists that match and enhance your current mood
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-accent)] rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">Therapy Activities</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Access guided exercises for breathing, meditation, and mindfulness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-accent)] rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">Progress Tracking</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Visualize your mental health journey with charts and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-[var(--mindtune-neutral-200)] hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-secondary)] rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-[var(--mindtune-neutral-800)]">Emergency Support</CardTitle>
                <CardDescription className="text-[var(--mindtune-neutral-600)]">
                  Access crisis resources and professional help when you need it most
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Mental Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who have improved their mental wellbeing with MindTune.
          </p>
          <Button 
            onClick={handleLogin}
            size="lg"
            className="bg-white text-[var(--mindtune-primary)] hover:bg-white/90 px-8 py-4 text-lg font-semibold"
          >
            Get Started for Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--mindtune-neutral-900)] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">MindTune</span>
          </div>
          <p className="text-[var(--mindtune-neutral-400)] mb-4">
            Your mental health matters. We're here to support you every step of the way.
          </p>
          <p className="text-sm text-[var(--mindtune-neutral-500)]">
            © 2024 MindTune. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </footer>
    </div>
  );
}

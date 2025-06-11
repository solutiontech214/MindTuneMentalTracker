import Header from "@/components/header";
import BottomNav from "@/components/bottom-nav";
import EmergencySupport from "@/components/emergency-support";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Phone, MessageCircle, Video, ExternalLink, BookOpen, Users, Clock } from "lucide-react";

const supportResources = [
  {
    title: "National Suicide Prevention Lifeline",
    description: "24/7 free and confidential support for people in distress",
    phone: "988",
    icon: Phone,
    urgent: true,
  },
  {
    title: "Crisis Text Line",
    description: "Free, 24/7 crisis support via text message",
    contact: "Text HOME to 741741",
    icon: MessageCircle,
    urgent: true,
  },
  {
    title: "National Alliance on Mental Illness (NAMI)",
    description: "Mental health education, support and advocacy",
    phone: "1-800-950-NAMI",
    website: "https://nami.org",
    icon: Users,
  },
  {
    title: "Substance Abuse and Mental Health Services Administration",
    description: "24/7 treatment referral and information service",
    phone: "1-800-662-4357",
    website: "https://samhsa.gov",
    icon: BookOpen,
  },
];

const selfCareResources = [
  {
    title: "Breathing Exercises",
    description: "Quick techniques to manage anxiety and stress",
    duration: "2-5 minutes",
    icon: Heart,
  },
  {
    title: "Grounding Techniques",
    description: "5-4-3-2-1 method to reconnect with the present",
    duration: "5-10 minutes", 
    icon: Clock,
  },
  {
    title: "Progressive Muscle Relaxation",
    description: "Systematic tension and release of muscle groups",
    duration: "10-20 minutes",
    icon: Heart,
  },
  {
    title: "Mindful Meditation",
    description: "Guided meditation for emotional regulation",
    duration: "5-30 minutes",
    icon: Heart,
  },
];

export default function Support() {
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-accent)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--mindtune-neutral-900)]">Support & Resources</h1>
          </div>
          <p className="text-[var(--mindtune-neutral-600)]">
            You're not alone. Here are resources and tools to help you through difficult times.
          </p>
        </div>

        {/* Emergency Support Banner */}
        <EmergencySupport />

        {/* Crisis Resources */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--mindtune-neutral-900)] mb-6">
            Crisis Support Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {supportResources.map((resource, index) => (
              <Card 
                key={index} 
                className={`border-[var(--mindtune-neutral-200)] shadow-sm ${
                  resource.urgent ? 'ring-2 ring-[var(--mindtune-accent)]/20 bg-red-50/50' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      resource.urgent 
                        ? 'bg-gradient-to-br from-[var(--mindtune-accent)] to-red-500' 
                        : 'bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)]'
                    }`}>
                      <resource.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[var(--mindtune-neutral-800)]">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-[var(--mindtune-neutral-600)]">
                        {resource.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-col space-y-2">
                    {resource.phone && (
                      <Button
                        onClick={() => handleCall(resource.phone)}
                        className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white justify-start"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call {resource.phone}
                      </Button>
                    )}
                    
                    {resource.contact && (
                      <div className="p-3 bg-[var(--mindtune-neutral-100)] rounded-lg">
                        <p className="text-sm font-medium text-[var(--mindtune-neutral-800)]">
                          {resource.contact}
                        </p>
                      </div>
                    )}
                    
                    {resource.website && (
                      <Button
                        variant="outline"
                        onClick={() => handleWebsite(resource.website!)}
                        className="justify-start"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Self-Care Tools */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-[var(--mindtune-neutral-900)] mb-6">
            Self-Care Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selfCareResources.map((tool, index) => (
              <Card key={index} className="border-[var(--mindtune-neutral-200)] shadow-sm">
                <CardHeader>
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--mindtune-secondary)] to-[var(--mindtune-primary)] rounded-xl flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[var(--mindtune-neutral-800)]">
                        {tool.title}
                      </CardTitle>
                      <CardDescription className="text-[var(--mindtune-neutral-600)]">
                        {tool.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-[var(--mindtune-neutral-500)]">
                      <Clock className="w-4 h-4" />
                      <span>{tool.duration}</span>
                    </div>
                    
                    <Button
                      size="sm"
                      className="bg-[var(--mindtune-secondary)] hover:bg-[var(--mindtune-secondary)]/90 text-white"
                    >
                      Try Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Professional Help */}
        <section>
          <Card className="border-[var(--mindtune-neutral-200)] shadow-sm bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-xl text-[var(--mindtune-neutral-900)]">
                When to Seek Professional Help
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <p className="text-[var(--mindtune-neutral-700)]">
                  Consider reaching out to a mental health professional if you're experiencing:
                </p>
                
                <ul className="space-y-2 text-[var(--mindtune-neutral-700)]">
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-[var(--mindtune-primary)] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Persistent feelings of sadness, anxiety, or hopelessness</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-[var(--mindtune-primary)] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Difficulty functioning in daily activities</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-[var(--mindtune-primary)] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Thoughts of self-harm or suicide</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-[var(--mindtune-primary)] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Substance abuse or addiction</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-2 h-2 bg-[var(--mindtune-primary)] rounded-full mt-2 flex-shrink-0"></span>
                    <span>Relationship or social difficulties</span>
                  </li>
                </ul>
                
                <div className="mt-6 p-4 bg-white/70 rounded-lg">
                  <p className="text-sm text-[var(--mindtune-neutral-600)] mb-3">
                    Remember: Seeking help is a sign of strength, not weakness. 
                    Mental health professionals are trained to help you develop coping strategies and work through challenges.
                  </p>
                  
                  <Button className="bg-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)]/90 text-white">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find a Therapist
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

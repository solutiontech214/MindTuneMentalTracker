import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Phone, MessageCircle, Video, AlertTriangle } from "lucide-react";

export default function EmergencySupport() {
  const handleCrisisHotline = () => {
    window.open('tel:988', '_self');
  };

  const handleChatSupport = () => {
    // In a real app, this would open a chat interface or redirect to a crisis chat service
    window.open('https://suicidepreventionlifeline.org/chat/', '_blank', 'noopener,noreferrer');
  };

  const handleVideoCall = () => {
    // In a real app, this would connect to a video crisis support service
    window.open('https://suicidepreventionlifeline.org/', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="mb-8">
      <Card className="bg-gradient-to-r from-[var(--mindtune-accent)] to-[var(--mindtune-primary)] text-white border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-1">Need immediate support?</h3>
              <p className="text-sm opacity-90 font-normal">
                We're here for you. Reach out to trained professionals anytime.
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={handleCrisisHotline}
              className="bg-white text-[var(--mindtune-accent)] hover:bg-white/90 font-medium py-3 px-4 h-auto flex items-center justify-center space-x-2"
            >
              <Phone className="w-4 h-4" />
              <span>Crisis Hotline</span>
            </Button>
            
            <Button 
              onClick={handleChatSupport}
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium py-3 px-4 h-auto flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat Support</span>
            </Button>
            
            <Button 
              onClick={handleVideoCall}
              variant="outline"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-medium py-3 px-4 h-auto flex items-center justify-center space-x-2"
            >
              <Video className="w-4 h-4" />
              <span>Video Call</span>
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-white/10 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium mb-1">Crisis Resources Available 24/7</p>
                <p className="text-xs opacity-90">
                  If you're having thoughts of self-harm or suicide, please reach out immediately. 
                  You can call 988 for the Suicide & Crisis Lifeline or text HOME to 741741 for the Crisis Text Line.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

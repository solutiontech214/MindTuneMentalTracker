import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Mic, Upload, Camera, User, Mail, Calendar, Heart, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Settings() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: savedMusic } = useQuery({
    queryKey: ["/api/saved-music"],
  });

  // Voice recording functionality
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "Recording started",
        description: "Speak your thoughts for voice journaling",
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice journaling",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your voice note has been saved",
      });
    }
  };

  // Image upload functionality
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setImageFile(file);
      toast({
        title: "Image selected",
        description: "Click upload to save your profile picture",
      });
    }
  };

  const uploadProfilePicture = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile picture updated",
        description: "Your new profile picture has been saved",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setImageFile(null);
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    },
  });

  const processVoiceNote = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-note.wav');
      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Transcription failed');
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Voice note processed",
        description: `Transcription: "${data.text.substring(0, 50)}..."`,
      });
      setAudioBlob(null);
    },
    onError: () => {
      toast({
        title: "Processing failed",
        description: "Voice note transcription is not available yet",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-[var(--mindtune-neutral-50)] p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--mindtune-neutral-800)]">Account Settings</h1>
          <p className="text-[var(--mindtune-neutral-600)] mt-2">Manage your profile and preferences</p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-[var(--mindtune-primary)] text-white text-xl">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{user?.firstName} {user?.lastName}</h3>
                <p className="text-[var(--mindtune-neutral-600)] flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user?.email}
                </p>
                <p className="text-sm text-[var(--mindtune-neutral-500)] flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4" />
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Profile Picture</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Choose Image
                  </Button>
                  {imageFile && (
                    <Button
                      onClick={() => uploadProfilePicture.mutate(imageFile)}
                      disabled={uploadProfilePicture.isPending}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadProfilePicture.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {imageFile && (
                  <p className="text-sm text-[var(--mindtune-neutral-600)] mt-2">
                    Selected: {imageFile.name}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Journaling Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Voice Journaling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-[var(--mindtune-neutral-600)]">
              Record voice notes to capture your thoughts and feelings
            </p>
            
            <div className="flex items-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              
              {audioBlob && (
                <Button
                  onClick={() => processVoiceNote.mutate(audioBlob)}
                  disabled={processVoiceNote.isPending}
                  variant="outline"
                >
                  {processVoiceNote.isPending ? "Processing..." : "Process Voice Note"}
                </Button>
              )}
            </div>

            {isRecording && (
              <div className="flex items-center gap-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Recording in progress...
              </div>
            )}

            {audioBlob && (
              <div className="p-3 bg-[var(--mindtune-neutral-100)] rounded-lg">
                <p className="text-sm">Voice note recorded. Click "Process Voice Note" to transcribe.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-primary)]">
                  {userStats?.totalEntries || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Mood Entries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-secondary)]">
                  {userStats?.currentStreak || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-accent)]">
                  {userStats?.weeklyActivities || 0}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--mindtune-primary)]">
                  {userStats?.averageMood?.toFixed(1) || "0.0"}
                </div>
                <div className="text-sm text-[var(--mindtune-neutral-600)]">Avg Mood</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Music Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Saved Music
            </CardTitle>
          </CardHeader>
          <CardContent>
            {savedMusic && savedMusic.length > 0 ? (
              <div className="space-y-3">
                {savedMusic.slice(0, 5).map((saved: any) => (
                  <div key={saved.id} className="flex items-center justify-between p-3 bg-[var(--mindtune-neutral-100)] rounded-lg">
                    <div>
                      <h4 className="font-medium">{saved.title}</h4>
                      <p className="text-sm text-[var(--mindtune-neutral-600)]">{saved.artist}</p>
                    </div>
                    <Badge variant="secondary">{saved.mood}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--mindtune-neutral-600)]">No saved music yet. Start exploring music recommendations!</p>
            )}
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card>
          <CardContent className="pt-6">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/api/logout"}
              className="w-full"
            >
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
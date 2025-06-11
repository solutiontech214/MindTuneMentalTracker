import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Heart, Headphones, ExternalLink, Volume2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MusicRecommendation {
  id: number;
  title: string;
  artist: string;
  mood: string;
  genre: string;
  spotifyUrl: string | null;
  youtubeUrl: string | null;
}

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<MusicRecommendation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [mood, setMood] = useState("good");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Fetch recent mood entries to determine current mood
  const { data: moodEntries } = useQuery<any[]>({
    queryKey: ["/api/mood-entries"],
  });

  // Update mood based on latest entry
  useEffect(() => {
    if (moodEntries && moodEntries.length > 0) {
      setMood(moodEntries[0].mood);
    }
  }, [moodEntries]);

  const { data: musicRecommendations, isLoading } = useQuery<MusicRecommendation[]>({
    queryKey: ["/api/music", mood],
    enabled: !!mood,
  });

  // Set initial track when recommendations load
  useEffect(() => {
    if (musicRecommendations && musicRecommendations.length > 0 && !currentTrack) {
      setCurrentTrack(musicRecommendations[0]);
    }
  }, [musicRecommendations, currentTrack]);

  const saveMusicMutation = useMutation({
    mutationFn: async (musicId: number) => {
      const response = await apiRequest("POST", "/api/saved-music", { musicId });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Music saved!",
        description: "Added to your favorites playlist.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save music.",
        variant: "destructive",
      });
    },
  });

  const handlePlayPause = () => {
    if (!currentTrack?.youtubeUrl) {
      toast({
        title: "No audio available",
        description: "This track doesn't have a playable audio source.",
        variant: "destructive",
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (track: MusicRecommendation) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const openExternalLink = (url: string | null, platform: string) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Link not available",
        description: `${platform} link is not available for this track.`,
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
            Loading Music...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-200 rounded-lg"></div>
              <div className="h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!musicRecommendations || !Array.isArray(musicRecommendations) || musicRecommendations.length === 0) {
    return (
      <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
            Music for Your Mood
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[var(--mindtune-neutral-600)]">No music recommendations available for your current mood.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
          Music for {mood} mood
        </CardTitle>
        <Music className="w-5 h-5 text-[var(--mindtune-primary)]" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Playing Track */}
        {currentTrack && (
          <div className="music-card rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <button onClick={handlePlayPause} className="text-white">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </button>
                </div>
                <div>
                  <h4 className="font-medium">{currentTrack.title}</h4>
                  <p className="text-sm opacity-90">{currentTrack.artist}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => saveMusicMutation.mutate(currentTrack.id)}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                {currentTrack.spotifyUrl && (
                  <button
                    onClick={() => openExternalLink(currentTrack.spotifyUrl, 'Spotify')}
                    className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 opacity-75" />
              <div className="flex-1 bg-white bg-opacity-20 rounded-full h-1">
                <div className="bg-white h-1 rounded-full w-1/3"></div>
              </div>
              <span className="text-xs opacity-75">{currentTrack.genre}</span>
            </div>
          </div>
        )}

        {/* Recommended Tracks */}
        <div className="space-y-3">
          <h4 className="font-medium text-[var(--mindtune-neutral-800)]">Recommended for you</h4>
          {musicRecommendations.slice(0, 3).map((track) => (
            <div 
              key={track.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--mindtune-neutral-50)] transition-colors cursor-pointer"
              onClick={() => handleTrackSelect(track)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{track.title}</h4>
                <p className="text-xs text-[var(--mindtune-neutral-600)]">{track.artist} • {track.genre}</p>
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openExternalLink(track.youtubeUrl, 'YouTube');
                  }}
                  className="w-8 h-8 rounded-full bg-[var(--mindtune-neutral-100)] flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Play className="w-3 h-3" />
                </button>
                {track.spotifyUrl && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openExternalLink(track.spotifyUrl, 'Spotify');
                    }}
                    className="w-8 h-8 rounded-full bg-[var(--mindtune-neutral-100)] flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

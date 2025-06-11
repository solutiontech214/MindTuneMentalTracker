import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Heart, Headphones } from "lucide-react";

// Mock music data for now
const mockMusicData = [
  {
    id: 1,
    title: "Good as Hell",
    artist: "Lizzo",
    mood: "great",
    genre: "Pop",
    spotifyUrl: null,
    youtubeUrl: null,
  },
  {
    id: 2,
    title: "Happy",
    artist: "Pharrell Williams", 
    mood: "great",
    genre: "Pop",
    spotifyUrl: null,
    youtubeUrl: null,
  },
  {
    id: 3,
    title: "Sunflower",
    artist: "Post Malone",
    mood: "good",
    genre: "Hip-Hop",
    spotifyUrl: null,
    youtubeUrl: null,
  },
];

export default function MusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState(mockMusicData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(83); // 1:23 in seconds
  const [duration] = useState(236); // 3:56 in seconds

  // In a real app, this would fetch based on user's current mood
  const mood = "great";

  const { data: musicRecommendations } = useQuery({
    queryKey: ["/api/music", mood],
    enabled: false, // Disable for now, use mock data
  });

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <Card className="border-[var(--mindtune-neutral-200)] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-lg font-semibold text-[var(--mindtune-neutral-800)]">
          Music for Your Mood
        </CardTitle>
        <Music className="w-5 h-5 text-[var(--mindtune-primary)]" />
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Playing Track */}
        <div className="music-card rounded-xl p-4 text-white">
          <div className="flex items-center space-x-3 mb-3">
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
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white bg-opacity-20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs opacity-75">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Recommended Tracks */}
        <div className="space-y-3">
          {mockMusicData.slice(1).map((track) => (
            <div 
              key={track.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[var(--mindtune-neutral-50)] transition-colors cursor-pointer"
              onClick={() => setCurrentTrack(track)}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--mindtune-primary)] to-[var(--mindtune-secondary)] rounded-lg flex items-center justify-center">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">{track.title}</h4>
                <p className="text-xs text-[var(--mindtune-neutral-600)]">{track.artist}</p>
              </div>
              <button className="w-8 h-8 rounded-full bg-[var(--mindtune-neutral-100)] flex items-center justify-center hover:bg-[var(--mindtune-primary)] hover:text-white transition-colors">
                <Play className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <Button 
          variant="outline"
          className="w-full border-[var(--mindtune-primary)] text-[var(--mindtune-primary)] hover:bg-[var(--mindtune-primary)] hover:text-white"
        >
          View Full Playlist
        </Button>
      </CardContent>
    </Card>
  );
}

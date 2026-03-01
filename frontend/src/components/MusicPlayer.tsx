import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function MusicPlayer() {
  const { currentTrack, isPlaying, play, pause, volume, setVolume } = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 z-50 rounded-none border-t">
      <div className="container py-4">
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/album-placeholder.dim_300x300.png"
            alt={currentTrack.title}
            className="h-14 w-14 rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" disabled>
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={() => (isPlaying ? pause() : play(currentTrack))}
              className="bg-gradient-to-r from-orange-500 to-coral-500 hover:from-orange-600 hover:to-coral-600"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button size="icon" variant="ghost" disabled>
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          <div className="hidden md:flex items-center gap-2 w-32">
            <Volume2 className="h-4 w-4" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={1}
              step={0.01}
              className="flex-1"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-muted-foreground w-12 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={duration || 100}
            step={0.1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-12">{formatTime(duration)}</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={currentTrack.audio.getDirectURL()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
    </Card>
  );
}

import { type TrackNoAlbum } from '../backend';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock } from 'lucide-react';

interface TrackListProps {
  tracks: TrackNoAlbum[];
}

function formatDuration(seconds: bigint): string {
  const totalSeconds = Number(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function TrackList({ tracks }: TrackListProps) {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No tracks available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tracks.map((track) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;

        return (
          <Card key={track.id.toString()} className={`p-4 hover:bg-accent/50 transition-colors ${isCurrentTrack ? 'ring-2 ring-primary' : ''}`}>
            <div className="flex items-center gap-4">
              <Button
                size="icon"
                variant={isCurrentlyPlaying ? "default" : "ghost"}
                onClick={() => (isCurrentlyPlaying ? pause() : play(track))}
                className="shrink-0"
              >
                {isCurrentlyPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <img
                src="/assets/generated/album-placeholder.dim_300x300.png"
                alt={track.title}
                className="h-12 w-12 rounded"
              />
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isCurrentTrack ? 'text-primary' : ''}`}>{track.title}</p>
                <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(track.duration)}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

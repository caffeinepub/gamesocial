import { type PodcastEpisode } from '../backend';
import { useAudioPlayer } from '../contexts/AudioPlayerContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock } from 'lucide-react';

interface EpisodeListProps {
  episodes: PodcastEpisode[];
  podcastTitle: string;
}

function formatDuration(seconds: bigint): string {
  const totalSeconds = Number(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function EpisodeList({ episodes, podcastTitle }: EpisodeListProps) {
  const { currentTrack, isPlaying, play, pause } = useAudioPlayer();

  return (
    <div className="mt-4 space-y-2">
      {episodes.map((episode, index) => {
        const episodeAsTrack = {
          id: BigInt(Date.now() + index),
          title: episode.title,
          artist: podcastTitle,
          duration: episode.duration,
          audio: episode.audio,
        };
        const isCurrentEpisode = currentTrack?.title === episode.title && currentTrack?.artist === podcastTitle;
        const isCurrentlyPlaying = isCurrentEpisode && isPlaying;

        return (
          <div 
            key={index} 
            className={`flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors ${isCurrentEpisode ? 'bg-accent ring-2 ring-primary' : ''}`}
          >
            <Button
              size="sm"
              variant={isCurrentlyPlaying ? "default" : "ghost"}
              onClick={() => (isCurrentlyPlaying ? pause() : play(episodeAsTrack))}
              className="shrink-0 mt-1"
            >
              {isCurrentlyPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${isCurrentEpisode ? 'text-primary' : ''}`}>{episode.title}</p>
              {episode.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{episode.description}</p>
              )}
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(episode.duration)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

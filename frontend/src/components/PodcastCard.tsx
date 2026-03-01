import { type PodcastView } from '../backend';
import { useState } from 'react';
import EpisodeList from './EpisodeList';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PodcastCardProps {
  podcast: PodcastView;
}

export default function PodcastCard({ podcast }: PodcastCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start gap-3">
          <img
            src="/assets/generated/podcast-icon.dim_128x128.png"
            alt={podcast.title}
            className="h-16 w-16 rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{podcast.title}</CardTitle>
            <CardDescription className="mt-1">
              <span className="font-medium">{podcast.host}</span>
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">{podcast.episodes.length} episodes</p>
          </div>
        </div>
        {podcast.description && (
          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{podcast.description}</p>
        )}
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              Hide Episodes <ChevronUp className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              Show Episodes <ChevronDown className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        {expanded && <EpisodeList episodes={podcast.episodes} podcastTitle={podcast.title} />}
      </CardContent>
    </Card>
  );
}

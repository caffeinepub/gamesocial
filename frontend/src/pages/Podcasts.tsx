import { useGetPodcasts } from '../hooks/useQueries';
import PodcastCard from '../components/PodcastCard';
import { Loader2, Mic } from 'lucide-react';

export default function Podcasts() {
  const { data: podcasts, isLoading, error } = useGetPodcasts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-destructive">Failed to load podcasts</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <Mic className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Podcasts</h1>
          <p className="text-sm text-muted-foreground">{podcasts?.length || 0} podcasts available</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts && podcasts.length > 0 ? (
          podcasts.map((podcast) => <PodcastCard key={podcast.id.toString()} podcast={podcast} />)
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Mic className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No podcasts available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

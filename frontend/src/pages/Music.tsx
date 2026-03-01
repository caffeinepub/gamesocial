import { useGetMusicLibrary } from '../hooks/useQueries';
import TrackList from '../components/TrackList';
import PlaylistManager from '../components/PlaylistManager';
import { Loader2, Music as MusicIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Music() {
  const { data: tracks, isLoading, error } = useGetMusicLibrary();

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
        <p className="text-destructive">Failed to load music library</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <MusicIcon className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Music</h1>
          <p className="text-sm text-muted-foreground">{tracks?.length || 0} tracks available</p>
        </div>
      </div>

      <Tabs defaultValue="library" className="w-full">
        <TabsList>
          <TabsTrigger value="library">Library</TabsTrigger>
          <TabsTrigger value="playlists">Playlists</TabsTrigger>
        </TabsList>
        <TabsContent value="library" className="mt-6">
          <TrackList tracks={tracks || []} />
        </TabsContent>
        <TabsContent value="playlists" className="mt-6">
          <PlaylistManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

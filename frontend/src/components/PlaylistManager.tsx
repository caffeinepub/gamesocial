import { useState } from 'react';
import { useCreatePlaylist } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Loader2 } from 'lucide-react';

export default function PlaylistManager() {
  const [playlistName, setPlaylistName] = useState('');
  const [playlists, setPlaylists] = useState<Array<{ name: string }>>([]);
  const createPlaylist = useCreatePlaylist();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    const newPlaylist = await createPlaylist.mutateAsync(playlistName.trim());
    setPlaylists([...playlists, newPlaylist]);
    setPlaylistName('');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlistName">Create New Playlist</Label>
            <div className="flex gap-2">
              <Input
                id="playlistName"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={createPlaylist.isPending || !playlistName.trim()}
                className="bg-gradient-to-r from-orange-500 to-coral-500"
              >
                {createPlaylist.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <Card key={index} className="p-4">
              <p className="font-medium">{playlist.name}</p>
              <p className="text-sm text-muted-foreground">0 tracks</p>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>No playlists yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

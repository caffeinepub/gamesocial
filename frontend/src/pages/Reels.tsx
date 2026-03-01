import { useGetFeed } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ReelCard from '../components/ReelCard';
import { Loader2 } from 'lucide-react';
import { Section } from '../backend';

export default function Reels() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  const { data: posts, isLoading } = useGetFeed(principal);

  const reels = posts?.filter((post) => post.sections.includes(Section.reels)) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-3xl font-bold mb-6">Reels</h1>
      {reels.length > 0 ? (
        reels.map((reel) => <ReelCard key={reel.id} reel={reel} />)
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No reels available yet.</p>
        </div>
      )}
    </div>
  );
}

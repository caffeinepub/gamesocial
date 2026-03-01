import { type PostView } from '../backend';
import { Card } from '@/components/ui/card';

interface UserPostGridProps {
  posts: PostView[];
}

export default function UserPostGrid({ posts }: UserPostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No posts yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      {posts.map((post) => (
        <Card key={post.id} className="aspect-square overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
          {post.image ? (
            <img src={post.image.getDirectURL()} alt={post.caption} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-coral-500 flex items-center justify-center p-4">
              <p className="text-white text-sm text-center line-clamp-3">{post.caption}</p>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

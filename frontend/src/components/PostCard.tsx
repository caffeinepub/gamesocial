import { type PostView } from '../backend';
import { useGetUserProfile, useLikePost } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import CommentSection from './CommentSection';
import VerificationBadge from './VerificationBadge';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';

interface PostCardProps {
  post: PostView;
}

export default function PostCard({ post }: PostCardProps) {
  const { identity } = useInternetIdentity();
  const { data: authorProfile } = useGetUserProfile(post.author);
  const likePost = useLikePost();
  const [showComments, setShowComments] = useState(false);

  const isLiked = identity ? post.likes.some((p) => p.toString() === identity.getPrincipal().toString()) : false;

  const handleLike = () => {
    likePost.mutate(post.id);
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            {authorProfile?.profilePicture ? (
              <AvatarImage src={authorProfile.profilePicture.getDirectURL()} />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-coral-500 text-white">
              {authorProfile?.name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{authorProfile?.name || 'Unknown User'}</span>
              <VerificationBadge verified={authorProfile?.verified || false} />
            </div>
            <span className="text-sm text-muted-foreground">{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
      </CardHeader>
      {post.image && (
        <div className="px-6">
          <img
            src={post.image.getDirectURL()}
            alt={post.caption}
            className="w-full rounded-lg object-cover max-h-[500px]"
          />
        </div>
      )}
      <CardContent className="pt-4">
        <p className="text-sm">{post.caption}</p>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="flex items-center gap-4 w-full">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={isLiked ? 'text-orange-500' : ''}
            disabled={likePost.isPending}
          >
            <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="mr-2 h-4 w-4" />
            {post.comments.length}
          </Button>
        </div>
        {showComments && <CommentSection postId={post.id} comments={post.comments} />}
      </CardFooter>
    </Card>
  );
}

import { useState } from 'react';
import { type Comment } from '../backend';
import { useAddComment, useGetUserProfile } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
}

export default function CommentSection({ postId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const addComment = useAddComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await addComment.mutateAsync({ postId, text: newComment.trim() });
    setNewComment('');
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        {comments.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1"
        />
        <Button
          type="submit"
          size="icon"
          disabled={addComment.isPending || !newComment.trim()}
          className="bg-gradient-to-r from-orange-500 to-coral-500"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const { data: authorProfile } = useGetUserProfile(comment.author);

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex gap-2 text-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{authorProfile?.name || 'Unknown User'}</span>
          <VerificationBadge verified={authorProfile?.verified || false} />
          <span className="text-muted-foreground text-xs">{formatTimestamp(comment.timestamp)}</span>
        </div>
        <p className="text-muted-foreground">{comment.text}</p>
      </div>
    </div>
  );
}

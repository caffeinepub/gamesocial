import { useState } from 'react';
import { useCreatePost } from '../hooks/useQueries';
import { ExternalBlob } from '../backend';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface CreatePostFormProps {
  onSuccess?: () => void;
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    let imageBlob: ExternalBlob | null = null;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      imageBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await createPost.mutateAsync({
      id: postId,
      caption: caption.trim(),
      image: imageBlob,
    });

    setCaption('');
    setImageFile(null);
    setUploadProgress(0);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="caption">Caption *</Label>
        <Textarea
          id="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="image">Image (optional)</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Label>Upload Progress</Label>
          <Progress value={uploadProgress} />
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-coral-500 hover:from-orange-600 hover:to-coral-600"
        disabled={createPost.isPending || !caption.trim()}
      >
        {createPost.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Create Post
          </>
        )}
      </Button>
    </form>
  );
}

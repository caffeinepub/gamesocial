import { useState } from 'react';
import { type UserProfile } from '../backend';
import { ExternalBlob } from '../backend';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface EditProfileFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

export default function EditProfileForm({ profile, onSuccess }: EditProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let profilePicture = profile.profilePicture;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      profilePicture = ExternalBlob.fromBytes(uint8Array);
    }

    await saveProfile.mutateAsync({
      name: name.trim(),
      bio: bio.trim(),
      theme: profile.theme,
      verified: profile.verified,
      profilePicture,
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-coral-500 hover:from-orange-600 hover:to-coral-600"
        disabled={saveProfile.isPending || !name.trim()}
      >
        {saveProfile.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
}

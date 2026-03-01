import { useState } from 'react';
import { type UserProfile } from '../backend';
import VerificationBadge from './VerificationBadge';
import EditProfileForm from './EditProfileForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ profile, isOwnProfile }: ProfileHeaderProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Avatar className="h-32 w-32">
        {profile.profilePicture ? <AvatarImage src={profile.profilePicture.getDirectURL()} /> : null}
        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-coral-500 text-white text-4xl">
          {profile.name[0]?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <VerificationBadge verified={profile.verified} className="w-6 h-6" />
          {isOwnProfile && (
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <EditProfileForm profile={profile} onSuccess={() => setEditDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
        {profile.bio && <p className="text-muted-foreground">{profile.bio}</p>}
        {profile.theme && profile.theme !== 'default' && (
          <div className="text-sm text-muted-foreground">Theme: {profile.theme}</div>
        )}
      </div>
    </div>
  );
}

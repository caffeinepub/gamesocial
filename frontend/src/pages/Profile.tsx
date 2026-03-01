import { useParams } from '@tanstack/react-router';
import { useGetUserProfile, useGetFeed } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';
import ProfileHeader from '../components/ProfileHeader';
import UserPostGrid from '../components/UserPostGrid';
import { Loader2 } from 'lucide-react';

export default function Profile() {
  const { userId } = useParams({ from: '/profile/$userId' });
  const { identity } = useInternetIdentity();
  const principal = Principal.fromText(userId);
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(principal);
  const callerPrincipal = identity?.getPrincipal();
  const { data: allPosts } = useGetFeed(callerPrincipal);

  const userPosts = allPosts?.filter((post) => post.author.toString() === userId) || [];
  const isOwnProfile = identity?.getPrincipal().toString() === userId;

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
      <UserPostGrid posts={userPosts} />
    </div>
  );
}

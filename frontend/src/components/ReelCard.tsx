import { type PostView } from '../backend';
import { useGetUserProfile } from '../hooks/useQueries';
import VerificationBadge from './VerificationBadge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReelCardProps {
  reel: PostView;
}

export default function ReelCard({ reel }: ReelCardProps) {
  const { data: authorProfile } = useGetUserProfile(reel.author);

  return (
    <Card className="overflow-hidden">
      {reel.image && (
        <div className="relative aspect-[9/16] bg-black">
          <video
            src={reel.image.getDirectURL()}
            controls
            className="w-full h-full object-contain"
            playsInline
          />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Avatar className="h-8 w-8 border-2 border-white">
                {authorProfile?.profilePicture ? (
                  <AvatarImage src={authorProfile.profilePicture.getDirectURL()} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-coral-500">
                  {authorProfile?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{authorProfile?.name || 'Unknown User'}</span>
                <VerificationBadge verified={authorProfile?.verified || false} />
              </div>
            </div>
            <p className="text-sm">{reel.caption}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

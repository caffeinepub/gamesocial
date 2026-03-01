import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ProfileSetupModal from './ProfileSetupModal';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (loginStatus !== 'initializing' && !identity) {
      navigate({ to: '/' });
    }
  }, [identity, loginStatus, navigate]);

  if (loginStatus === 'initializing') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!identity) {
    return null;
  }

  return (
    <>
      <ProfileSetupModal />
      {children}
    </>
  );
}

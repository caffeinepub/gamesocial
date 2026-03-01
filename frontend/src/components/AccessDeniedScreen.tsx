import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

export default function AccessDeniedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <ShieldAlert className="h-24 w-24 text-orange-500" />
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground max-w-md">
          You don't have permission to access this page. This area is restricted to administrators only.
        </p>
      </div>
      <Button onClick={() => navigate({ to: '/' })} className="bg-gradient-to-r from-orange-500 to-coral-500">
        Go Home
      </Button>
    </div>
  );
}

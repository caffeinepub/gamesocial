import { useIsCallerAdmin } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import { Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="p-6 rounded-xl border border-border bg-card">
        <p className="text-muted-foreground">Admin features coming soon...</p>
      </div>
    </div>
  );
}

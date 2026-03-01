import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Film, MessageCircle, Mic } from 'lucide-react';

export default function Home() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/feed' });
    }
  }, [identity, navigate]);

  return (
    <div className="space-y-12">
      <section className="relative rounded-2xl overflow-hidden">
        <img
          src="/assets/generated/hero-banner.dim_1200x400.png"
          alt="Lunita"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="container">
            <div className="max-w-2xl space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src="/assets/generated/lunita-logo-new.dim_512x512.png" 
                  alt="Lunita Logo" 
                  className="h-20 w-20"
                />
                <h1 className="text-5xl font-bold text-white">Lunita</h1>
              </div>
              <h2 className="text-4xl font-bold text-white">
                Connect, Share, and Groove Together
              </h2>
              <p className="text-xl text-white/90">
                The ultimate social platform combining music, podcasts, and meaningful connections.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 hover:from-purple-600 hover:via-indigo-600 hover:to-teal-600 text-lg px-8 shadow-glow"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={Film}
          title="Share Your Moments"
          description="Post photos and videos, create reels, and share your story with the world."
          gradient="from-purple-500 to-indigo-500"
        />
        <FeatureCard
          icon={MessageCircle}
          title="Stay Connected"
          description="Chat with friends, create groups, and customize your messaging experience."
          gradient="from-indigo-500 to-teal-500"
        />
        <FeatureCard
          icon={Music}
          title="Stream Music"
          description="Discover and play your favorite tracks, create playlists, and enjoy endless music."
          gradient="from-teal-500 to-purple-500"
        />
        <FeatureCard
          icon={Mic}
          title="Listen to Podcasts"
          description="Explore engaging podcasts, subscribe to your favorites, and never miss an episode."
          gradient="from-purple-600 to-teal-600"
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, gradient }: { icon: any; title: string; description: string; gradient: string }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card hover:shadow-glow transition-all duration-300">
      <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

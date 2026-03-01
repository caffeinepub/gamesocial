import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Home, Film, MessageCircle, Music, Mic, User, Shield } from 'lucide-react';
import LoginButton from './LoginButton';
import ThemeToggle from './ThemeToggle';
import BottomNavigation from './BottomNavigation';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();
  const isAuthenticated = !!identity;

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Film, label: 'Feed', path: '/feed', authRequired: true },
    { icon: Film, label: 'Reels', path: '/reels', authRequired: true },
    { icon: MessageCircle, label: 'Messages', path: '/messages', authRequired: true },
    { icon: Music, label: 'Music', path: '/music', authRequired: true },
    { icon: Mic, label: 'Podcasts', path: '/podcasts', authRequired: true },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/assets/generated/lunita-logo-new.dim_512x512.png" alt="Lunita" className="h-10 w-10" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-teal-500 bg-clip-text text-transparent">
                Lunita
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.authRequired && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={() => navigate({ to: `/profile/${identity.getPrincipal().toString()}` })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-purple-500"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="container py-6 pb-20 md:pb-6">{children}</main>
      <BottomNavigation />
      <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-12">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Lunita</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <span className="text-purple-500">❤</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-purple-500 transition-colors"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

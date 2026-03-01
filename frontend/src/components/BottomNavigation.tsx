import { Link, useLocation } from '@tanstack/react-router';
import { Home, Film, Music, MessageCircle, Mic } from 'lucide-react';

export default function BottomNavigation() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Film, label: 'Reels', path: '/reels' },
    { icon: Music, label: 'Music', path: '/music' },
    { icon: MessageCircle, label: 'Chat', path: '/messages' },
    { icon: Mic, label: 'Podcasts', path: '/podcasts' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

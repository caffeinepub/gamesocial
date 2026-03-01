import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Reels from './pages/Reels';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Music from './pages/Music';
import Podcasts from './pages/Podcasts';
import AdminPanel from './pages/AdminPanel';
import AuthGuard from './components/AuthGuard';
import MusicPlayer from './components/MusicPlayer';
import { AudioPlayerProvider } from './contexts/AudioPlayerContext';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Layout>
        <Outlet />
      </Layout>
      <MusicPlayer />
      <Toaster />
    </>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: () => (
    <AuthGuard>
      <Feed />
    </AuthGuard>
  ),
});

const reelsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reels',
  component: () => (
    <AuthGuard>
      <Reels />
    </AuthGuard>
  ),
});

const messagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: () => (
    <AuthGuard>
      <Messages />
    </AuthGuard>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: () => (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  ),
});

const musicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/music',
  component: () => (
    <AuthGuard>
      <Music />
    </AuthGuard>
  ),
});

const podcastsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/podcasts',
  component: () => (
    <AuthGuard>
      <Podcasts />
    </AuthGuard>
  ),
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AuthGuard>
      <AdminPanel />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  feedRoute,
  reelsRoute,
  messagesRoute,
  profileRoute,
  musicRoute,
  podcastsRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AudioPlayerProvider>
        <RouterProvider router={router} />
      </AudioPlayerProvider>
    </ThemeProvider>
  );
}

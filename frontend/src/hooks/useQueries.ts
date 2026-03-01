import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import { type UserProfile, type TrackNoAlbum, type PlaylistView, type PodcastView } from '../backend';
import { toast } from 'sonner';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: Principal) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save profile');
      console.error('Save profile error:', error);
    },
  });
}

export function useGetFeed(userId: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['feed', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getFeed(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreatePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, caption, image }: { id: string; caption: string; image: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPost(id, caption, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Post created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create post');
      console.error('Create post error:', error);
    },
  });
}

export function useLikePost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likePost(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
    onError: (error) => {
      toast.error('Failed to like post');
      console.error('Like post error:', error);
    },
  });
}

export function useAddComment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addComment(postId, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      toast.success('Comment added');
    },
    onError: (error) => {
      toast.error('Failed to add comment');
      console.error('Add comment error:', error);
    },
  });
}

export function useGetMusicLibrary() {
  const { actor, isFetching } = useActor();

  return useQuery<TrackNoAlbum[]>({
    queryKey: ['musicLibrary'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMusicLibrary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePlaylist() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPlaylist(name);
    },
    onSuccess: () => {
      toast.success('Playlist created');
    },
    onError: (error) => {
      toast.error('Failed to create playlist');
      console.error('Create playlist error:', error);
    },
  });
}

export function useGetPodcasts() {
  const { actor, isFetching } = useActor();

  return useQuery<PodcastView[]>({
    queryKey: ['podcasts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPodcasts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface PlaylistView {
    tracks: Array<TrackNoAlbum>;
    name: string;
}
export type Time = bigint;
export interface Comment {
    text: string;
    author: Principal;
    timestamp: Time;
}
export interface PodcastView {
    id: bigint;
    title: string;
    episodes: Array<PodcastEpisode>;
    host: string;
    description: string;
}
export interface PostView {
    id: string;
    author: Principal;
    likes: Array<Principal>;
    timestamp: Time;
    caption: string;
    image?: ExternalBlob;
    sections: Array<Section>;
    comments: Array<Comment>;
}
export interface PodcastEpisode {
    title: string;
    duration: bigint;
    audio: ExternalBlob;
    description: string;
}
export interface Message {
    text: string;
    sender: Principal;
    timestamp: Time;
}
export interface TrackNoAlbum {
    id: bigint;
    title: string;
    duration: bigint;
    audio: ExternalBlob;
    artist: string;
}
export interface UserProfile {
    bio: string;
    theme: string;
    verified: boolean;
    name: string;
    profilePicture?: ExternalBlob;
}
export enum Section {
    music = "music",
    messages = "messages",
    podcasts = "podcasts",
    posts = "posts",
    reels = "reels"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addComment(postId: string, text: string): Promise<void>;
    addPodcast(podcastView: PodcastView): Promise<void>;
    addTrack(track: TrackNoAlbum): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createPlaylist(name: string): Promise<PlaylistView>;
    createPost(id: string, caption: string, image: ExternalBlob | null): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFeed(userId: Principal): Promise<Array<PostView>>;
    getMusicLibrary(): Promise<Array<TrackNoAlbum>>;
    getPodcasts(): Promise<Array<PodcastView>>;
    getUserProfile(userId: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(postId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(conversationId: string, message: Message): Promise<void>;
}

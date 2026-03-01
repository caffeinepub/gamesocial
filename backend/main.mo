import Map "mo:core/Map";
import Set "mo:core/Set";
import List "mo:core/List";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let posts = Map.empty<Text, Post>();
  let feed = List.empty<Post>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let messages = Map.empty<Text, List.List<Message>>();
  let musicLibrary = Set.empty<TrackNoAlbum>();
  let podcastLibrary = Set.empty<Podcast>();

  public type Section = {
    #posts;
    #reels;
    #messages;
    #music;
    #podcasts;
  };

  public type Post = {
    id : Text;
    author : Principal;
    caption : Text;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
    likes : Set.Set<Principal>;
    comments : List.List<Comment>;
    sections : Set.Set<Section>;
  };

  public type PostView = {
    id : Text;
    author : Principal;
    caption : Text;
    timestamp : Time.Time;
    image : ?Storage.ExternalBlob;
    likes : [Principal];
    comments : [Comment];
    sections : [Section];
  };

  public type Comment = {
    author : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  public type Message = {
    sender : Principal;
    text : Text;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    profilePicture : ?Storage.ExternalBlob;
    theme : Text;
    verified : Bool;
  };

  public type TrackNoAlbum = {
    id : Nat;
    title : Text;
    artist : Text;
    duration : Nat; // Duration in seconds
    audio : Storage.ExternalBlob;
  };

  module TrackNoAlbum {
    public func compare(t1 : TrackNoAlbum, t2 : TrackNoAlbum) : Order.Order {
      if (t1.id < t2.id) {
        #less;
      } else if (t1.id > t2.id) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type Playlist = {
    name : Text;
    tracks : List.List<TrackNoAlbum>;
  };

  public type PlaylistView = {
    name : Text;
    tracks : [TrackNoAlbum];
  };

  public type Podcast = {
    id : Nat;
    title : Text;
    description : Text;
    host : Text;
    episodes : List.List<PodcastEpisode>;
  };

  public type PodcastView = {
    id : Nat;
    title : Text;
    description : Text;
    host : Text;
    episodes : [PodcastEpisode];
  };

  module Podcast {
    public func compare(p1 : Podcast, p2 : Podcast) : Order.Order {
      if (p1.id < p2.id) {
        #less;
      } else if (p1.id > p2.id) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  public type PodcastEpisode = {
    title : Text;
    description : Text;
    audio : Storage.ExternalBlob;
    duration : Nat; // Duration in seconds
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(userId);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createPost(id : Text, caption : Text, image : ?Storage.ExternalBlob) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create posts");
    };
    let post : Post = {
      id;
      author = caller;
      caption;
      timestamp = Time.now();
      image;
      likes = Set.empty<Principal>();
      comments = List.empty<Comment>();
      sections = Set.empty<Section>();
    };
    posts.add(id, post);
    feed.add(post);
  };

  public shared ({ caller }) func likePost(postId : Text) : async () {
    switch (posts.get(postId)) {
      case (?post) {
        post.likes.add(caller);
      };
      case (_) { Runtime.trap("Post not found") };
    };
  };

  public shared ({ caller }) func addComment(postId : Text, text : Text) : async () {
    let comment : Comment = {
      author = caller;
      text;
      timestamp = Time.now();
    };
    switch (posts.get(postId)) {
      case (?post) {
        post.comments.add(comment);
      };
      case (_) { Runtime.trap("Post not found") };
    };
  };

  func toPostView(post : Post) : PostView {
    {
      post with
      comments = post.comments.toArray();
      likes = post.likes.toArray();
      sections = post.sections.toArray();
    };
  };

  public query ({ caller }) func getFeed(userId : Principal) : async [PostView] {
    if (userProfiles.get(userId) == null) {
      Runtime.trap("User profile not found");
    };
    feed.toArray().map(toPostView);
  };

  public shared ({ caller }) func sendMessage(conversationId : Text, message : Message) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can send messages");
    };

    if (message.sender != caller) {
      Runtime.trap("Unauthorized: Cannot send messages on behalf of another user");
    };

    let messagesList = switch (messages.get(conversationId)) {
      case (?existingMessages) { existingMessages };
      case (null) { List.empty<Message>() };
    };

    messagesList.add(message);

    let updatedMessages = messagesList;
    messages.add(conversationId, updatedMessages);
  };

  public shared ({ caller }) func addTrack(track : TrackNoAlbum) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add tracks");
    };
    musicLibrary.add(track);
  };

  public query ({ caller }) func getMusicLibrary() : async [TrackNoAlbum] {
    musicLibrary.toArray().sort();
  };

  public shared ({ caller }) func createPlaylist(name : Text) : async PlaylistView {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create playlists");
    };
    { name; tracks = List.empty<TrackNoAlbum>().toArray() };
  };

  public shared ({ caller }) func addPodcast(podcastView : PodcastView) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add podcasts");
    };
    let episodesList = List.fromArray<PodcastEpisode>(podcastView.episodes);
    let podcast : Podcast = { podcastView with episodes = episodesList };
    podcastLibrary.add(podcast);
  };

  func toPodcastView(podcast : Podcast) : PodcastView {
    { podcast with episodes = podcast.episodes.toArray() };
  };

  public query ({ caller }) func getPodcasts() : async [PodcastView] {
    podcastLibrary.toArray().map(toPodcastView);
  };
};


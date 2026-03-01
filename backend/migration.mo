import Set "mo:core/Set";
import List "mo:core/List";
import Order "mo:core/Order";
import Storage "blob-storage/Storage";
import Text "mo:core/Text";

module {
  type OldTrack = {
    id : Nat;
    title : Text;
    artist : Text;
    audio : Storage.ExternalBlob;
  };

  module OldTrack {
    public func compare(t1 : OldTrack, t2 : OldTrack) : Order.Order {
      if (t1.id < t2.id) {
        #less;
      } else if (t1.id > t2.id) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type OldPodcast = {
    id : Nat;
    title : Text;
    episodes : List.List<OldPodcastEpisode>;
  };

  module OldPodcast {
    public func compare(p1 : OldPodcast, p2 : OldPodcast) : Order.Order {
      if (p1.id < p2.id) {
        #less;
      } else if (p1.id > p2.id) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  type OldPodcastEpisode = {
    title : Text;
    audio : Storage.ExternalBlob;
  };

  // New types after the upgrade
  type TrackNoAlbum = {
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

  type Podcast = {
    id : Nat;
    title : Text;
    description : Text;
    host : Text;
    episodes : List.List<PodcastEpisode>;
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

  type PodcastEpisode = {
    title : Text;
    description : Text;
    audio : Storage.ExternalBlob;
    duration : Nat; // Duration in seconds
  };

  type OldActor = {
    musicLibrary : Set.Set<OldTrack>;
    podcastLibrary : Set.Set<OldPodcast>;
  };

  type NewActor = {
    musicLibrary : Set.Set<TrackNoAlbum>;
    podcastLibrary : Set.Set<Podcast>;
  };

  public func run(old : OldActor) : NewActor {
    let newMusicLibrary = old.musicLibrary.map<OldTrack, TrackNoAlbum>(
      func(oldTrack) {
        {
          oldTrack with
          duration = 0; // Default duration as old tracks don't have this info
        };
      }
    );

    let newPodcastLibrary = old.podcastLibrary.map<OldPodcast, Podcast>(
      func(oldPodcast) {
        {
          oldPodcast with
          description = "";
          host = "";
          episodes = oldPodcast.episodes.map<OldPodcastEpisode, PodcastEpisode>(
            func(oldEpisode) {
              {
                oldEpisode with
                description = "";
                duration = 0;
              };
            }
          );
        };
      }
    );

    {
      musicLibrary = newMusicLibrary;
      podcastLibrary = newPodcastLibrary;
    };
  };
};


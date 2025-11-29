export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  genres: string[];
  followers: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyRecentlyPlayed {
  track: SpotifyTrack;
  played_at: string;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
}

export interface SpotifyRecentlyPlayedResponse {
  items: SpotifyRecentlyPlayed[];
}
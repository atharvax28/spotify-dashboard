export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres?: string[];
  images?: SpotifyImage[];
  popularity?: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyUser {
  display_name: string;
  email: string;
  id: string;
  images: SpotifyImage[];
  product: string;
  followers: {
    total: number;
  };
}

export interface PlayHistory {
  track: SpotifyTrack;
  played_at: string;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
}

export interface AudioFeatures {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  id: string;
}

// Internal app types
export interface DashboardData {
  user: SpotifyUser | null;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentTracks: PlayHistory[];
  audioFeatures: AudioFeatures[];
  isLoading: boolean;
  error: string | null;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
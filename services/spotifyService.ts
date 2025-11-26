
import { SpotifyTrack, SpotifyUser, SpotifyArtist, PlayHistory, AudioFeatures, TimeRange } from '../types';
import { getAccessToken, logout } from '../utils/spotifyAuth';

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const token = getAccessToken();
  
  // If no token (and not running in demo mode which is handled by the caller catching the error), throw error
  if (!token) {
     throw new Error("NO_TOKEN");
  }

  try {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        logout(); // Auto-logout on expired token
        throw new Error("TOKEN_EXPIRED");
      }
      throw new Error(`API Error: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
}

export const getDashboardData = async (timeRange: TimeRange = 'short_term'): Promise<{
  user: SpotifyUser;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentTracks: PlayHistory[];
  audioFeatures: AudioFeatures[];
}> => {
  try {
    // 1. Fetch User, Top Tracks, Top Artists, Recently Played
    // We handle the potential lack of token in fetchWebApi or here
    if (!getAccessToken()) {
      throw new Error("Demo Mode"); // Force fallback to mock data
    }

    const [user, topTracksData, topArtistsData, recentTracksData] = await Promise.all([
      fetchWebApi('v1/me', 'GET'),
      fetchWebApi(`v1/me/top/tracks?time_range=${timeRange}&limit=20`, 'GET'),
      fetchWebApi(`v1/me/top/artists?time_range=${timeRange}&limit=10`, 'GET'),
      fetchWebApi('v1/me/player/recently-played?limit=20', 'GET'),
    ]);

    const topTracks = topTracksData.items;
    
    // 2. Fetch Audio Features for Top Tracks (requires IDs)
    let audioFeatures: AudioFeatures[] = [];
    if (topTracks.length > 0) {
      const ids = topTracks.map((t: SpotifyTrack) => t.id).join(',');
      const featuresData = await fetchWebApi(`v1/audio-features?ids=${ids}`, 'GET');
      audioFeatures = featuresData.audio_features;
    }

    return {
      user,
      topTracks,
      topArtists: topArtistsData.items,
      recentTracks: recentTracksData.items,
      audioFeatures
    };
  } catch (error: any) {
    console.warn("Falling back to mock data:", error.message);
    return getMockData();
  }
};

// --- MOCK DATA GENERATOR ---
export function getMockData() {
  const mockImages = (seed: number) => [
    { height: 640, width: 640, url: `https://picsum.photos/640/640?random=${seed}` },
    { height: 300, width: 300, url: `https://picsum.photos/300/300?random=${seed}` },
    { height: 64, width: 64, url: `https://picsum.photos/64/64?random=${seed}` }
  ];

  const user: SpotifyUser = {
    id: 'mock_user',
    display_name: 'Demo User',
    email: 'demo@example.com',
    product: 'premium',
    images: [{ url: 'https://picsum.photos/seed/user/200', height: 200, width: 200 }],
    followers: { total: 12543 }
  };

  const artistsList = ['The Weeknd', 'Taylor Swift', 'Drake', 'Bad Bunny', 'BTS', 'Dua Lipa', 'Harry Styles', 'Arctic Monkeys', 'Kendrick Lamar', 'SZA'];
  const genresList = ['pop', 'r&b', 'rap', 'latino', 'k-pop', 'dance pop', 'rock', 'indie', 'hip hop', 'soul'];

  const topArtists: SpotifyArtist[] = Array.from({ length: 10 }).map((_, i) => ({
    id: `fav_artist_${i}`,
    name: artistsList[i],
    popularity: 90 + i,
    genres: [genresList[i], genresList[(i + 1) % genresList.length]],
    images: mockImages(i + 10),
    external_urls: { spotify: '#' }
  }));

  const tracksNames = ['Midnight City', 'Blinding Lights', 'As It Was', 'Heat Waves', 'Stay', 'Levitating', 'Peaches', 'Bad Habits', 'Shivers', 'Cold Heart', 'Anti-Hero', 'Rich Flex', 'Kill Bill', 'Creepin', 'Flowers', 'Die For You', 'Boys a liar', 'Last Night', 'Calm Down', 'Daylight'];

  const topTracks: SpotifyTrack[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `track_${i}`,
    name: tracksNames[i],
    popularity: 95 - (i * 2),
    duration_ms: 180000 + Math.random() * 60000,
    preview_url: null,
    external_urls: { spotify: '#' },
    album: {
      id: `album_${i}`,
      name: `Album ${i + 1}`,
      images: mockImages(i),
      release_date: '2023-01-01'
    },
    artists: [{
      id: `artist_${i}`,
      name: artistsList[i % artistsList.length],
      external_urls: { spotify: '#' }
    }]
  }));

  const recentTracks: PlayHistory[] = Array.from({ length: 15 }).map((_, i) => ({
    track: topTracks[i % topTracks.length],
    played_at: new Date(Date.now() - i * 15 * 60000).toISOString(),
    context: null
  }));

  const audioFeatures: AudioFeatures[] = topTracks.map(t => ({
    id: t.id,
    danceability: 0.4 + Math.random() * 0.5,
    energy: 0.4 + Math.random() * 0.6,
    key: Math.floor(Math.random() * 11),
    loudness: -5 - Math.random() * 5,
    mode: 1,
    speechiness: 0.05 + Math.random() * 0.2,
    acousticness: Math.random() * 0.4,
    instrumentalness: Math.random() * 0.1,
    liveness: 0.1 + Math.random() * 0.3,
    valence: 0.2 + Math.random() * 0.8,
    tempo: 90 + Math.random() * 60
  }));

  return { user, topTracks, topArtists, recentTracks, audioFeatures };
}

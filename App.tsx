
import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopTracks } from './components/TopTracks';
import { OverviewChart } from './components/OverviewChart';
import { AudioFeaturesChart } from './components/AudioFeaturesChart';
import { RecentActivity } from './components/RecentActivity';
import { TopGenres } from './components/TopGenres';
import { Login } from './components/Login';
import { getDashboardData } from './services/spotifyService';
import { getTokenFromUrl, setAccessToken, getAccessToken, logout } from './utils/spotifyAuth';
import { SpotifyUser, SpotifyTrack, SpotifyArtist, PlayHistory, AudioFeatures, TimeRange } from './types';
import { 
  Bell, 
  Search, 
  User, 
  Activity,
  Users,
  ListMusic,
  PlayCircle,
  Clock,
  Music4,
  BarChart3,
  LogOut
} from 'lucide-react';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<SpotifyUser | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [recentTracks, setRecentTracks] = useState<PlayHistory[]>([]);
  const [audioFeatures, setAudioFeatures] = useState<AudioFeatures[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('short_term');
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // --- POPUP HANDLER START ---
    // If this instance is running inside a popup (window.opener exists)
    // and has a hash (redirected from Spotify), pass token to parent and close.
    const urlToken = getTokenFromUrl();
    if (urlToken && window.opener) {
      window.opener.postMessage({ type: 'SPOTIFY_LOGIN_SUCCESS', token: urlToken }, '*');
      window.close();
      return;
    }
    // --- POPUP HANDLER END ---

    // Standard App Initialization
    if (urlToken) {
      // Fallback for non-popup redirect flow
      setAccessToken(urlToken);
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (e) { console.warn(e); }
      setToken(urlToken);
    } else {
      const storedToken = getAccessToken();
      if (storedToken) {
        setToken(storedToken);
      }
    }
    setLoading(false);

    const handleLogout = () => {
      setToken(null);
      setUserData(null);
      setTopTracks([]);
      setTopArtists([]);
      setRecentTracks([]);
      setAudioFeatures([]);
      setIsDemo(false);
    };

    window.addEventListener('spotify_logout', handleLogout);
    return () => window.removeEventListener('spotify_logout', handleLogout);
  }, []);

  useEffect(() => {
    if (!token && !isDemo) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getDashboardData(timeRange);
        setUserData(data.user);
        setTopTracks(data.topTracks);
        setTopArtists(data.topArtists);
        setRecentTracks(data.recentTracks);
        setAudioFeatures(data.audioFeatures);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, timeRange, isDemo]);

  const getTimeRangeLabel = (range: TimeRange) => {
    switch (range) {
      case 'short_term': return 'Last 4 Weeks';
      case 'medium_term': return 'Last 6 Months';
      case 'long_term': return 'Lifetime';
    }
  };

  const handleDemoLogin = () => {
    setIsDemo(true);
  };

  const handleLoginSuccess = (newToken: string) => {
    setAccessToken(newToken);
    setToken(newToken);
  };

  // If we are in the "Popup" state (redirected with token), we return null 
  // to avoid rendering the full app before window.close() triggers.
  if (getTokenFromUrl() && window.opener) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b] text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#1DB954] border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!token && !isDemo) {
    if (loading) return null;
    return <Login onDemoLogin={handleDemoLogin} onLoginSuccess={handleLoginSuccess} />;
  }

  if (loading && !userData) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-4">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
           <p className="text-sm text-muted-foreground animate-pulse">
             {isDemo ? 'Generating demo data...' : 'Analyzing your music profile...'}
           </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased flex">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
          <div className="flex h-16 items-center px-6">
            <div className="hidden md:flex items-center gap-2 text-lg font-semibold md:text-xl">
               <span className="text-spotify-green">Stats</span> Dashboard
               {isDemo && <span className="text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground ml-2">DEMO MODE</span>}
            </div>
            
            <div className="ml-auto flex items-center space-x-4">
              <div className="relative hidden sm:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="w-64 rounded-full border border-input bg-accent/50 pl-8 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all hover:bg-accent"
                />
              </div>
              <button className="relative rounded-full p-2 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                 <Bell className="h-5 w-5" />
                 <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-spotify-green ring-2 ring-background"></span>
              </button>
              
              <div className="flex items-center gap-2 py-1 px-2 rounded-full border border-transparent hover:border-border transition-colors">
                <div className="h-7 w-7 rounded-full overflow-hidden border border-border">
                  {userData?.images?.[0]?.url ? (
                    <img src={userData.images[0].url} alt="User" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline-block pr-1">{userData?.display_name || 'User'}</span>
              </div>

              <button 
                onClick={() => {
                  logout();
                }}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 space-y-6 p-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Your Statistics</h2>
              <p className="text-muted-foreground mt-1">Deep dive into your listening habits.</p>
            </div>
            <div className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg border border-border">
              {(['short_term', 'medium_term', 'long_term'] as TimeRange[]).map((range) => (
                <button 
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    timeRange === range 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                  }`}
                >
                  {getTimeRangeLabel(range)}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden group">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Top Artist</h3>
                <Music4 className="h-4 w-4 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold truncate relative z-10">{topArtists[0]?.name || '-'}</div>
              <div className="absolute -bottom-4 -right-4 opacity-10 rotate-12 transition-transform group-hover:scale-110 group-hover:opacity-20">
                 <img src={topArtists[0]?.images?.[0]?.url} className="w-24 h-24 rounded-full" alt="" />
              </div>
            </div>
            
            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Vibe Score</h3>
                <Activity className="h-4 w-4 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold">
                {audioFeatures.length > 0 
                  ? Math.round((audioFeatures.reduce((acc, curr) => acc + curr.energy, 0) / audioFeatures.length) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Avg. Energy Level</p>
            </div>

            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Unique Genres</h3>
                <ListMusic className="h-4 w-4 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold">
                {new Set(topArtists.flatMap(a => a.genres)).size}
              </div>
              <p className="text-xs text-muted-foreground">In your top artists</p>
            </div>

            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Followers</h3>
                <Users className="h-4 w-4 text-spotify-green" />
              </div>
              <div className="text-2xl font-bold">{userData?.followers?.total.toLocaleString() || 0}</div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Content Left - 4 cols */}
            <div className="col-span-4 space-y-6">
               {/* Popularity Chart */}
               <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                <div className="p-6 pb-2">
                  <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-spotify-green" />
                    Track Popularity
                  </h3>
                </div>
                <div className="p-6 pt-0 pl-2">
                  <OverviewChart tracks={topTracks} />
                </div>
              </div>

               {/* Top Tracks List */}
              <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                    <PlayCircle className="h-4 w-4 text-spotify-green" />
                    Top Tracks
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your most played tracks for this period.
                  </p>
                </div>
                <div className="p-6 pt-0">
                  <TopTracks tracks={topTracks} />
                </div>
              </div>
            </div>

            {/* Main Content Right - 3 cols */}
            <div className="col-span-3 space-y-6">
               {/* Audio Features Radar */}
               <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                  <div className="p-6 pb-2">
                    <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                       <Activity className="h-4 w-4 text-spotify-green" />
                       Audio Aura
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Analysis of your music's sonic attributes.</p>
                  </div>
                  <div className="p-6 pt-0">
                    <AudioFeaturesChart features={audioFeatures} />
                  </div>
               </div>

               {/* Top Genres */}
               <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                  <div className="p-6 pb-4">
                    <h3 className="font-semibold leading-none tracking-tight">Top Genres</h3>
                  </div>
                  <div className="p-6 pt-0">
                    <TopGenres artists={topArtists} />
                  </div>
               </div>

               {/* Recent Activity */}
               <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                  <div className="p-6 pb-4">
                    <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2">
                       <Clock className="h-4 w-4 text-spotify-green" />
                       Recently Played
                    </h3>
                  </div>
                  <div className="p-6 pt-0">
                    <RecentActivity history={recentTracks} />
                  </div>
               </div>
            </div>
          </div>
          
          {/* Top Artists Row */}
           <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-semibold leading-none tracking-tight">Top Artists</h3>
                 <span className="text-xs text-muted-foreground">Sorted by affinity</span>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
                {topArtists.map((artist, i) => (
                  <div key={artist.id} className="flex flex-col items-center space-y-2 min-w-[120px] group cursor-pointer">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-2 border-border shadow-md transition-all group-hover:scale-105 group-hover:border-spotify-green relative">
                      <img 
                        src={artist.images?.[0]?.url || 'https://picsum.photos/200'} 
                        alt={artist.name} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-bold text-xl">
                        #{i + 1}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-center truncate w-full group-hover:text-spotify-green transition-colors">{artist.name}</span>
                  </div>
                ))}
              </div>
           </div>

        </div>
      </main>
    </div>
  );
}

export default App;

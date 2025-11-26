import React from 'react';
import { SpotifyTrack } from '../types';

interface TopTracksProps {
  tracks: SpotifyTrack[];
}

export const TopTracks: React.FC<TopTracksProps> = ({ tracks }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
  };

  return (
    <div className="space-y-8">
      {tracks.map((track) => (
        <div key={track.id} className="flex items-center">
          <div className="h-9 w-9 relative rounded overflow-hidden mr-4 border border-border">
            <img
              src={track.album.images[2]?.url || track.album.images[0]?.url}
              alt={track.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none text-foreground truncate max-w-[200px] sm:max-w-xs">
              {track.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {track.artists.map(a => a.name).join(', ')}
            </p>
          </div>
          <div className="font-medium text-sm text-foreground tabular-nums">
             {formatDuration(track.duration_ms)}
          </div>
        </div>
      ))}
    </div>
  );
};

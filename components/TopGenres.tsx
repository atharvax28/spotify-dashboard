import React from 'react';
import { SpotifyArtist } from '../types';

interface TopGenresProps {
  artists: SpotifyArtist[];
}

export const TopGenres: React.FC<TopGenresProps> = ({ artists }) => {
  // Aggregate genres
  const genreCounts: Record<string, number> = {};
  let totalGenres = 0;

  artists.forEach(artist => {
    artist.genres?.forEach(genre => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      totalGenres++;
    });
  });

  const sortedGenres = Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / totalGenres) * 100)
    }));

  return (
    <div className="space-y-4">
      {sortedGenres.map((genre, index) => (
        <div key={genre.name} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span className="capitalize font-medium">{genre.name}</span>
            <span className="text-muted-foreground">{genre.percentage}%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-spotify-green/80 rounded-full" 
              style={{ width: `${genre.percentage * 2.5}%` /* Artificial scale for visual impact if needed, or straight percentage */ }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
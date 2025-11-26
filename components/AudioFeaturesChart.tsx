import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { AudioFeatures } from '../types';

interface AudioFeaturesChartProps {
  features: AudioFeatures[];
}

export const AudioFeaturesChart: React.FC<AudioFeaturesChartProps> = ({ features }) => {
  if (!features || features.length === 0) return null;

  // Calculate average features
  const average = features.reduce((acc, curr) => ({
    danceability: acc.danceability + curr.danceability,
    energy: acc.energy + curr.energy,
    valence: acc.valence + curr.valence,
    acousticness: acc.acousticness + curr.acousticness,
    instrumentalness: acc.instrumentalness + curr.instrumentalness,
    speechiness: acc.speechiness + curr.speechiness,
  }), { danceability: 0, energy: 0, valence: 0, acousticness: 0, instrumentalness: 0, speechiness: 0 });

  const count = features.length;
  const data = [
    { subject: 'Danceability', A: (average.danceability / count).toFixed(2), fullMark: 1 },
    { subject: 'Energy', A: (average.energy / count).toFixed(2), fullMark: 1 },
    { subject: 'Valence', A: (average.valence / count).toFixed(2), fullMark: 1 },
    { subject: 'Acoustic', A: (average.acousticness / count).toFixed(2), fullMark: 1 },
    { subject: 'Instrumental', A: (average.instrumentalness / count).toFixed(2), fullMark: 1 },
    { subject: 'Speechiness', A: (average.speechiness / count).toFixed(2), fullMark: 1 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#3f3f46" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
          <Radar
            name="My Vibe"
            dataKey="A"
            stroke="#1DB954"
            strokeWidth={2}
            fill="#1DB954"
            fillOpacity={0.3}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fafafa' }}
            itemStyle={{ color: '#1DB954' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { SpotifyTrack } from '../types';

interface OverviewChartProps {
  tracks: SpotifyTrack[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded shadow-xl text-xs">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        <p className="text-muted-foreground">
          Popularity: <span className="text-spotify-green font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const OverviewChart: React.FC<OverviewChartProps> = ({ tracks }) => {
  const data = tracks.map(t => ({
    name: t.name,
    popularity: t.popularity
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip cursor={{fill: '#27272a', opacity: 0.4}} content={<CustomTooltip />} />
        <Bar
          dataKey="popularity"
          fill="#fafafa"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

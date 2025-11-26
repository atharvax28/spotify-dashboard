import React from 'react';
import { PlayHistory } from '../types';
import { Clock } from 'lucide-react';

interface RecentActivityProps {
  history: PlayHistory[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ history }) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <div key={`${item.track.id}-${index}`} className="flex items-center group hover:bg-accent/30 p-2 rounded-lg transition-colors">
           <div className="h-10 w-10 relative rounded overflow-hidden mr-4 border border-border flex-shrink-0">
            <img
              src={item.track.album.images[2]?.url || item.track.album.images[0]?.url}
              alt={item.track.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium leading-none text-foreground truncate">
              {item.track.name}
            </p>
            <p className="text-xs text-muted-foreground truncate mt-1">
              {item.track.artists.map(a => a.name).join(', ')}
            </p>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap ml-2">
             <Clock className="h-3 w-3" />
             {formatTimeAgo(item.played_at)}
          </div>
        </div>
      ))}
    </div>
  );
};
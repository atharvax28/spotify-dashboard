import React from 'react';
import { 
  LayoutDashboard, 
  Music2, 
  Radio, 
  Library, 
  Mic2, 
  ListMusic, 
  UserCircle,
  Settings,
  PlusCircle
} from 'lucide-react';

export const Sidebar = () => {
  return (
    <div className="pb-12 w-64 border-r border-border hidden md:block bg-background h-screen sticky top-0">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <button className="w-full justify-start text-left font-medium bg-secondary text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Listen Now
            </button>
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Music2 className="h-4 w-4" />
              Browse
            </button>
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Radio
            </button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              Playlists
            </button>
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Mic2 className="h-4 w-4" />
              Songs
            </button>
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Made for You
            </button>
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
              <Library className="h-4 w-4" />
              Albums
            </button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <div className="space-y-1 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
            {['Heavy Rotation', 'Chill Vibes', 'Gym Workout', 'Focus Flow', 'Coding Mode', 'Late Night Jazz', 'Discover Weekly', 'Release Radar'].map((playlist, i) => (
              <button key={i} className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors truncate">
                {playlist}
              </button>
            ))}
            <button className="w-full justify-start text-left font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 px-4 py-2 rounded-md transition-colors flex items-center gap-2 mt-4">
               <PlusCircle className="h-4 w-4" />
               New Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

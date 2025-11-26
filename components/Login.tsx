
import React, { useState, useEffect } from 'react';
import { loginWithPopup, setClientId, getClientId, getRedirectUri } from '../utils/spotifyAuth';
import { Settings, ExternalLink, Copy, Check } from 'lucide-react';

interface LoginProps {
  onDemoLogin: () => void;
  onLoginSuccess: (token: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onDemoLogin, onLoginSuccess }) => {
  const [clientIdInput, setClientIdInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const storedId = getClientId();
    setClientIdInput(storedId);
    // If no ID is stored, show settings immediately so user knows what to do
    if (!storedId) {
      setShowSettings(true);
    }
  }, []);

  const handleLogin = async () => {
    if (!clientIdInput) {
      setError('Please enter a Client ID first.');
      setShowSettings(true);
      return;
    }

    setClientId(clientIdInput);
    setIsAuthenticating(true);
    setError('');

    try {
      const token = await loginWithPopup(clientIdInput);
      onLoginSuccess(token);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check your Client ID and Redirect URI.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const copyRedirectUri = () => {
    const uri = getRedirectUri();
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-spotify-green/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center shadow-lg shadow-spotify-green/20">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.019.6-1.141 4.38-1.379 9.901-.719 13.561 1.56.42.24.539.84.18 1.26zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Stats Dashboard</h1>
          <p className="text-muted-foreground text-lg">Visualize your top genres, tracks, and audio aura.</p>
        </div>

        <div className="bg-card p-8 rounded-xl border border-border shadow-2xl space-y-6">
           <div className="space-y-4">
              <button 
                onClick={handleLogin}
                disabled={isAuthenticating}
                className="w-full bg-spotify-green hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3.5 px-4 rounded-full transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-base"
              >
                {isAuthenticating ? (
                  <>
                    <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  'Connect with Spotify'
                )}
              </button>
              
              <button 
                onClick={onDemoLogin}
                className="w-full bg-secondary hover:bg-secondary/80 text-white font-medium py-3.5 px-4 rounded-full transition-colors border border-border text-sm"
              >
                Try Demo Mode
              </button>
           </div>

           {error && (
             <div className="text-red-400 text-sm text-center bg-red-900/10 border border-red-900/20 p-3 rounded-lg animate-in fade-in slide-in-from-top-1">
               {error}
             </div>
           )}

           <div className="pt-2">
             {!showSettings && (
               <button 
                 onClick={() => setShowSettings(true)}
                 className="flex items-center gap-2 text-xs text-muted-foreground hover:text-white transition-colors mx-auto"
               >
                 <Settings className="h-3 w-3" />
                 Configure Client ID
               </button>
             )}

             {showSettings && (
               <div className="mt-2 space-y-4 animate-in fade-in slide-in-from-top-2 bg-muted/30 p-4 rounded-lg border border-border">
                 <div className="space-y-2">
                   <div className="flex justify-between items-center">
                     <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Client ID</label>
                     <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-[10px] text-spotify-green hover:underline flex items-center gap-1">
                       Get ID <ExternalLink className="h-2 w-2" />
                     </a>
                   </div>
                   <input 
                     type="text" 
                     value={clientIdInput}
                     onChange={(e) => {
                       setClientIdInput(e.target.value);
                       setError('');
                     }}
                     placeholder="e.g. 8b9c..."
                     className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-spotify-green transition-shadow"
                   />
                 </div>
                 
                 <div className="text-[11px] text-muted-foreground space-y-2 bg-background p-3 rounded border border-border">
                    <p className="font-medium text-foreground">Setup Instructions:</p>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Go to Spotify Developer Dashboard.</li>
                      <li>Create an app and copy the <strong>Client ID</strong>.</li>
                      <li>Add this EXACT URL to <strong>Redirect URIs</strong>:</li>
                    </ol>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-muted/50 p-2 rounded text-xs text-spotify-green break-all font-mono border border-border">
                        {getRedirectUri()}
                      </code>
                      <button 
                        onClick={copyRedirectUri}
                        className="p-2 bg-secondary hover:bg-accent rounded-md transition-colors flex-shrink-0"
                        title="Copy to clipboard"
                      >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                 </div>
               </div>
             )}
           </div>
        </div>

        <div className="text-center text-xs text-muted-foreground/60 max-w-xs mx-auto">
          <p>This app runs entirely in your browser. Your token is stored locally and never sent to any third-party server.</p>
        </div>
      </div>
    </div>
  );
};

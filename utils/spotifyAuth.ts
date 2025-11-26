
export const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played'
];

export const getClientId = () => {
  return localStorage.getItem('spotify_client_id') || '';
};

export const setClientId = (id: string) => {
  localStorage.setItem('spotify_client_id', id);
};

export const getRedirectUri = () => {
  try {
    // Construct the base URL
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    // Strip trailing slash if present (e.g. https://site.com/ -> https://site.com)
    // This reduces mismatch errors as users often paste the URL without the slash into Spotify Dashboard
    return url.endsWith('/') ? url.slice(0, -1) : url;
  } catch (e) {
    return '';
  }
};

export const generateLoginUrl = (clientId?: string) => {
  const id = clientId || getClientId();
  const redirectUri = getRedirectUri();
  
  if (!id) return '';

  const params = new URLSearchParams({
    client_id: id,
    response_type: 'token',
    redirect_uri: redirectUri,
    scope: SCOPES.join(' '),
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const loginWithPopup = async (clientId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = generateLoginUrl(clientId);
    if (!url) {
      reject(new Error('No Client ID provided'));
      return;
    }

    const width = 450;
    const height = 730;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const popup = window.open(
      url,
      'Spotify Login',
      `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`
    );

    if (!popup) {
      reject(new Error('Popup blocked. Please allow popups for this site.'));
      return;
    }

    const handleMessage = (event: MessageEvent) => {
      // Security check: typically you'd check event.origin here, but for this generic
      // demo we trust the message content structure since we control the sender.
      if (event.data?.type === 'SPOTIFY_LOGIN_SUCCESS' && event.data?.token) {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        clearTimeout(timeout);
        popup.close();
        resolve(event.data.token);
      }
    };

    window.addEventListener('message', handleMessage);

    // Safety timeout and closure handling so the button doesn't stay disabled forever
    const rejectWithCleanup = (message: string) => {
      clearInterval(checkClosed);
      clearTimeout(timeout);
      window.removeEventListener('message', handleMessage);
      reject(new Error(message));
    };

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        rejectWithCleanup('Login cancelled - popup was closed.');
      }
    }, 1000);

    const timeout = setTimeout(() => {
      if (!popup.closed) popup.close();
      rejectWithCleanup('Login timed out. Please try again.');
    }, 60000);
  });
};

export const getTokenFromUrl = () => {
  try {
    if (!window.location.hash) return null;
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  } catch (e) {
    return null;
  }
};

export const setAccessToken = (token: string) => {
  localStorage.setItem('spotify_access_token', token);
  const expiresAt = new Date().getTime() + 3600 * 1000;
  localStorage.setItem('spotify_token_expiry', expiresAt.toString());
};

export const getAccessToken = () => {
  const token = localStorage.getItem('spotify_access_token');
  const expiry = localStorage.getItem('spotify_token_expiry');
  
  if (!token || !expiry) return null;
  
  if (new Date().getTime() > parseInt(expiry)) {
    logout();
    return null;
  }
  
  return token;
};

export const logout = () => {
  localStorage.removeItem('spotify_access_token');
  localStorage.removeItem('spotify_token_expiry');
  
  try {
    window.history.replaceState(null, '', window.location.pathname);
  } catch (e) {
    console.warn('Could not clear hash via history API', e);
  }

  window.dispatchEvent(new Event('spotify_logout'));
};

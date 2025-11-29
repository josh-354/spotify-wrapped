const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:5191/';

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'user-read-currently-playing'
].join(' ');

export const getAuthUrl = (): string => {
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.append('client_id', CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('scope', SCOPES);
  authUrl.searchParams.append('show_dialog', 'true');
  
  return authUrl.toString();
};

export const exchangeCodeForToken = async (code: string): Promise<string> => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to exchange code for token');
  }

  const data = await response.json();
  return data.access_token;
};

export const spotifyFetch = async (endpoint: string, accessToken: string) => {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
};

export const getTopTracks = (accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 10) => {
  return spotifyFetch(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`, accessToken);
};

export const getTopArtists = (accessToken: string, timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term', limit: number = 10) => {
  return spotifyFetch(`/me/top/artists?time_range=${timeRange}&limit=${limit}`, accessToken);
};

export const getRecentlyPlayed = (accessToken: string, limit: number = 10) => {
  return spotifyFetch(`/me/player/recently-played?limit=${limit}`, accessToken);
};
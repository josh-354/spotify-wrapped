import { useState, useEffect } from 'react'
import { getAuthUrl, exchangeCodeForToken, getTopTracks, getTopArtists, getRecentlyPlayed } from './utils/spotify'
import './components/Dashboard.css'

function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('App mounted, checking for token...')
    
    // Check if we have a token in localStorage
    const storedToken = localStorage.getItem('spotify_access_token')
    if (storedToken) {
      console.log('Found stored token')
      setAccessToken(storedToken)
      setLoading(false)
      return
    }

    // Check for authorization code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code) {
      console.log('Found auth code, exchanging for token...')
      exchangeCodeForToken(code)
        .then(token => {
          console.log('Successfully got token')
          setAccessToken(token)
          localStorage.setItem('spotify_access_token', token)
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        })
        .catch(error => {
          console.error('Failed to get access token:', error)
          setError('Failed to authenticate with Spotify')
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    console.log('Redirecting to Spotify login...')
    try {
      const authUrl = getAuthUrl()
      console.log('Auth URL:', authUrl)
      window.location.href = authUrl
    } catch (error) {
      console.error('Error creating auth URL:', error)
      setError('Failed to create login URL')
    }
  }

  const handleLogout = () => {
    setAccessToken(null)
    localStorage.removeItem('spotify_access_token')
    setError(null)
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-text">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="login-container">
        <h1 className="app-title">My Spotify Dashboard</h1>
        <div style={{ color: '#ff4444', marginBottom: '20px' }}>{error}</div>
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#b3b3b3' }}>
          <p>CLIENT_ID: {import.meta.env.VITE_CLIENT_ID || 'MISSING'}</p>
          <p>CLIENT_SECRET: {import.meta.env.VITE_CLIENT_SECRET ? 'LOADED' : 'MISSING'}</p>
        </div>
        <button className="login-button" onClick={handleLogin}>
          Try Login Again
        </button>
      </div>
    )
  }

  if (!accessToken) {
    return (
      <div className="login-container">
        <h1 className="app-title">My Spotify Dashboard</h1>
        <div style={{ marginBottom: '20px', fontSize: '14px', color: '#b3b3b3' }}>
          <p>CLIENT_ID: {import.meta.env.VITE_CLIENT_ID || 'MISSING'}</p>
          <p>CLIENT_SECRET: {import.meta.env.VITE_CLIENT_SECRET ? 'LOADED' : 'MISSING'}</p>
        </div>
        <button className="login-button" onClick={handleLogin}>
          Login with Spotify
        </button>
      </div>
    )
  }

  const [topTracks, setTopTracks] = useState<any>(null);
  const [topArtists, setTopArtists] = useState<any>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const loadSpotifyData = async () => {
    try {
      setDataLoading(true);
      setDataError(null);
      console.log('Loading Spotify data...');
      
      const [tracks, artists, recent] = await Promise.all([
        getTopTracks(accessToken, 'medium_term', 3),
        getTopArtists(accessToken, 'medium_term', 3),
        getRecentlyPlayed(accessToken, 3)
      ]);

      console.log('Data loaded:', { tracks, artists, recent });
      setTopTracks(tracks);
      setTopArtists(artists);
      setRecentlyPlayed(recent);
    } catch (err) {
      console.error('Failed to load Spotify data:', err);
      setDataError('Failed to load Spotify data');
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="status-indicator"></div>
      </div>
      
      <button 
        onClick={handleLogout}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          background: '#1ed760',
          color: 'black',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: '600',
          zIndex: 1000
        }}
      >
        Logout
      </button>

      <div style={{ padding: '40px', textAlign: 'center' }}>
        {!topTracks && !dataLoading && !dataError && (
          <button 
            onClick={loadSpotifyData}
            className="login-button"
          >
            Load My Spotify Data
          </button>
        )}

        {dataLoading && (
          <div className="loading-text">Loading your Spotify data...</div>
        )}

        {dataError && (
          <div style={{ color: '#ff4444', marginBottom: '20px' }}>
            {dataError}
            <br />
            <button onClick={loadSpotifyData} className="login-button" style={{ marginTop: '10px' }}>
              Try Again
            </button>
          </div>
        )}

        {topTracks && (
          <div className="dashboard-content">
            <div className="dashboard-section">
              <h2 className="section-title">TOP TRACKS</h2>
              <div className="section-content">
                {topTracks.items?.slice(0, 3).map((track: any, index: number) => (
                  <div key={track.id} className="track-item">
                    <span className="track-number">{index + 1}</span>
                    <div className="track-info">
                      <div className="track-name">{track.name}</div>
                      <div className="track-artist">{track.artists[0]?.name}</div>
                    </div>
                  </div>
                )) || <div className="empty-state">No tracks available</div>}
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className="section-title">TOP ARTIST</h2>
              <div className="section-content">
                {topArtists.items?.slice(0, 3).map((artist: any, index: number) => (
                  <div key={artist.id} className="track-item">
                    <span className="track-number">{index + 1}</span>
                    <div className="track-info">
                      <div className="track-name">{artist.name}</div>
                      <div className="track-artist">{artist.followers.total.toLocaleString()} followers</div>
                    </div>
                  </div>
                )) || <div className="empty-state">No artists available</div>}
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className="section-title">RECENTLY PLAYED</h2>
              <div className="section-content">
                {recentlyPlayed.items?.slice(0, 3).map((item: any, index: number) => (
                  <div key={`${item.track.id}-${item.played_at}`} className="track-item">
                    <span className="track-number">{index + 1}</span>
                    <div className="track-info">
                      <div className="track-name">{item.track.name}</div>
                      <div className="track-artist">{item.track.artists[0]?.name}</div>
                    </div>
                  </div>
                )) || <div className="empty-state">No recent tracks</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App

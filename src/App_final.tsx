import { useState, useEffect } from 'react'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [spotifyData, setSpotifyData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored token
    const storedToken = localStorage.getItem('spotify_access_token')
    if (storedToken) {
      setAccessToken(storedToken)
      setIsAuthenticated(true)
      setLoading(false)
      return
    }

    // Check for auth code
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    
    if (code) {
      // Exchange code for token
      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://127.0.0.1:5192/',
        }),
      })
      .then(res => res.json())
      .then(data => {
        if (data.access_token) {
          setAccessToken(data.access_token)
          setIsAuthenticated(true)
          localStorage.setItem('spotify_access_token', data.access_token)
          window.history.replaceState({}, document.title, window.location.pathname)
        } else {
          setError('Authentication failed')
        }
        setLoading(false)
      })
      .catch(err => {
        setError('Authentication error')
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = () => {
    const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
      client_id: import.meta.env.VITE_CLIENT_ID,
      response_type: 'code',
      redirect_uri: 'http://127.0.0.1:5192/',
      scope: 'user-read-private user-read-email user-top-read user-read-recently-played',
      show_dialog: 'true'
    }).toString()
    
    window.location.href = authUrl
  }

  const handleLogout = () => {
    setAccessToken(null)
    setIsAuthenticated(false)
    setSpotifyData(null)
    localStorage.removeItem('spotify_access_token')
    setError(null)
  }

  const loadData = async () => {
    if (!accessToken) return
    
    setDataLoading(true)
    setError(null)
    
    try {
      const headers = { 'Authorization': `Bearer ${accessToken}` }
      
      const [topTracksRes, topArtistsRes, recentRes] = await Promise.all([
        fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=3', { headers }),
        fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=3', { headers }),
        fetch('https://api.spotify.com/v1/me/player/recently-played?limit=3', { headers })
      ])

      const [topTracks, topArtists, recent] = await Promise.all([
        topTracksRes.json(),
        topArtistsRes.json(),
        recentRes.json()
      ])

      setSpotifyData({ topTracks, topArtists, recent })
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setDataLoading(false)
    }
  }

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#2a2a2a',
    color: 'white',
    fontFamily: 'system-ui'
  }

  const centerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    padding: '20px'
  }

  const buttonStyle = {
    backgroundColor: '#1ed760',
    color: 'black',
    border: 'none',
    borderRadius: '50px',
    padding: '15px 40px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    margin: '10px'
  }

  const dashboardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const sectionStyle = {
    backgroundColor: '#3a3a3a',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '300px'
  }

  const titleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#b3b3b3',
    marginBottom: '20px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }

  const itemStyle = {
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  }

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <h1>🎵 Spotify Dashboard</h1>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (error && !isAuthenticated) {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <h1>🎵 Spotify Dashboard</h1>
          <p style={{ color: '#ff4444' }}>{error}</p>
          <button style={buttonStyle} onClick={handleLogin}>
            Try Login Again
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <h1>🎵 My Spotify Dashboard</h1>
          <p>Connect your Spotify account to see your music data</p>
          <button style={buttonStyle} onClick={handleLogin}>
            Login with Spotify
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      {/* Header with status indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 40px' }}>
        <button
          style={{
            ...buttonStyle,
            padding: '8px 16px',
            fontSize: '12px',
            borderRadius: '20px'
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
        <div style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#1ed760',
          borderRadius: '50%'
        }}></div>
      </div>

      {!spotifyData && !dataLoading && (
        <div style={centerStyle}>
          <h1>✅ Connected to Spotify!</h1>
          <p>Ready to load your music data</p>
          <button style={buttonStyle} onClick={loadData}>
            Load My Music Data
          </button>
        </div>
      )}

      {dataLoading && (
        <div style={centerStyle}>
          <h1>Loading your music data...</h1>
        </div>
      )}

      {error && isAuthenticated && (
        <div style={centerStyle}>
          <h1>Error Loading Data</h1>
          <p style={{ color: '#ff4444' }}>{error}</p>
          <button style={buttonStyle} onClick={loadData}>
            Try Again
          </button>
        </div>
      )}

      {spotifyData && (
        <div style={dashboardStyle}>
          {/* Top Tracks */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>TOP TRACKS</h2>
            {spotifyData.topTracks.items?.slice(0, 3).map((track: any, index: number) => (
              <div key={track.id} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {track.artists[0]?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Top Artists */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>TOP ARTIST</h2>
            {spotifyData.topArtists.items?.slice(0, 3).map((artist: any, index: number) => (
              <div key={artist.id} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {artist.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {artist.followers.total.toLocaleString()} followers
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Played */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>RECENTLY PLAYED</h2>
            {spotifyData.recent.items?.slice(0, 3).map((item: any, index: number) => (
              <div key={`${item.track.id}-${item.played_at}`} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.track.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#b3b3b3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.track.artists[0]?.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
import { useState, useEffect } from 'react'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [spotifyData, setSpotifyData] = useState<any>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'medium_term' | 'short_term'>('medium_term')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

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
    setUserProfile(null)
    setShowProfileDropdown(false)
    localStorage.removeItem('spotify_access_token')
    setError(null)
  }

  const loadData = async (selectedTimeRange?: 'medium_term' | 'short_term') => {
    if (!accessToken) return
    
    const currentTimeRange = selectedTimeRange || timeRange
    
    setDataLoading(true)
    setError(null)
    
    try {
      const headers = { 'Authorization': `Bearer ${accessToken}` }
      
      const [topTracksRes, topArtistsRes, recentRes, profileRes] = await Promise.all([
        fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=${currentTimeRange}&limit=10`, { headers }),
        fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${currentTimeRange}&limit=10`, { headers }),
        fetch('https://api.spotify.com/v1/me/player/recently-played?limit=10', { headers }),
        userProfile ? Promise.resolve({ json: () => userProfile }) : fetch('https://api.spotify.com/v1/me', { headers })
      ])

      const [topTracks, topArtists, recent, profile] = await Promise.all([
        topTracksRes.json(),
        topArtistsRes.json(),
        recentRes.json(),
        profileRes.json()
      ])

      setSpotifyData({ topTracks, topArtists, recent })
      if (!userProfile) {
        setUserProfile(profile)
      }
    } catch (err) {
      setError('Failed to load data')
    } finally {
      setDataLoading(false)
    }
  }

  const handleTimeRangeChange = (newTimeRange: 'medium_term' | 'short_term') => {
    setTimeRange(newTimeRange)
    if (spotifyData) {
      loadData(newTimeRange)
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
    padding: '0px',
    maxWidth: '1200px',
    margin: '0 auto'
  }

  const sectionStyle = {
    backgroundColor: '#3a3a3a',
    borderRadius: '12px',
    padding: '20px',
    minHeight: '600px'
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
    padding: '12px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
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
      {/* Header with profile dropdown */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px 16px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              borderRadius: '50%',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {userProfile?.images?.[0]?.url ? (
              <img 
                src={userProfile.images[0].url}
                alt={userProfile.display_name || 'Profile'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #1ed760'
                }}
              />
            ) : (
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1ed760',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px'
              }}>
                {userProfile?.display_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showProfileDropdown && (
            <div style={{
              position: 'absolute',
              top: '50px',
              right: '0',
              backgroundColor: '#3a3a3a',
              borderRadius: '8px',
              padding: '15px',
              minWidth: '200px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
              border: '1px solid #555'
            }}>
              {/* Profile Info */}
              <div style={{
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #555'
              }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: '16px',
                  marginBottom: '4px',
                  color: 'white'
                }}>
                  {userProfile?.display_name || 'Spotify User'}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#b3b3b3'
                }}>
                  {userProfile?.followers?.total?.toLocaleString() || 0} followers
                </div>
                {userProfile?.email && (
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    marginTop: '2px'
                  }}>
                    {userProfile.email}
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#ff2222'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4444'}
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
        <div>
          {/* Time Range Filter Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '15px', 
            marginBottom: '5px',
            paddingTop: '20px' 
          }}>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: timeRange === 'medium_term' ? '#1ed760' : '#3a3a3a',
                color: timeRange === 'medium_term' ? 'black' : '#b3b3b3',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '25px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleTimeRangeChange('medium_term')}
              disabled={dataLoading}
            >
              Last 6 Months
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: timeRange === 'short_term' ? '#1ed760' : '#3a3a3a',
                color: timeRange === 'short_term' ? 'black' : '#b3b3b3',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '25px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleTimeRangeChange('short_term')}
              disabled={dataLoading}
            >
              Last 4 Weeks
            </button>
          </div>

          {dataLoading && (
            <div style={centerStyle}>
              <div style={{ color: '#b3b3b3', fontSize: '16px' }}>
                Loading {timeRange === 'medium_term' ? '6 months' : '4 weeks'} data...
              </div>
            </div>
          )}

          <div style={dashboardStyle}>
            {/* Top Tracks */}
          <div style={sectionStyle}>
            <h2 style={titleStyle}>TOP TRACKS</h2>
            {spotifyData.topTracks.items?.slice(0, 10).map((track: any, index: number) => (
              <div key={track.id} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <img 
                  src={track.album.images[2]?.url || track.album.images[1]?.url || track.album.images[0]?.url} 
                  alt={track.album.name}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '4px',
                    objectFit: 'cover'
                  }}
                />
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
            {spotifyData.topArtists.items?.slice(0, 10).map((artist: any, index: number) => (
              <div key={artist.id} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <img 
                  src={artist.images[2]?.url || artist.images[1]?.url || artist.images[0]?.url} 
                  alt={artist.name}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
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
            {spotifyData.recent.items?.slice(0, 10).map((item: any, index: number) => (
              <div key={`${item.track.id}-${item.played_at}`} style={itemStyle}>
                <span style={{ color: '#b3b3b3', fontWeight: '600', minWidth: '20px' }}>
                  {index + 1}
                </span>
                <img 
                  src={item.track.album.images[2]?.url || item.track.album.images[1]?.url || item.track.album.images[0]?.url} 
                  alt={item.track.album.name}
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '4px',
                    objectFit: 'cover'
                  }}
                />
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
        </div>
      )}
    </div>
  )
}
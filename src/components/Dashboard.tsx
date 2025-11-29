import { useState, useEffect } from 'react';
import { SpotifyTopTracksResponse, SpotifyTopArtistsResponse, SpotifyRecentlyPlayedResponse } from '../types/spotify';
import { getTopTracks, getTopArtists, getRecentlyPlayed } from '../utils/spotify';
import TopTracks from './TopTracks';
import TopArtists from './TopArtists';
import RecentlyPlayed from './RecentlyPlayed';
import './Dashboard.css';

interface DashboardProps {
  accessToken: string;
}

export default function Dashboard({ accessToken }: DashboardProps) {
  const [topTracks, setTopTracks] = useState<SpotifyTopTracksResponse | null>(null);
  const [topArtists, setTopArtists] = useState<SpotifyTopArtistsResponse | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyRecentlyPlayedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tracks, artists, recent] = await Promise.all([
          getTopTracks(accessToken, 'medium_term', 3),
          getTopArtists(accessToken, 'medium_term', 3),
          getRecentlyPlayed(accessToken, 3)
        ]);

        setTopTracks(tracks);
        setTopArtists(artists);
        setRecentlyPlayed(recent);
      } catch (err) {
        setError('Failed to load Spotify data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="dashboard loading">
        <div className="loading-text">Loading your Spotify data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard error">
        <div className="error-text">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="status-indicator"></div>
      </div>
      <div className="dashboard-content">
        <TopTracks tracks={topTracks?.items || []} />
        <TopArtists artists={topArtists?.items || []} />
        <RecentlyPlayed tracks={recentlyPlayed?.items || []} />
      </div>
    </div>
  );
}
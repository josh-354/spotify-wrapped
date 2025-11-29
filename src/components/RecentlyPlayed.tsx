import { SpotifyRecentlyPlayed } from '../types/spotify';

interface RecentlyPlayedProps {
  tracks: SpotifyRecentlyPlayed[];
}

export default function RecentlyPlayed({ tracks }: RecentlyPlayedProps) {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">RECENTLY PLAYED</h2>
      <div className="section-content">
        {tracks.map((item, index) => (
          <div key={`${item.track.id}-${item.played_at}`} className="track-item">
            <span className="track-number">{index + 1}</span>
            <div className="track-info">
              <div className="track-name">{item.track.name}</div>
              <div className="track-artist">{item.track.artists[0]?.name}</div>
            </div>
          </div>
        ))}
        {tracks.length === 0 && (
          <div className="empty-state">No recently played tracks</div>
        )}
      </div>
    </div>
  );
}
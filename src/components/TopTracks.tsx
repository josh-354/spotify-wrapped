import { SpotifyTrack } from '../types/spotify';

interface TopTracksProps {
  tracks: SpotifyTrack[];
}

export default function TopTracks({ tracks }: TopTracksProps) {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">TOP TRACKS</h2>
      <div className="section-content">
        {tracks.map((track, index) => (
          <div key={track.id} className="track-item">
            <span className="track-number">{index + 1}</span>
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">{track.artists[0]?.name}</div>
            </div>
          </div>
        ))}
        {tracks.length === 0 && (
          <div className="empty-state">No top tracks available</div>
        )}
      </div>
    </div>
  );
}
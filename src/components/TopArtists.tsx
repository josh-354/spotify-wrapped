import { SpotifyArtist } from '../types/spotify';

interface TopArtistsProps {
  artists: SpotifyArtist[];
}

export default function TopArtists({ artists }: TopArtistsProps) {
  return (
    <div className="dashboard-section">
      <h2 className="section-title">TOP ARTIST</h2>
      <div className="section-content">
        {artists.map((artist, index) => (
          <div key={artist.id} className="track-item">
            <span className="track-number">{index + 1}</span>
            <div className="track-info">
              <div className="track-name">{artist.name}</div>
              <div className="track-artist">{artist.followers.total.toLocaleString()} followers</div>
            </div>
          </div>
        ))}
        {artists.length === 0 && (
          <div className="empty-state">No top artists available</div>
        )}
      </div>
    </div>
  );
}
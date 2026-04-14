import ThemePills from './ThemePills';
import './PlaceCard.css';

export default function PlaceCard({ place }) {
  const sources = place.sources || [];

  return (
    <div className="place-card">
      {place.photoUrl && (
        <div className="place-photo">
          <img src={place.photoUrl} alt={place.name} loading="lazy" />
        </div>
      )}

      <div className="place-info">
        <div className="place-title-row">
          <h2 className="place-name">{place.name}</h2>
          {place.rating_google && (
            <span className="rating-pill">
              <span className="rating-g">G</span> {place.rating_google}
            </span>
          )}
        </div>
        {place.address && (
          <p className="place-address">{place.address}</p>
        )}
      </div>

      {place.top_themes?.length > 0 && (
        <ThemePills themes={place.top_themes} />
      )}

      {sources.length > 0 && (
        <div className="source-tags">
          <span className="source-label">sourced from:</span>
          {sources.map((s) => (
            <span key={s} className={`source-tag source-${s.replace('/', '-')}`}>
              {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

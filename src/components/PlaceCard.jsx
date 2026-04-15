import ThemePills from './ThemePills';
import './PlaceCard.css';

export default function PlaceCard({ place, redditSources = [] }) {
  const sources = place.sources || [];
  const hasReddit = sources.includes('reddit');

  return (
    <div className="place-card">
      {/* Photo — clickable to Google Maps */}
      {place.photoUrl && (
        <a
          href={place.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="place-photo-link"
        >
          <div className="place-photo">
            <img src={place.photoUrl} alt={place.name} loading="lazy" />
            <div className="photo-maps-badge">↗ open in maps</div>
          </div>
        </a>
      )}

      <div className="place-info">
        <div className="place-title-row">
          <a
            href={place.googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="place-name-link"
          >
            <h2 className="place-name">{place.name}</h2>
          </a>
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

      {/* Sources — Google tag + Reddit thread links */}
      <div className="source-tags">
        <span className="source-label">sourced from:</span>
        <span className="source-tag source-google">google</span>
        {hasReddit && redditSources.length > 0
          ? redditSources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-tag source-reddit source-reddit-link"
                title={s.url}
              >
                {s.label} ↗
              </a>
            ))
          : hasReddit && (
              <span className="source-tag source-reddit">reddit</span>
            )}
      </div>
    </div>
  );
}

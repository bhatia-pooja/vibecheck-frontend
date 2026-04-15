import { useEffect, useState } from 'react';
import PlaceCard from '../components/PlaceCard';
import AudioPlayer from '../components/AudioPlayer';
import SearchBar from '../components/SearchBar';
import { getTTSAudio } from '../services/api';
import './ResultsScreen.css';

const BASE_LOADING_MESSAGES = [
  "Pepper's asking around...",
  "checking the vibes...",
  "almost got your answer...",
];

function getLoadingMessages(query) {
  const q = (query || '').toLowerCase();
  let subs;
  if (/\b(san francisco|sf|soma|mission|castro|hayes|marina|richmond|sunset|tenderloin|noe|pac heights|financial district)\b/.test(q)) {
    subs = ['r/AskSF', 'r/sanfrancisco'];
  } else if (/\b(oakland|east bay|berkeley|alameda|temescal|piedmont|emeryville)\b/.test(q)) {
    subs = ['r/eastbay', 'r/oakland'];
  } else if (/\b(palo alto|mountain view|sunnyvale|san jose|cupertino|santa clara|los altos|campbell|los gatos|saratoga)\b/.test(q)) {
    subs = ['r/SiliconValley', 'r/bayarea'];
  } else if (/\b(san mateo|burlingame|redwood city|menlo park|san carlos|foster city|peninsula)\b/.test(q)) {
    subs = ['r/bayarea'];
  } else {
    subs = ['r/bayarea', 'r/AskSF'];
  }
  return [
    "Pepper's asking around...",
    `reading ${subs[0]}...`,
    subs[1] ? `checking ${subs[1]}...` : "checking reddit threads...",
    "almost got your answer...",
  ];
}

const LOCATION_ZONES = [
  'San Francisco',
  'Palo Alto',
  'Sunnyvale',
  'San Jose',
  'San Mateo',
];

function getHeroGreeting(query) {
  const q = query.toLowerCase();
  if (q.includes('rainy') || q.includes('rain')) return "rainy day? Pepper's got you.";
  if (q.includes('date') || q.includes('romantic')) return "date night? let's make it special.";
  if (q.includes('hungover') || q.includes('hangover')) return "rough morning? Pepper knows the cure.";
  if (q.includes('wifi') || q.includes('work') || q.includes('study')) return 'work mode on. let\'s find your spot.';
  if (q.includes('celebrat')) return "let's celebrate!";
  if (q.includes('boba') || q.includes('tea')) return 'boba run incoming.';
  if (q.includes('coffee') || q.includes('cafe')) return 'coffee? always a good idea.';
  if (q.includes('ramen')) return 'ramen? say no more.';
  if (q.includes('brunch')) return "brunch o'clock. Pepper approves.";
  if (q.includes('late night') || q.includes('midnight')) return 'burning the midnight oil?';
  return 'Pepper found a spot for you.';
}

export default function ResultsScreen({ query, result, onSearch, loading, error, needsLocation }) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [cityInput, setCityInput] = useState('');

  const loadingMessages = getLoadingMessages(query);

  useEffect(() => {
    if (!loading) return;
    setLoadingMsgIdx(0);
    const interval = setInterval(() => {
      setLoadingMsgIdx((i) => (i + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [loading, query]);

  useEffect(() => {
    if (!result?.vibe_check_script) return;
    setAudioUrl(null);
    setAudioLoading(true);
    setTranscriptOpen(false);
    getTTSAudio(result.vibe_check_script)
      .then((url) => setAudioUrl(url))
      .catch((e) => console.error('TTS failed:', e))
      .finally(() => setAudioLoading(false));
  }, [result?.vibe_check_script]);

  // Strip "near me/us/here" before appending city so it doesn't re-trigger the city picker
  const baseQuery = query
    .replace(/\b(near|close to|around)\s+(me|us|here)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  const handleCitySubmit = (city) => {
    const trimmed = city.trim();
    if (!trimmed) return;
    onSearch(`${baseQuery} in ${trimmed}`);
  };

  const places = result?.places || [];
  const greeting = getHeroGreeting(query);

  return (
    <div className="results-screen">
      <div className="results-content">
        {/* Header */}
        <header className="results-header">
          <span className="brand">🌶️ vibe check</span>
        </header>

        {/* Hero greeting */}
        <div className="results-hero">
          <p className="results-greeting">{greeting}</p>
        </div>

        {/* Query bubble */}
        <div className="query-bubble">
          <p>"{query}"</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="loading-state">
            <div className="pepper-loading-halo">
              <span className="pepper-loading-emoji">🌶️</span>
            </div>
            <p className="loading-msg">{loadingMessages[loadingMsgIdx]}</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="error-card">
            <p>😬 {error}</p>
            {!error.includes('beta') && !error.includes('queries') && (
              <p className="error-sub">Try rephrasing your query or check your connection.</p>
            )}
          </div>
        )}

        {/* Missing location prompt */}
        {!loading && !error && needsLocation && (
          <div className="needs-location">
            <p className="needs-location-title">which city? 🌶️</p>
            <p className="needs-location-sub">Pepper knows Bay Area hangouts best — pick your city and she'll find your spot.</p>
            <div className="location-pills">
              {LOCATION_ZONES.map((zone) => (
                <button
                  key={zone}
                  className="location-pill"
                  onClick={() => onSearch(`${baseQuery} in ${zone}`)}
                >
                  {zone}
                </button>
              ))}
            </div>
            <div className="city-input-row">
              <input
                className="city-input"
                type="text"
                placeholder="or type your city..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCitySubmit(cityInput)}
              />
              <button
                className="city-input-go"
                onClick={() => handleCitySubmit(cityInput)}
                aria-label="Search"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && !needsLocation && places.length > 0 && (
          <>
            <p className="found-label">
              🌶️ pepper found {places.length === 1 ? 'a spot' : `${places.length} spots`}
            </p>

            {/* Audio player — lifted above cards */}
            <div className="player-section">
              <AudioPlayer audioUrl={audioUrl} loading={audioLoading} />
            </div>

            {/* Place cards — single or horizontal strip */}
            <div className={`place-cards-strip ${places.length === 1 ? 'single' : 'multi'}`}>
              {places.map((p, i) => (
                <PlaceCard key={p.name + i} place={p} redditSources={result?.redditSources || []} />
              ))}
            </div>

            {/* Transcript toggle */}
            {result?.vibe_check_script && (
              <div className="transcript-section">
                <button
                  className="transcript-toggle"
                  onClick={() => setTranscriptOpen((o) => !o)}
                >
                  <span>{transcriptOpen ? '▲' : '▼'} read what Pepper said</span>
                </button>
                {transcriptOpen && (
                  <p className="transcript-text">{result.vibe_check_script}</p>
                )}
              </div>
            )}

          </>
        )}

      </div>
    </div>
  );
}

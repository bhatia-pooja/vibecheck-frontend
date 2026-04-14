import { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import { getVibeCheck } from './services/api';

const BAY_AREA_KEYWORDS = [
  'sf', 'san francisco', 'oakland', 'berkeley', 'palo alto', 'mountain view',
  'san jose', 'sunnyvale', 'cupertino', 'santa clara', 'marin', 'east bay',
  'south bay', 'peninsula', 'north bay', 'bay area', 'silicon valley',
  'redwood city', 'menlo park', 'san mateo', 'burlingame', 'san carlos',
  'fremont', 'hayward', 'downtown', 'soma', 'mission', 'castro', 'hayes valley',
  'noe valley', 'marina', 'richmond', 'sunset', 'tenderloin', 'financial district',
];

// "near me/us/here" is NOT a location — needs city picker
const NEAR_ME = /\b(near|close to|around)\s+(me|us|here)\b/i;

function hasLocationContext(query) {
  const q = query.toLowerCase();
  if (NEAR_ME.test(q)) return false;
  if (/\b(near|in|at|by|around|close to)\s+\S/.test(q)) return true;
  return BAY_AREA_KEYWORDS.some((kw) => q.includes(kw));
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsLocation, setNeedsLocation] = useState(false);

  const handleSearch = async (q) => {
    setQuery(q);
    setScreen('results');
    setResult(null);
    setError(null);
    setNeedsLocation(false);

    // No location context → show city picker
    if (!hasLocationContext(q)) {
      setNeedsLocation(true);
      return;
    }

    setLoading(true);
    try {
      const data = await getVibeCheck(q);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (screen === 'home') {
    return <HomeScreen onSearch={handleSearch} />;
  }

  return (
    <ResultsScreen
      query={query}
      result={result}
      loading={loading}
      error={error}
      needsLocation={needsLocation}
      onSearch={handleSearch}
    />
  );
}

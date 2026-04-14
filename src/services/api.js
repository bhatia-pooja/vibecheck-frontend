const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export async function getVibeCheck(query) {
  const res = await fetch(`${BASE}/api/vibe-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Something went wrong');
  }
  return res.json();
}

export async function getTTSAudio(script) {
  const res = await fetch(`${BASE}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ script }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'TTS failed' }));
    throw new Error(err.error || 'TTS failed');
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

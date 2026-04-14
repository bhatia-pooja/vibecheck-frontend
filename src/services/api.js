const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

// Admin mode: visit the app with ?admin=YOUR_KEY once to unlock unlimited queries
// Key is stored in localStorage and sent as a header on every request
if (typeof window !== 'undefined') {
  const params = new URLSearchParams(window.location.search);
  const adminKey = params.get('admin');
  if (adminKey) {
    localStorage.setItem('admin_key', adminKey);
    // Clean the key out of the URL without reloading
    const url = new URL(window.location.href);
    url.searchParams.delete('admin');
    window.history.replaceState({}, '', url);
  }
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const adminKey = typeof localStorage !== 'undefined' && localStorage.getItem('admin_key');
  if (adminKey) headers['x-admin-key'] = adminKey;
  return headers;
}

export async function getVibeCheck(query) {
  const res = await fetch(`${BASE}/api/vibe-check`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ query }),
  });
  if (res.status === 429) {
    const data = await res.json();
    throw new Error(data.error);
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Something went wrong');
  }
  return res.json();
}

export async function getTTSAudio(script) {
  const res = await fetch(`${BASE}/api/tts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ script }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'TTS failed' }));
    throw new Error(err.error || 'TTS failed');
  }
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

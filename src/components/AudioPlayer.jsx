import { useState, useRef, useEffect } from 'react';
import './AudioPlayer.css';

// Bar heights + unique animation durations per bar for organic feel
const BARS = [
  {h:4},{h:7},{h:11},{h:14},{h:9},{h:15},{h:11},{h:8},{h:14},{h:12},
  {h:7},{h:10},{h:13},{h:9},{h:6},{h:11},{h:15},{h:10},{h:7},{h:12},
  {h:9},{h:14},{h:8},{h:11},{h:13},
];
const DURATIONS = [0.7,0.9,0.65,1.1,0.8,0.75,1.0,0.6,0.85,0.95,
                   0.7,0.8,0.65,1.0,0.9,0.75,0.6,0.85,1.1,0.7,
                   0.8,0.65,0.95,0.7,0.85];

export default function AudioPlayer({ audioUrl, loading }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
    setProgress(ratio * duration);
  };

  const formatTime = (s) => {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const progressPct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className={`audio-player ${playing ? 'is-playing' : ''}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={() => audioRef.current && setProgress(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={() => setPlaying(false)}
      />

      <div className="player-header">
        <span className="player-label">🌶️ pepper's take</span>
        {duration > 0 && <span className="player-duration">{formatTime(duration)}</span>}
      </div>

      <div className="player-body">
        <button
          className={`play-btn ${playing ? 'playing' : ''}`}
          onClick={togglePlay}
          disabled={loading || !audioUrl}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {loading ? (
            <div className="spinner" />
          ) : playing ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1.5"/>
              <rect x="14" y="4" width="4" height="16" rx="1.5"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6,3 20,12 6,21"/>
            </svg>
          )}
        </button>

        <div className="waveform-track" onClick={handleSeek}>
          <div className="waveform-bars">
            {BARS.map(({ h }, i) => {
              const barPct = (i / BARS.length) * 100;
              return (
                <div
                  key={i}
                  className={`waveform-bar ${barPct <= progressPct ? 'played' : ''}`}
                  style={{
                    height: `${h}px`,
                    '--dur': `${DURATIONS[i]}s`,
                    '--delay': `${((i * 0.06) % 0.5).toFixed(2)}s`,
                  }}
                />
              );
            })}
          </div>
        </div>

        <span className="player-time">{formatTime(progress)}</span>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import VoiceModal from './VoiceModal';
import './SearchBar.css';

const PLACEHOLDERS = [
  'best coffee with wifi near me...',
  'rainy day ramen in Palo Alto...',
  'chill date night downtown SF...',
  'best boba in Mountain View...',
  'hidden gem brunch spots...',
  'late night eats near university ave...',
];

const hasSpeechRecognition =
  typeof window !== 'undefined' &&
  ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

export default function SearchBar({ onSubmit, initialValue = '', compact = false }) {
  const [value, setValue] = useState(initialValue);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const inputRef = useRef(null);

  // Cycle placeholder every 3s
  useEffect(() => {
    if (compact) return;
    const interval = setInterval(() => {
      setPlaceholderVisible(false);
      setTimeout(() => {
        setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
        setPlaceholderVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [compact]);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  const handleMicClick = () => {
    if (!hasSpeechRecognition) return;
    setVoiceOpen(true);
  };

  const handleVoiceSubmit = (transcript) => {
    setVoiceOpen(false);
    setValue(transcript);
    onSubmit(transcript);
  };

  return (
    <>
      <form className={`search-bar ${compact ? 'compact' : ''}`} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={compact ? 'ask Pepper something else...' : PLACEHOLDERS[placeholderIdx]}
          className={`search-input ${!compact && !placeholderVisible ? 'placeholder-fade' : ''}`}
          autoComplete="off"
        />
        {!compact && hasSpeechRecognition && (
          <button
            type="button"
            className="mic-btn"
            onClick={handleMicClick}
            aria-label="Voice input"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="12" rx="3" />
              <path d="M5 10a7 7 0 0 0 14 0" />
              <line x1="12" y1="19" x2="12" y2="22" />
              <line x1="8" y1="22" x2="16" y2="22" />
            </svg>
          </button>
        )}
        <button type="submit" className="search-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </form>

      {voiceOpen && (
        <VoiceModal
          onSubmit={handleVoiceSubmit}
          onClose={() => setVoiceOpen(false)}
        />
      )}
    </>
  );
}

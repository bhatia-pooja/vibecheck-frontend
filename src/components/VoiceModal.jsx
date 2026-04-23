import { useEffect, useRef, useState } from 'react';
import './VoiceModal.css';

export default function VoiceModal({ onSubmit, onClose }) {
  const [phase, setPhase]           = useState('listening'); // listening | heard | error
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim]       = useState('');
  const recognitionRef              = useRef(null);
  const autoSubmitRef               = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setPhase('error');
      return;
    }

    const r = new SpeechRecognition();
    recognitionRef.current = r;
    r.continuous      = false;
    r.interimResults  = true;
    r.lang            = 'en-US';

    r.onresult = (e) => {
      let finalText   = '';
      let interimText = '';
      for (const result of e.results) {
        if (result.isFinal) finalText   += result[0].transcript;
        else                interimText += result[0].transcript;
      }
      if (finalText)   { setTranscript(finalText); setInterim(''); }
      else             { setInterim(interimText); }
    };

    r.onend = () => {
      setPhase((prev) => {
        // if we got something, move to "heard" and auto-submit after 1.2s
        if (transcript || interim) {
          const finalVal = transcript || interim;
          setTranscript(finalVal);
          setInterim('');
          autoSubmitRef.current = setTimeout(() => onSubmit(finalVal), 1200);
          return 'heard';
        }
        return prev === 'listening' ? 'error' : prev;
      });
    };

    r.onerror = () => setPhase('error');

    r.start();
    return () => {
      clearTimeout(autoSubmitRef.current);
      try { r.stop(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep transcript accessible inside onend closure
  const transcriptRef = useRef(transcript);
  const interimRef    = useRef(interim);
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);
  useEffect(() => { interimRef.current   = interim;     }, [interim]);

  const handleConfirm = () => {
    clearTimeout(autoSubmitRef.current);
    const val = transcript.trim();
    if (val) onSubmit(val);
  };

  const handleRetry = () => {
    clearTimeout(autoSubmitRef.current);
    setPhase('listening');
    setTranscript('');
    setInterim('');
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SpeechRecognition();
    recognitionRef.current = r;
    r.continuous     = false;
    r.interimResults = true;
    r.lang           = 'en-US';
    r.onresult = (e) => {
      let finalText = '', interimText = '';
      for (const result of e.results) {
        if (result.isFinal) finalText   += result[0].transcript;
        else                interimText += result[0].transcript;
      }
      if (finalText) { setTranscript(finalText); setInterim(''); }
      else           { setInterim(interimText); }
    };
    r.onend = () => {
      const val = transcriptRef.current || interimRef.current;
      if (val) {
        setTranscript(val); setInterim('');
        setPhase('heard');
        autoSubmitRef.current = setTimeout(() => onSubmit(val), 1200);
      } else {
        setPhase('error');
      }
    };
    r.onerror = () => setPhase('error');
    r.start();
  };

  const displayText = transcript || interim;

  return (
    <div className="voice-overlay" onClick={onClose}>
      <div className="voice-modal" onClick={(e) => e.stopPropagation()}>

        {/* Orb */}
        <div className={`voice-orb-wrap ${phase}`}>
          <div className="voice-orb-ring ring-3" />
          <div className="voice-orb-ring ring-2" />
          <div className="voice-orb-ring ring-1" />
          <div className="voice-orb">
            {phase === 'error' ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10a7 7 0 0 0 14 0" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
            )}
          </div>
        </div>

        {/* Status label */}
        <p className="voice-status">
          {phase === 'listening' && !interim && 'Listening…'}
          {phase === 'listening' && interim  && 'Got it, keep going…'}
          {phase === 'heard'                 && 'Sending to Pepper…'}
          {phase === 'error'                 && "Couldn't hear you"}
        </p>

        {/* Live transcript */}
        {displayText ? (
          <p className={`voice-transcript ${phase === 'heard' ? 'final' : 'interim'}`}>
            "{displayText}"
          </p>
        ) : phase === 'listening' ? (
          <p className="voice-hint">speak naturally — tell Pepper the vibe</p>
        ) : null}

        {/* Actions */}
        <div className="voice-actions">
          {phase === 'heard' && transcript && (
            <button className="voice-btn voice-btn-confirm" onClick={handleConfirm}>
              Ask Pepper →
            </button>
          )}
          {(phase === 'error' || phase === 'heard') && (
            <button className="voice-btn voice-btn-retry" onClick={handleRetry}>
              Try again
            </button>
          )}
          <button className="voice-btn voice-btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
}

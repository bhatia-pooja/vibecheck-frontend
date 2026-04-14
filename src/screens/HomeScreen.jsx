import SearchBar from '../components/SearchBar';
import './HomeScreen.css';

const PROMPTS = [
  { emoji: '☕', text: 'good study spots with wifi near me' },
  { emoji: '🍜', text: 'rainy day ramen near University Ave Palo Alto' },
  { emoji: '🍸', text: 'chill date night downtown SF' },
  { emoji: '🧋', text: 'best boba in Mountain View, go' },
];

const VIBES = [
  'late night eats', 'work from cafe', 'hidden gems',
  'first date spots', 'Sunday brunch', 'solo dining',
];

export default function HomeScreen({ onSearch }) {
  return (
    <div className="home-screen">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="home-content">
        <header className="home-header">
          <span className="brand">🌶️ vibe check</span>
        </header>

        <div className="hero">
          <div className="pepper-halo">
            <span className="pepper-emoji">🌶️</span>
          </div>
          <h1 className="hero-title">
            what's the <em>vibe?</em>
          </h1>
          <p className="hero-sub">
            tell Pepper what you're feeling.<br />
            she'll find the perfect spot.
          </p>
        </div>

        <div className="search-wrap">
          <SearchBar onSubmit={onSearch} />
        </div>

        <section className="try-section">
          <p className="section-intro">or try one of these</p>
          <div className="prompt-list">
            {PROMPTS.map((c) => (
              <button
                key={c.text}
                className="prompt-item"
                onClick={() => onSearch(c.text)}
              >
                <span className="prompt-emoji">{c.emoji}</span>
                <span className="prompt-text">{c.text}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="vibes-section">
          <div className="vibes-strip">
            {VIBES.map((tag) => (
              <button
                key={tag}
                className="vibe-tag"
                onClick={() => onSearch(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        <div className="pepper-tip">
          <span className="tip-icon">🌶️</span>
          <p>the more context you give me, the better I get.</p>
        </div>
      </div>
    </div>
  );
}

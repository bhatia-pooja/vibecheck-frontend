import './ThemePills.css';

const CONSENSUS_COLORS = {
  positive: 'green',
  mixed: 'yellow',
  negative: 'pink',
  vibe: 'purple',
  contextual: 'purple',
};

export default function ThemePills({ themes = [] }) {
  return (
    <div className="theme-pills">
      {themes.map((t, i) => {
        const color = CONSENSUS_COLORS[t.consensus] || 'purple';
        return (
          <span key={i} className={`pill pill-${color}`} title={t.detail}>
            {t.theme}
            {t.consensus === 'positive' && ' ✓'}
            {t.consensus === 'mixed' && ' ~'}
            {t.consensus === 'negative' && ' ✗'}
          </span>
        );
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import '../styles/theme-toggle.css';

function SunIcon() {
  return (
    <svg className="theme-switch-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="theme-switch-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg className="theme-switch-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

const options = [
  { value: 'light', label: 'Light', Icon: SunIcon },
  { value: 'dark', label: 'Dark', Icon: MoonIcon },
  { value: 'system', label: 'System', Icon: MonitorIcon },
];

function ThemeToggle() {
  const [preference, setPreference] = useState(() => {
    const saved = localStorage.getItem('aptiprep-theme');
    return saved === 'light' || saved === 'dark' || saved === 'system'
      ? saved
      : 'system';
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');

    const apply = () => {
      const resolved =
        preference === 'system' ? (mq.matches ? 'dark' : 'light') : preference;
      document.documentElement.setAttribute('data-theme', resolved);
    };

    apply();
    localStorage.setItem('aptiprep-theme', preference);

    /* In system mode, follow OS changes live */
    if (preference === 'system') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [preference]);

  return (
    <div className="theme-switch" role="group" aria-label="Theme">
      {options.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            className={`theme-switch-btn ${active ? 'theme-switch-btn-active' : ''}`}
            onClick={() => setPreference(value)}
            title={label}
            aria-label={`Switch to ${label} theme`}
            aria-pressed={active}
          >
            <Icon />
            <span className="theme-switch-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
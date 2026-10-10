import { useState, useContext, useEffect } from 'react';
import { NavigationContext } from '../App';
import { ThemeToggle } from '@/components/ui/be-ui-theme-toggle';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import '../styles/navbar.css';

function GithubIcon({ size = 17, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const navLinks = [
  { path: '/', label: 'Overview' },
  { path: '/topics', label: 'Topics' },
  { path: '/practice', label: 'Companies' },
  { path: '/about', label: 'About' },
  { path: '/contributors', label: 'Community' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { navigate, currentPath } = useContext(NavigationContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut ⌘K / Ctrl+K listener to jump to topics/search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        navigate('/topics');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  function handleNav(path) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container container">
        {/* Brand */}
        <div className="navbar-brand-section">
          <button
            className="navbar-brand-btn"
            onClick={() => handleNav('/')}
            type="button"
            aria-label="AptiPrep Home"
          >
            <div className="navbar-logo-glow">
              <img
                className="navbar-brand-icon"
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="AptiPrep logo"
              />
            </div>
            <span className="navbar-brand-text">AptiPrep</span>
          </button>
        </div>

        {/* Center Nav Links */}
        <nav className="navbar-center-nav" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path || (link.path === '/' && currentPath === '/home');
            return (
              <button
                key={link.path}
                className={`navbar-nav-item ${isActive ? 'navbar-nav-item-active' : ''}`}
                onClick={() => handleNav(link.path)}
                type="button"
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="navbar-right-actions">
          {/* 21st.dev style Quick Search Trigger */}
          <button
            className="navbar-search-trigger"
            onClick={() => handleNav('/topics')}
            type="button"
            title="Search topics (⌘K / Ctrl+K)"
          >
            <Search size={14} className="navbar-search-icon" />
            <span className="navbar-search-placeholder">Search topics...</span>
            <kbd className="navbar-search-kbd">⌘K</kbd>
          </button>

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/vighnesh1477/AptiPrep"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-icon-btn"
            aria-label="View on GitHub"
            title="GitHub Repository"
          >
            <GithubIcon size={17} />
          </a>

          {/* Theme Toggle Button */}
          <div className="navbar-toggle-wrapper">
            <ThemeToggle
              variant="circle-blur"
              start="top-right"
              className="navbar-theme-toggle-btn"
              iconClassName="navbar-theme-toggle-icon"
            />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="navbar-mobile-drawer">
          <div className="navbar-mobile-links">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path === '/' && currentPath === '/home');
              return (
                <button
                  key={link.path}
                  className={`navbar-mobile-link ${isActive ? 'navbar-mobile-link-active' : ''}`}
                  onClick={() => handleNav(link.path)}
                  type="button"
                >
                  {link.label}
                </button>
              );
            })}
            <div className="navbar-mobile-divider" />
            <button
              className="navbar-mobile-search-btn"
              onClick={() => handleNav('/topics')}
              type="button"
            >
              <Search size={16} />
              <span>Search topics...</span>
              <kbd className="navbar-search-kbd">⌘K</kbd>
            </button>
          </div>
        </div>
      )}

      {menuOpen && (
        <div
          className="navbar-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}

export default Navbar;
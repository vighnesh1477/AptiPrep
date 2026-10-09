import { useState, useContext } from 'react';
import { NavigationContext } from '../App';
import ThemeToggle from './ThemeToggle';
import '../styles/navbar.css';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/topics', label: 'Topics' },
  { path: '/practice', label: 'Practice' },
  { path: '/about', label: 'About' },
  { path: '/contributors', label: 'Contributors' },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { navigate, currentPath } = useContext(NavigationContext);

  function handleNav(path) {
    navigate(path);
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <button
          className="navbar-brand"
          onClick={() => handleNav('/')}
          type="button"
        >
          <img
            className="navbar-brand-icon"
            src="/logo.png"
            alt="AptiPrep logo"
          />
          <span className="navbar-brand-text">AptiPrep</span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              className={`navbar-link ${currentPath === link.path ? 'navbar-link-active' : ''}`}
              onClick={() => handleNav(link.path)}
              type="button"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="navbar-actions">
          <ThemeToggle />
          <button
            className={`navbar-hamburger ${menuOpen ? 'navbar-hamburger-open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="navbar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
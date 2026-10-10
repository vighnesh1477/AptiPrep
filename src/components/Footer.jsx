import { useContext } from 'react';
import { NavigationContext } from '../App';
import '../styles/footer.css';

function GithubIcon({ size = 15, className = '' }) {
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
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function Footer() {
  const { navigate } = useContext(NavigationContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer-inner">
          {/* Brand */}
          <div className="site-footer-brand">
            <img
              src={`${import.meta.env.BASE_URL}logo.png`}
              alt="AptiPrep"
              className="site-footer-logo"
            />
            <span className="site-footer-name">AptiPrep</span>
          </div>

          {/* Essential Links */}
          <nav className="site-footer-nav" aria-label="Footer navigation">
            <button
              className="site-footer-link"
              onClick={() => navigate('/topics')}
              type="button"
            >
              All Topics
            </button>
            <button
              className="site-footer-link"
              onClick={() => navigate('/practice')}
              type="button"
            >
              Companies
            </button>
            <button
              className="site-footer-link"
              onClick={() => navigate('/contributors')}
              type="button"
            >
              Contributors
            </button>
            <button
              className="site-footer-link"
              onClick={() => navigate('/about')}
              type="button"
            >
              About
            </button>
            <a
              href="https://github.com/vighnesh1477/AptiPrep"
              target="_blank"
              rel="noopener noreferrer"
              className="site-footer-link"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
          </nav>
        </div>

        {/* Copyright */}
        <div className="site-footer-bottom">
          <p>&copy; {currentYear} AptiPrep. Open-source under MIT License.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
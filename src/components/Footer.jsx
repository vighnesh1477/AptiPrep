import { useContext } from 'react';
import { NavigationContext } from '../App';

function ExternalIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function Footer() {
  const { navigate } = useContext(NavigationContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-brand-name">AptiPrep</span>
            <p className="footer-brand-tagline">
              Aptitude practice for placements &amp; competitive exams
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Platform</h4>
              <button className="footer-link" onClick={() => navigate('/topics')} type="button">Topics</button>
              <button className="footer-link" onClick={() => navigate('/practice')} type="button">Practice</button>
            </div>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Info</h4>
              <button className="footer-link" onClick={() => navigate('/about')} type="button">About</button>
              <button className="footer-link" onClick={() => navigate('/contributors')} type="button">Contributors</button>
            </div>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Projects</h4>
              <a
                className="footer-link footer-link-external"
                href="https://tech-prep-3h7b.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                TechPrep
                <ExternalIcon />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} AptiPrep. Built for placement preparation.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
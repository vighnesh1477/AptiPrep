import { useContext } from 'react';
import { NavigationContext } from '../App';

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
              <button className="footer-link" onClick={() => navigate('/results')} type="button">Results</button>
            </div>
            <div className="footer-link-group">
              <h4 className="footer-link-heading">Info</h4>
              <button className="footer-link" onClick={() => navigate('/about')} type="button">About</button>
              <button className="footer-link" onClick={() => navigate('/contributors')} type="button">Contributors</button>
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
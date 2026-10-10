import { useContext } from 'react';
import { NavigationContext } from '../App';
import { Sparkles, Heart } from 'lucide-react';

function GithubIcon({ size = 14, className = '' }) {
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
    <footer className="footer-21st border-t border-[var(--border-color)] bg-[var(--bg-secondary)] mt-auto py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="AptiPrep"
                className="w-6 h-6 rounded object-contain"
              />
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">
                AptiPrep
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-secondary)]">
                v2.0
              </span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Open-source aptitude practice registry designed with modern components, verified solutions,
              and company test patterns.
            </p>
            {/* Status indicator */}
            <div className="flex items-center gap-2 mt-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                All question sets operational
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
              Modules
            </h4>
            <button
              className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => navigate('/topics')}
              type="button"
            >
              All Topics
            </button>
            <button
              className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => navigate('/practice')}
              type="button"
            >
              Practice Modules
            </button>
          </div>

          {/* Community & Projects Links */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)] mb-1">
              Community & Projects
            </h4>
            <button
              className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => navigate('/contributors')}
              type="button"
            >
              Contributors
            </button>
            <button
              className="text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              onClick={() => navigate('/about')}
              type="button"
            >
              About AptiPrep
            </button>
            <a
              href="https://tech-prep-3h7b.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>TechPrep</span>
              <ExternalIcon />
            </a>
            <a
              href="https://github.com/vighnesh1477/AptiPrep"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <GithubIcon size={14} />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-tertiary)]">
          <p>&copy; {currentYear} AptiPrep. Open-source placement preparation for engineers.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
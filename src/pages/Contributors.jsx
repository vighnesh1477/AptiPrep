import { useState } from 'react';
import '../styles/contributors.css';

/* ─────────────────────────────────────────────
   Contributor data
   - `questions` = dataset questions verified
   - List is auto-sorted, highest questions first
   - Photos live in public/Contributers/<file>.jpg
     — missing photo falls back to the initial letter
   ───────────────────────────────────────────── */
const contributors = [
  // ── 1200 verified ──
  { name: 'Sowrav', questions: 1200, linkedin: 'https://linkedin.com/in/sourav-poojary-94666333b', photo: '/Contributers/sowrav.jpg' },

  // ── 900 verified ──
  { name: 'Sagar', questions: 900, linkedin: 'https://www.linkedin.com/in/srikar-manvi-4b06a9391', photo: '/Contributers/sagar-srikar.jpg' }, // ⚠️ URL slug says "srikar-manvi" — confirm name
  { name: 'Tharun.N', questions: 900, linkedin: 'https://www.linkedin.com/in/tharun-n-86b212330', photo: '/Contributers/tharun.jpg' },
  { name: 'Pramod', questions: 900, linkedin: 'https://www.linkedin.com/in/pramod-devadig-a09676392', photo: '/Contributers/pramod.jpg' },
  { name: 'Umar Sahad', questions: 900, linkedin: 'https://www.linkedin.com/in/umar-sahad-44775333b', photo: '/Contributers/umar.jpg' },
  { name: 'Adithya', questions: 900, linkedin: 'https://www.linkedin.com/in/adithya-poojary-b67a70333', photo: '/Contributers/adithya.jpg' },
  { name: 'Vijnan Hegde K', questions: 900, linkedin: 'https://www.linkedin.com/in/vijnan-hegde-k-810aab341/', photo: '/Contributers/vijnan.jpg' },
  { name: 'Samruddhi K S', questions: 900, linkedin: 'https://www.linkedin.com/in/samruddhi-gowda-754462393', photo: '/Contributers/samruddhi.jpg' },
  { name: 'Shamith B A', questions: 900, linkedin: 'https://www.linkedin.com/in/shamith-b-a-2a9699333', photo: '/Contributers/shamith.jpg' },
  { name: 'Vaishnavi H S', questions: 900, linkedin: 'https://www.linkedin.com/in/vaishnavi-hs-89341a393', photo: '/Contributers/vaishnavi.jpg' },
  { name: 'Vaibhavi S Savant', questions: 900, linkedin: 'https://www.linkedin.com/in/vaibhavi-s-savant-3a2516334', photo: '/Contributers/vaibhavi.jpg' },

  // ── 600 verified ──
  { name: 'Sagar', questions: 600, linkedin: 'https://www.linkedin.com/in/akashn049', photo: '/Contributers/sagar-akash.jpg' }, // ⚠️ URL slug says "akashn049" — confirm name
  { name: 'Sameeksha', questions: 600, linkedin: 'https://www.linkedin.com/in/sameeksha-shetty-909b86344', photo: '/Contributers/sameeksha.jpg' },
  { name: 'Ayush Prasanna Kanade', questions: 600, linkedin: 'https://www.linkedin.com/in/ayush-kanade-63a626385', photo: '/Contributers/ayush.jpg' },

  // ── 300 verified ──
  { name: 'Sagar', questions: 300, linkedin: null, photo: '/Contributers/sagar.jpg' },
  { name: 'Sravan A P', questions: 300, linkedin: 'https://www.linkedin.com/in/sravan-sujith-b5973929b', photo: '/Contributers/sravan.jpg' },
];

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.139 1.45-2.139 2.935v5.671H9.351V9h3.414v1.56h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.287zM5.332 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.544V9h3.575v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* Photo with graceful fallback to the initial letter */
function Avatar({ src, name }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return <div className="contributor-avatar">{name.charAt(0).toUpperCase()}</div>;
  }
  return (
    <img
      className="contributor-avatar contributor-avatar-photo"
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
}

function Contributors() {
  const sorted = [...contributors].sort((a, b) => b.questions - a.questions);
  const totalVerified = contributors.reduce((sum, c) => sum + c.questions, 0);

  return (
    <div className="contributors-page">
      <div className="contributors-container">

        <div className="contributors-header">
          <p className="contributors-eyebrow">Acknowledgements</p>
          <h1 className="contributors-title">Our Contributors</h1>
          <p className="contributors-subtitle">
            AptiPrep is shaped by students and volunteers who gave their time
            selflessly — patiently reviewing, correcting, and verifying
            thousands of questions so that every learner can practice with
            confidence. This page is our way of honouring that effort.
          </p>
        </div>

        <div className="contributors-stats">
          <div className="contributors-stat">
            <span className="contributors-stat-number">{contributors.length}</span>
            <span className="contributors-stat-label">Contributors</span>
          </div>
          <div className="contributors-stat">
            <span className="contributors-stat-number">{totalVerified.toLocaleString()}</span>
            <span className="contributors-stat-label">Questions Verified</span>
          </div>
        </div>

        <div className="contributors-grid">
          {sorted.map((contributor, index) => (
            <div
              key={`${contributor.name}-${index}`}
              className="contributor-card"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <Avatar src={contributor.photo} name={contributor.name} />

              <h2 className="contributor-name">{contributor.name}</h2>

              <div className="contributor-verified">
                <CheckIcon />
                <span>
                  Verified {contributor.questions.toLocaleString()} questions
                </span>
              </div>

              {contributor.linkedin ? (
                <a
                  className="contributor-linkedin"
                  href={contributor.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${contributor.name} on LinkedIn`}
                >
                  <LinkedInIcon />
                </a>
              ) : (
                <span className="contributor-linkedin contributor-linkedin-none">
                  <LinkedInIcon />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="contributors-cta">
          <p className="contributors-cta-text">Want to be part of this?</p>
          <p className="contributors-cta-hint">
            Help verify questions, suggest corrections, and get credited here.
          </p>
          <a
            className="contributors-cta-btn"
            href="https://github.com/vighnesh1477/TechPrep"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contribute on GitHub
          </a>
        </div>

      </div>
    </div>
  );
}

export default Contributors;
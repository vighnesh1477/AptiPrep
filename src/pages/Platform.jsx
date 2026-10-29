import { useState, useMemo, useContext } from 'react';
import { NavigationContext } from '../App';
import { Search, SearchX } from 'lucide-react';
import { savePlatformTestParams } from '../utils/storage';
import '../styles/Platform.css';

/* ── Assessment Platform Directory ── */
const platforms = [
  {
    id: 'mercer-mettl',
    name: 'Mercer | Mettl',
    monogram: 'MM',
    category: 'Assessment Suite',
    sections: 'Aptitude · Logical · Verbal',
    description:
      'Enterprise assessment suite with AI-powered proctoring. Covers aptitude, logical reasoning, and verbal tests.',
  },
  {
    id: 'hirepro',
    name: 'HirePro',
    monogram: 'HP',
    category: 'Assessment Suite',
    sections: 'Aptitude · Technical · Essay',
    description:
      'Widely used for campus drives with strict section-wise timers. Patterns usually include aptitude MCQs, technical questions, and written rounds.',
  },
  {
    id: 'cocubes',
    name: 'CoCubes (Aon)',
    monogram: 'CC',
    category: 'Employability Test',
    sections: 'Aptitude · Domain · Personality',
    description:
      "Aon's employability assessment that scores aptitude, domain knowledge, and behavioural traits, shared with a network of partner recruiters.",
  },
  {
    id: 'shl-amcat',
    name: 'SHL / AMCAT',
    monogram: 'SH',
    category: 'Aptitude + Psychometric',
    sections: 'Quant · Logical · Verbal',
    description:
      'Industry-standard aptitude and workplace-behaviour batteries; AMCAT adds module-based technical scoring that recruiters filter on directly.',
  },
  {
    id: 'wheebox',
    name: 'Wheebox',
    monogram: 'WB',
    category: 'Employability Test',
    sections: 'Aptitude · English · Domain',
    description:
      'Runs the Wheebox Employability Skill Test (WEST) measuring aptitude, English, and domain skills for large-scale hiring programs.',
  },
  {
    id: 'superset',
    name: 'Superset',
    monogram: 'SS',
    category: 'Placement Portal',
    sections: 'Profiles · Applications · Drives',
    description:
      'University placement automation portal where drives, shortlists, and interview slots are managed — the gateway to most on-campus offers.',
  },
  {
    id: 'merittrac',
    name: 'MeritTrac',
    monogram: 'MT',
    category: 'Assessment Suite',
    sections: 'Aptitude · Technical · Communication',
    description:
      "One of India's largest assessment services, blending aptitude MCQs with technical and communication modules for bulk hiring.",
  },
  {
    id: 'xobin',
    name: 'Xobin',
    monogram: 'XB',
    category: 'Skill Assessment',
    sections: 'Aptitude · Coding · Psychometric',
    description:
      'Skill assessment software combining psychometric, aptitude, and coding tests with live interview add-ons — common at startups.',
  },
  {
    id: 'imocha',
    name: 'iMocha',
    monogram: 'iM',
    category: 'Skill Assessment',
    sections: 'Aptitude · Coding · Domain',
    description:
      'AI-powered skills platform with a deep library of aptitude, coding, and role-specific assessments for hiring benchmarks.',
  },
  {
    id: 'talview',
    name: 'Talview',
    monogram: 'TV',
    category: 'AI Hiring Suite',
    sections: 'Assessments · Video · Proctoring',
    description:
      'AI hiring suite with remote proctoring, recorded video interviews, and behavioural insights layered over standard assessments.',
  },
  {
    id: 'doselect',
    name: 'DoSelect',
    monogram: 'DS',
    category: 'Coding Assessment',
    sections: 'Coding · SQL · Frameworks',
    description:
      'Project-style coding evaluations with real IDE environments, screening developers on working code instead of MCQ patterns.',
  },
  {
    id: 'glider-ai',
    name: 'Glider AI',
    monogram: 'GA',
    category: 'Skill Assessment',
    sections: 'Skill Tests · AI Proctoring',
    description:
      'Talent-quality platform with skill tests, AI proctoring, and fraud detection for high-volume technical hiring.',
  },
  {
    id: 'hackerearth',
    name: 'HackerEarth',
    monogram: 'HE',
    category: 'Coding Assessment',
    sections: 'Algorithms · SQL · Projects',
    description:
      'Coding assessments and hackathon hosting with a large problem library spanning algorithms, SQL, and framework challenges.',
  },
  {
    id: 'elitmus',
    name: 'eLitmus',
    monogram: 'eL',
    category: 'Employability Test',
    sections: 'Quant · Verbal · Problem Solving',
    description:
      'The pH Test evaluates quantitative, verbal, and analytical ability; scores are accepted by product and core companies for fresher hiring.',
  },
  {
    id: 'hiremee',
    name: 'HireMee',
    monogram: 'HM',
    category: 'Employability Test',
    sections: 'Aptitude · Verbal · Video Profile',
    description:
      'Mobile-first assessment platform offering free aptitude tests and video profiles that connect students directly with recruiters.',
  },
];

function Platform() {
  const { navigate } = useContext(NavigationContext);
  const [query, setQuery] = useState('');

  const filteredPlatforms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return platforms;
    return platforms.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sections.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query]);

  const hasQuery = query.trim().length > 0;

  /* ── Card click handler ── */
  function handlePlatformClick(platform) {
    savePlatformTestParams(platform);
    navigate('/platform-test');
  }

  return (
    <div className="platform-page">
      {/* ── Directory Grid + Search ── */}
      <section
        className="platform-directory-section"
        aria-labelledby="platform-directory-title"
      >
        <div className="platform-directory-container">
          <div className="platform-directory-header">
            <div>
              <h2 id="platform-directory-title" className="platform-directory-heading">
                All Platforms
              </h2>
              <p className="platform-directory-subheading">
                {hasQuery
                  ? `${filteredPlatforms.length} of ${platforms.length} platforms match your search.`
                  : 'Assessment tools powering campus drives, off-campus hiring, and lateral recruitment.'}
              </p>
            </div>

            <div className="platform-search-box">
              <Search size={14} aria-hidden="true" />
              <input
                type="text"
                className="platform-search-input"
                placeholder="Search platforms..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search platforms"
              />
            </div>
          </div>

          {filteredPlatforms.length > 0 ? (
            <div className="platform-grid">
              {filteredPlatforms.map((platform, index) => (
                <article
                  key={platform.id}
                  className="platform-card"
                  style={{ animationDelay: `${Math.min(index * 0.045, 0.4)}s` }}
                  onClick={() => handlePlatformClick(platform)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${platform.name} details`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePlatformClick(platform);
                    }
                  }}
                >
                  <div className="platform-card-top">
                    <div className="platform-card-icon" aria-hidden="true">
                      <span>{platform.monogram}</span>
                    </div>

                    <div className="platform-card-meta">
                      <h3 className="platform-card-name">{platform.name}</h3>
                      <span className="platform-card-tag">{platform.category}</span>
                    </div>
                  </div>

                  <p className="platform-card-desc">{platform.description}</p>

                  <div className="platform-card-footer">
                    <span className="platform-card-sections-label">Sections</span>
                    <span className="platform-card-sections">{platform.sections}</span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="platform-empty-state">
              <div className="platform-empty-state-icon" aria-hidden="true">
                <SearchX size={18} />
              </div>
              <h3 className="platform-empty-state-title">No platforms found</h3>
              <p className="platform-empty-state-desc">
                Nothing matches &quot;{query}&quot;. Try a platform name, category, or
                section.
              </p>
              <button
                className="platform-empty-state-btn"
                onClick={() => setQuery('')}
                type="button"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Platform;

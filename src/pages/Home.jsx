import { useState, useEffect, useContext } from 'react';
import { NavigationContext } from '../App';
import { getAllQuestions } from '../utils/questionUtils';
import topicsData from '../data/topics.json';
import {
  Sparkles,
  ArrowRight,
  Search,
  BookOpen,
  Layers,
  Terminal,
  CheckCircle2,
  TrendingUp,
  Cpu,
  BarChart3,
  Percent,
  Coins,
  Clock,
  Dices,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { RollingDigits } from '@/components/ui/rolling-digits';
import '../styles/home.css';

const featuredTopics = [
  {
    id: 'percentages',
    name: 'Percentages',
    category: 'Quantitative Aptitude',
    description: 'Percentage values, net change, successive discounts, and base conversions.',
    icon: Percent,
    color: '#6366f1',
    gradient: 'from-indigo-500/20 to-purple-500/10',
    tags: ['Foundational', 'High Frequency'],
    questionCount: '45+',
  },
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    category: 'Quantitative Aptitude',
    description: 'Cost price, markup percentage, marked price, and faulty weights.',
    icon: Coins,
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    tags: ['Formulas', 'Tricks'],
    questionCount: '40+',
  },
  {
    id: 'time-work',
    name: 'Time and Work',
    category: 'Quantitative Aptitude',
    description: 'Efficiency ratios, combined work, wages, and negative work (pipes & cisterns).',
    icon: Clock,
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    tags: ['LCM Method', 'Core'],
    questionCount: '50+',
  },
  {
    id: 'probability',
    name: 'Probability & P&C',
    category: 'Quantitative Aptitude',
    description: 'Independent events, conditional probability, dice, cards, and arrangements.',
    icon: Dices,
    color: '#a855f7',
    gradient: 'from-purple-500/20 to-pink-500/10',
    tags: ['Analytical', 'Advanced'],
    questionCount: '35+',
  },
];

const categoryPills = [
  { name: 'All Categories', path: '/topics' },
  { name: 'Quantitative Aptitude', path: '/topics' },
  { name: 'Data Interpretation', path: '/topics' },
  { name: 'Logical Reasoning', path: '/topics' },
  { name: 'Verbal Ability', path: '/topics' },
  { name: 'Company Tests', path: '/practice' },
];

function countAllSubtopics(data) {
  let count = 0;
  for (const category of data.categories) {
    for (const topic of category.topics) {
      count += topic.subtopics.length;
    }
  }
  return count;
}


function Home() {
  const { navigate } = useContext(NavigationContext);
  const questions = getAllQuestions();
  const topicCount = countAllSubtopics(topicsData);

  return (
    <div className="home-page dot-grid">
      {/* 21st.dev Ambient Radial Light */}
      <div className="ambient-glow" />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          {/* Shimmer Announcement Pill */}
          <div className="hero-badge-pill" onClick={() => navigate('/topics')} role="button" tabIndex={0}>
            <span className="hero-badge-dot" />
            <Sparkles size={13} className="text-indigo-400" />
            <span>The living library of aptitude questions</span>
            <ChevronRight size={13} className="hero-badge-chevron" />
          </div>

          <h1 className="hero-title">
            Master Aptitude for{' '}
            <span className="hero-title-gradient">Modern Tech Placements.</span>
          </h1>

          <p className="hero-subtitle">
            An open-source catalog of placement aptitude problems with verified step-by-step solutions,
            company patterns, and interactive test simulators.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button className="btn-primary-21st" onClick={() => navigate('/topics')} type="button">
              <span>Start Practicing</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn-secondary-21st" onClick={() => navigate('/practice')} type="button">
              <span>Company Profiles</span>
            </button>
          </div>

          {/* Category Chips River (21st.dev style filter bar) */}
          <div className="hero-category-river">
            {categoryPills.map((pill, idx) => (
              <button
                key={pill.name}
                className={`hero-category-chip ${idx === 0 ? 'hero-category-chip-active' : ''}`}
                onClick={() => navigate(pill.path)}
                type="button"
              >
                {pill.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Ribbon (21st.dev Glass Bar) */}
      <section className="home-stats-section">
        <div className="home-stats-container container">
          <div className="home-stats-card">
            <div className="home-stat-item">
              <div className="home-stat-icon-wrap">
                <Layers size={18} className="text-indigo-400" />
              </div>
              <div className="home-stat-details">
                <span className="home-stat-val inline-flex items-center">
                  <RollingDigits value={topicCount} duration={1800} delay={200} />
                  <span>+</span>
                </span>
                <span className="home-stat-lbl">Subtopics Catalogued</span>
              </div>
            </div>

            <div className="home-stat-sep" />

            <div className="home-stat-item">
              <div className="home-stat-icon-wrap">
                <BookOpen size={18} className="text-emerald-400" />
              </div>
              <div className="home-stat-details">
                <span className="home-stat-val inline-flex items-center">
                  <RollingDigits value={questions.length} duration={2200} delay={250} />
                  <span>+</span>
                </span>
                <span className="home-stat-lbl">Verified Problems</span>
              </div>
            </div>

            <div className="home-stat-sep" />

            <div className="home-stat-item">
              <div className="home-stat-icon-wrap">
                <Terminal size={18} className="text-cyan-400" />
              </div>
              <div className="home-stat-details">
                <span className="home-stat-val inline-flex items-center">
                  <RollingDigits value={100} duration={1900} delay={300} />
                  <span>%</span>
                </span>
                <span className="home-stat-lbl">Free & Open Source</span>
              </div>
            </div>

            <div className="home-stat-sep" />

            <div className="home-stat-item">
              <div className="home-stat-icon-wrap">
                <CheckCircle2 size={18} className="text-purple-400" />
              </div>
              <div className="home-stat-details">
                <span className="home-stat-val">Detailed</span>
                <span className="home-stat-lbl">Handwritten Solutions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Registry Components / Topics */}
      <section className="home-featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <div className="section-pill-tag">
                <Cpu size={12} />
                <span>Featured Modules</span>
              </div>
              <h2 className="section-title">Popular Topics Ready to Practice</h2>
              <p className="section-subtitle">
                Core quantitative modules frequently tested by recruitment assessments.
              </p>
            </div>
            <button className="view-all-link-btn" onClick={() => navigate('/topics')} type="button">
              <span>View all {topicCount} topics</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* 21st.dev Registry Component Cards */}
          <div className="registry-cards-grid">
            {featuredTopics.map((topic) => {
              const IconComp = topic.icon;
              return (
                <div
                  key={topic.id}
                  className="registry-topic-card"
                  onClick={() => navigate('/topics')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="registry-card-top">
                    <div className="registry-card-icon-box" style={{ color: topic.color }}>
                      <IconComp size={22} />
                    </div>
                    <div className="registry-card-meta">
                      <span className="registry-card-category">{topic.category}</span>
                      <h3 className="registry-card-title">{topic.name}</h3>
                    </div>
                  </div>

                  <p className="registry-card-desc">{topic.description}</p>

                  <div className="registry-card-tags">
                    {topic.tags.map((tag) => (
                      <span key={tag} className="registry-tag-chip">
                        {tag}
                      </span>
                    ))}
                    <span className="registry-count-chip">{topic.questionCount} Questions</span>
                  </div>

                  <div className="registry-card-footer">
                    <span className="registry-card-action">
                      <span>Practice Module</span>
                      <ArrowRight size={14} className="registry-card-arrow" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 21st.dev Style Architecture & Features */}
      <section className="home-features-section">
        <div className="container">
          <div className="features-header text-center">
            <div className="section-pill-tag mx-auto">
              <TrendingUp size={12} />
              <span>Placement Framework</span>
            </div>
            <h2 className="section-title">Designed for Fast Learning & High Retention</h2>
            <p className="section-subtitle mx-auto">
              Built specifically to eliminate confusion during on-campus and off-campus placement tests.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-box">
                <BarChart3 size={20} className="text-indigo-400" />
              </div>
              <h3 className="feature-title">Handwritten Visual Explanations</h3>
              <p className="feature-desc">
                Don't get stuck on abstract algebra. Every problem includes clean visual step-by-step
                solutions to master shortcut techniques.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <Terminal size={20} className="text-emerald-400" />
              </div>
              <h3 className="feature-title">Company Pattern Roadmaps</h3>
              <p className="feature-desc">
                Filtered groupings for IT Services, Analytics & Fintech, and Core Engineering firms,
                matching exact recruitment syllabi.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-box">
                <CheckCircle2 size={20} className="text-cyan-400" />
              </div>
              <h3 className="feature-title">Timed Exam Simulation</h3>
              <p className="feature-desc">
                Practice in realistic timed conditions. Review accurate score breakdowns and identify
                areas for immediate improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner (21st.dev Style Radiant Card) */}
      <section className="home-bottom-cta">
        <div className="container">
          <div className="bottom-cta-card">
            <div className="bottom-cta-content">
              <div className="bottom-cta-badge">
                <Sparkles size={12} />
                <span>Zero Subscription • 100% Free</span>
              </div>
              <h2 className="bottom-cta-heading">Ready to Start Preparing?</h2>
              <p className="bottom-cta-subtext">
                Browse through all categories, pick a topic, and strengthen your problem solving today.
              </p>
              <div className="bottom-cta-actions">
                <button className="btn-primary-21st" onClick={() => navigate('/topics')} type="button">
                  <span>Explore All Topics</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
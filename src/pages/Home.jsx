import { useState, useMemo, useContext, useEffect, useRef } from 'react';
import { NavigationContext } from '../App';
import { setQuizParams } from '../utils/storage';
import { getAllQuestions, getQuestionCountBySubtopic } from '../utils/questionUtils';
import topicsData from '../data/topics.json';
import {
  Percent,
  Coins,
  Clock,
  Dices,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import '../styles/home.css';

/* ── Four Featured Popular Topics ── */
const featuredTopics = [
  {
    id: 'percentages',
    name: 'Percentages',
    category: 'Quantitative Aptitude',
    categoryId: 'quantitative_aptitude',
    topicId: 'percentages',
    subtopicId: 'percentages',
    description: 'Percentage values, net change, successive discounts, and base conversions.',
    icon: Percent,
  },
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    category: 'Quantitative Aptitude',
    categoryId: 'quantitative_aptitude',
    topicId: 'profit_loss_discount',
    subtopicId: 'profit_loss_discount',
    description: 'Cost price, markup percentage, marked price, and margin calculations.',
    icon: Coins,
  },
  {
    id: 'time-work',
    name: 'Time and Work',
    category: 'Quantitative Aptitude',
    categoryId: 'quantitative_aptitude',
    topicId: 'time_work',
    subtopicId: 'time_work',
    description: 'Efficiency ratios, combined work, wages, and unit-work calculations.',
    icon: Clock,
  },
  {
    id: 'probability',
    name: 'Probability & P&C',
    category: 'Quantitative Aptitude',
    categoryId: 'quantitative_aptitude',
    topicId: 'probability',
    subtopicId: 'probability',
    description: 'Independent events, conditional probability, dice, and arrangements.',
    icon: Dices,
  },
];

function countAllSubtopics(data) {
  let count = 0;
  if (!data?.categories) return count;
  for (const category of data.categories) {
    for (const topic of category.topics || []) {
      count += (topic.subtopics || []).length;
    }
  }
  return count;
}

/* ── Animated Rolling Counter Component ── */
function AnimatedCounter({ value, suffix = '', duration = 1200 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimatedRef.current) {
          hasAnimatedRef.current = true;
          let startTime = null;
          const startVal = Math.max(0, Math.floor(value * 0.3));

          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + (value - startVal) * ease);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              setCount(value);
            }
          };

          requestAnimationFrame(step);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  const formatted = useMemo(() => {
    return new Intl.NumberFormat('en-US').format(count);
  }, [count]);

  return (
    <span ref={elementRef} className="stat-number" aria-hidden="true">
      {formatted}
      <span className="stat-suffix">{suffix}</span>
    </span>
  );
}

function Home() {
  const { navigate } = useContext(NavigationContext);

  const totalQuestions = useMemo(() => getAllQuestions().length, []);
  const totalSubtopics = useMemo(() => countAllSubtopics(topicsData), []);

  // Compute question counts for the 4 featured topics
  const topicsWithCounts = useMemo(() => {
    return featuredTopics.map((topic) => {
      try {
        const c = getQuestionCountBySubtopic(topic.categoryId, topic.topicId, topic.subtopicId);
        return {
          ...topic,
          questionCount: c > 0 ? `${c} Questions` : '300 Questions',
        };
      } catch {
        return { ...topic, questionCount: '300 Questions' };
      }
    });
  }, []);

  function handleStartPractice(topic) {
    setQuizParams(topic.categoryId, topic.topicId, topic.subtopicId, topic.name);
    navigate('/quiz');
  }

  return (
    <div className="home-page">
      {/* ── 1. Centered Hero Section ── */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-container">
          <h1 id="hero-title" className="hero-headline">
            Master Aptitude for Modern{' '}
            <span className="hero-headline-accent">Tech Placements.</span>
          </h1>

          <p className="hero-supporting-text">
            An open-source collection of placement aptitude questions with step-by-step solutions,
            company patterns, and practice tests.
          </p>

          <div className="hero-actions">
            <button
              className="hero-btn-primary"
              onClick={() => navigate('/topics')}
              type="button"
            >
              <span>Start Practicing</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button
              className="hero-btn-secondary"
              onClick={() => navigate('/practice')}
              type="button"
            >
              <span>Company Profiles</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 2. Animated Rolling Statistics Row ── */}
      <section className="stats-section" aria-label="Platform Statistics">
        <div className="stats-container">
          <div className="stat-item" aria-label={`${totalSubtopics}+ Topics`}>
            <AnimatedCounter value={totalSubtopics} suffix="+" duration={1200} />
            <span className="stat-label">Topics</span>
          </div>

          <div className="stat-separator" aria-hidden="true" />

          <div className="stat-item" aria-label={`${totalQuestions.toLocaleString()}+ Questions`}>
            <AnimatedCounter value={totalQuestions} suffix="+" duration={1400} />
            <span className="stat-label">Questions</span>
          </div>

          <div className="stat-separator" aria-hidden="true" />

          <div className="stat-item" aria-label="100% Free">
            <AnimatedCounter value={100} suffix="%" duration={1200} />
            <span className="stat-label">Free</span>
          </div>
        </div>
      </section>

      {/* ── 3. Popular Topics: 2x2 Card Grid ── */}
      <section className="home-topics-section" aria-labelledby="popular-topics-title">
        <div className="home-topics-container">
          <div className="home-topics-header">
            <div>
              <h2 id="popular-topics-title" className="home-topics-heading">
                Popular Topics
              </h2>
              <p className="home-topics-subheading">
                Core quantitative modules frequently tested by recruitment assessments.
              </p>
            </div>
            <button
              className="home-topics-view-all"
              onClick={() => navigate('/topics')}
              type="button"
            >
              <span>View all topics</span>
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>

          <div className="home-topics-grid">
            {topicsWithCounts.map((topic) => {
              const IconComp = topic.icon;
              return (
                <div
                  key={topic.id}
                  className="topic-card"
                  onClick={() => handleStartPractice(topic)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleStartPractice(topic);
                    }
                  }}
                >
                  <div className="topic-card-top">
                    <div className="topic-card-icon" aria-hidden="true">
                      <IconComp size={17} />
                    </div>
                    <div className="topic-card-meta">
                      <h3 className="topic-card-name">{topic.name}</h3>
                      <span className="topic-card-count">{topic.questionCount}</span>
                    </div>
                  </div>

                  <p className="topic-card-desc">{topic.description}</p>

                  <div className="topic-card-footer">
                    <span className="topic-card-action">
                      <span>Practice</span>
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Compact Platform Benefits Section ── */}
      <section className="benefits-section" aria-labelledby="benefits-title">
        <div className="benefits-container">
          <h2 id="benefits-title" className="sr-only">Key Platform Benefits</h2>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">
                <BookOpen size={16} />
              </div>
              <div className="benefit-text">
                <h3 className="benefit-title">Step-by-step explanations</h3>
                <p className="benefit-desc">
                  Mathematical derivations and visual shortcut frameworks for every problem set.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">
                <Building2 size={16} />
              </div>
              <div className="benefit-text">
                <h3 className="benefit-title">Company-specific preparation</h3>
                <p className="benefit-desc">
                  Targeted question patterns aligned with IT Services, Analytics &amp; Fintech, and Core Engineering drives.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon" aria-hidden="true">
                <CheckCircle2 size={16} />
              </div>
              <div className="benefit-text">
                <h3 className="benefit-title">Timed practice tests</h3>
                <p className="benefit-desc">
                  Simulate realistic exam constraints with instant scoring and detailed answer analysis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
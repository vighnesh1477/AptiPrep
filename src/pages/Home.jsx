import { useState, useEffect, useContext } from 'react';
import { NavigationContext } from '../App';
import { getAllQuestions } from '../utils/questionUtils';
import topicsData from '../data/topics.json';
import '../styles/home.css';

const featuredTopics = [
  {
    id: 'percentages',
    name: 'Percentages',
    description: 'Percentage values, increases, decreases, and comparisons.',
    icon: '%',
    color: '#2563EB',
  },
  {
    id: 'profit-loss',
    name: 'Profit and Loss',
    description: 'Cost price, selling price, profit percentage, and discounts.',
    icon: '₹',
    color: '#16A34A',
  },
  {
    id: 'time-work',
    name: 'Time and Work',
    description: 'Work efficiency, combined work, and pipe problems.',
    icon: '⏱',
    color: '#0891B2',
  },
  {
    id: 'probability',
    name: 'Probability',
    description: 'Basic probability, conditional probability, and Bayes theorem.',
    icon: '🎲',
    color: '#7C3AED',
  },
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

function CountUp({ checkpoints, suffix, delay }) {
  const suff = suffix || '';
    const del = delay || 0;
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), del);
    return () => clearTimeout(t);
  }, [del]);

  useEffect(() => {
    if (!started) return;
    let seg = 0;
    let start = null;
    let phase = 'animate';
    let pauseStart = null;
    let raf;
    const tick = (ts) => {
      if (!start) start = ts;
      if (phase === 'animate') {
        const from = checkpoints[seg];
        const to = checkpoints[seg + 1];
        const dur = 2000;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(from + (to - from) * eased));
        if (p >= 1) {
          if (seg + 2 < checkpoints.length) {
            phase = 'pause';
            pauseStart = ts;
          } else {
            setDisplay(to);
            return;
          }
        }
      } else {
        if (ts - pauseStart >= 200) {
          seg++;
          phase = 'animate';
          start = ts;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    setDisplay(checkpoints[0]);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, checkpoints]);

  return (
    <>
      {display}{suff}
    </>
  );
}

function Home() {
  const { navigate } = useContext(NavigationContext);
  const questions = getAllQuestions();
  const topicCount = countAllSubtopics(topicsData);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-container">
          <div className="hero-badge">Placement Ready</div>
          <h1 className="hero-title">
            Master Aptitude
            <br />
            for Placements
          </h1>
          <p className="hero-subtitle">
            Practice aptitude questions with step-by-step handwritten solutions.
            Track your accuracy, speed, and progress — all in one place.
          </p>
          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={() => navigate('/topics')} type="button">
              Start Practice
              <span className="hero-btn-arrow">→</span>
            </button>
            <button className="hero-btn hero-btn-outline" onClick={() => navigate('/practice')} type="button">
              Company List
            </button>
          </div>
        </div>
      </section>

      <section className="home-stats">
        <div className="home-stats-container">
          <div className="home-stat">
            <span className="home-stat-number">
              <CountUp checkpoints={[0, 5, 10, topicCount]} suffix="+" delay={0} />
            </span>
            <span className="home-stat-label">Topics</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-number">
              <CountUp
                checkpoints={[0, Math.floor(questions.length / 2), Math.floor(questions.length * 0.8), questions.length]}
                suffix="+"
                delay={100}
              />
            </span>
            <span className="home-stat-label">Questions</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat">
            <span className="home-stat-number">
              <CountUp checkpoints={[0, 40, 75, 100]} suffix="%" delay={200} />
            </span>
            <span className="home-stat-label">Free</span>
          </div>
        </div>
      </section>

      <section className="home-featured">
        <div className="home-featured-container">
          <h2 className="home-section-title">Popular Topics</h2>
          <p className="home-section-subtitle">
            Start with these essential topics for placement preparation.
          </p>
          <div className="home-featured-grid">
            {featuredTopics.map((topic) => (
              <button
                key={topic.id}
                className="featured-topic-card"
                style={{ '--card-color': topic.color }}
                onClick={() => navigate('/topics')}
                type="button"
              >
                <div className="featured-topic-icon" style={{ backgroundColor: topic.color }}>
                  {topic.icon}
                </div>
                <div className="featured-topic-content">
                  <h3 className="featured-topic-name">{topic.name}</h3>
                  <p className="featured-topic-desc">{topic.description}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="home-featured-cta">
            <button className="home-browse-btn" onClick={() => navigate('/topics')} type="button">
              Browse All {topicCount} Topics
              <span className="hero-btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta-container">
          <h2 className="home-cta-title">Ready to Ace Your Aptitude?</h2>
          <p className="home-cta-desc">
            Start practicing now and track your progress across all topics.
          </p>
          <button className="hero-btn hero-btn-white" onClick={() => navigate('/topics')} type="button">
            Get Started
            <span className="hero-btn-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
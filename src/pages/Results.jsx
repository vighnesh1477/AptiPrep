// D:\AptiPrep\src\pages\Results.jsx
import { useContext, useState, useEffect, useMemo } from 'react';
import { NavigationContext } from '../App';
import { getPracticeResult, clearPracticeResult } from '../utils/storage';
import quotesData from '../data/quotes.json';
import '../styles/results.css';

function formatTime(seconds) {
  if (!seconds || seconds < 0) return '0s';
  if (seconds < 60) return seconds + 's';
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  return secs > 0 ? mins + 'm ' + secs + 's' : mins + 'm';
}

function getOptionLabel(index) {
  return String.fromCharCode(65 + index);
}

function getRandomQuote() {
  var quotes = quotesData.quotes || [];
  if (quotes.length === 0) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function getPerformanceBadge(accuracy) {
  if (accuracy >= 90) return { label: 'Outstanding', icon: '🏆', tier: 'legendary' };
  if (accuracy >= 75) return { label: 'Excellent', icon: '🌟', tier: 'epic' };
  if (accuracy >= 60) return { label: 'Good Job', icon: '⭐', tier: 'rare' };
  if (accuracy >= 40) return { label: 'Keep Going', icon: '💪', tier: 'uncommon' };
  return { label: 'Practice More', icon: '📚', tier: 'common' };
}

function getScoreColor(accuracy) {
  if (accuracy >= 75) return 'var(--success)';
  if (accuracy >= 50) return 'var(--warning)';
  return 'var(--error)';
}

/* ── Animated counter hook ── */
function useAnimatedValue(target, duration) {
  if (duration === undefined) duration = 1200;
  var ref = useState(0);
  var value = ref[0];
  var setValue = ref[1];
  useEffect(function () {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ── Score Ring Component ── */
function ScoreRing(_ref) {
  var accuracy = _ref.accuracy;
  var animatedAccuracy = useAnimatedValue(accuracy, 1400);
  var circumference = 2 * Math.PI * 54;
  var offset = circumference - (animatedAccuracy / 100) * circumference;
  var color = getScoreColor(accuracy);
  var badge = getPerformanceBadge(accuracy);

  return (
    <div className="score-ring-wrapper">
      <div className="score-ring-glow" style={{ background: color }} />
      <svg className="score-ring" viewBox="0 0 120 120">
        <circle
          className="score-ring-bg"
          cx="60" cy="60" r="54"
          fill="none"
          strokeWidth="8"
        />
        <circle
          className="score-ring-progress"
          cx="60" cy="60" r="54"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-ring-value" style={{ color: color }}>
          {animatedAccuracy}
        </span>
        <span className="score-ring-unit">%</span>
        <span className="score-ring-label">Accuracy</span>
      </div>
      <div className={'performance-badge performance-badge--' + badge.tier}>
        <span className="performance-badge-icon">{badge.icon}</span>
        <span className="performance-badge-label">{badge.label}</span>
      </div>
    </div>
  );
}

/* ── Stat Card Component ── */
function StatCard(_ref) {
  var icon = _ref.icon, value = _ref.value, label = _ref.label, variant = _ref.variant, unit = _ref.unit, delay = _ref.delay;
  return (
    <div
      className={'stat-card stat-card--' + (variant || 'default')}
      style={{ animationDelay: delay + 'ms' }}
    >
      <div className="stat-card-shimmer" />
      <div className="stat-card-icon-wrap">
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value-row">
          <span className="stat-card-value">{value}</span>
          {unit && <span className="stat-card-unit">{unit}</span>}
        </div>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

/* ── Question Row Component ── */
function QuestionRow(_ref) {
  var answer = _ref.answer, index = _ref.index, total = _ref.total;
  var q = answer.question;
  if (!q) return null;

  var isCorrect = answer.isCorrect;
  var isSkipped = answer.timedOut;
  var maxTime = 30;
  var timePercent = Math.min((answer.timeSpent / maxTime) * 100, 100);

  return (
    <div
      className={
        'q-row ' +
        (isCorrect ? 'q-row--correct' : isSkipped ? 'q-row--skipped' : 'q-row--wrong')
      }
      style={{ animationDelay: (index * 60) + 'ms' }}
    >
      {/* Left indicator strip */}
      <div className="q-row-strip" />

      {/* Number badge */}
      <div className="q-row-num">
        <span>{index + 1}</span>
      </div>

      {/* Content */}
      <div className="q-row-content">
        <div className="q-row-top">
          <span className={'q-row-status ' + (isCorrect ? 'q-row-status--correct' : isSkipped ? 'q-row-status--skipped' : 'q-row-status--wrong')}>
            {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Wrong'}
          </span>
          <span className="q-row-time">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {formatTime(answer.timeSpent)}
          </span>
        </div>

        {/* Time bar */}
        <div className="q-row-timebar-track">
          <div
            className="q-row-timebar-fill"
            style={{
              width: timePercent + '%',
              backgroundColor: isCorrect ? 'var(--success)' : isSkipped ? 'var(--warning)' : 'var(--error)',
            }}
          />
        </div>

        {/* Answer details */}
        <div className="q-row-answers">
          {answer.selected !== null && answer.selected !== undefined && q.options && (
            <div className="q-row-selected">
              <span className="q-row-answer-badge q-row-answer-badge--selected">
                {getOptionLabel(answer.selected)}
              </span>
              <span>{q.options[answer.selected]}</span>
            </div>
          )}
          {!isCorrect && q.options && (
            <div className="q-row-correct">
              <span className="q-row-answer-badge q-row-answer-badge--correct">
                {getOptionLabel(answer.correct)}
              </span>
              <span>{q.options[answer.correct]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main Results Component ── */
function Results() {
  var nav = useContext(NavigationContext);
  var navigate = nav.navigate;
  var result = getPracticeResult();

  if (!result) {
    return (
      <div className="results-page">
        <div className="container">
          <div className="results-empty">
            <div className="results-empty-icon-wrap">
              <svg className="results-empty-icon" width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="8" y="16" width="64" height="48" rx="6" stroke="currentColor" strokeWidth="3"/>
                <path d="M8 28H72" stroke="currentColor" strokeWidth="3"/>
                <circle cx="20" cy="22" r="3" fill="currentColor"/>
                <circle cx="28" cy="22" r="3" fill="currentColor"/>
                <circle cx="36" cy="22" r="3" fill="currentColor"/>
                <path d="M28 44L36 52L52 36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="results-empty-title">No Results Yet</h1>
            <p className="results-empty-text">Complete a quiz to see your detailed performance report.</p>
            <button className="btn btn-primary" onClick={function () { navigate('/topics'); }} type="button">
              Browse Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  var answers = result.answers || [];
  var correct = result.correct || 0;
  var wrong = result.wrong || 0;
  var skipped = result.skipped || 0;
  var accuracy = result.accuracy || 0;
  var totalTime = result.totalTime || 0;
  var avgTime = result.avgTime || 0;
  var totalQuestions = correct + wrong + skipped;
  var quote = result.quote || getRandomQuote();

  /* Score distribution for mini bar */
  var correctPct = totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;
  var wrongPct = totalQuestions > 0 ? (wrong / totalQuestions) * 100 : 0;
  var skippedPct = totalQuestions > 0 ? (skipped / totalQuestions) * 100 : 0;

  return (
    <div className="results-page">
      <div className="container">

        {/* ── Hero Section ── */}
        <div className="results-hero">
          <div className="results-hero-bg" />
          <div className="results-hero-content">
            <ScoreRing accuracy={accuracy} />

            <div className="results-hero-text">
              <h1 className="results-title">Quiz Results</h1>
              {result.topicName && (
                <span className="results-topic-badge">{result.topicName}</span>
              )}
              {result.completedAt && (
                <p className="results-date">
                  {new Date(result.completedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              )}
              {/* Distribution bar */}
              <div className="results-dist-bar">
                <div className="results-dist-fill results-dist-fill--correct" style={{ width: correctPct + '%' }} />
                <div className="results-dist-fill results-dist-fill--wrong" style={{ width: wrongPct + '%' }} />
                <div className="results-dist-fill results-dist-fill--skipped" style={{ width: skippedPct + '%' }} />
              </div>
              <div className="results-dist-legend">
                <span className="results-dist-item"><span className="results-dist-dot results-dist-dot--correct" />Correct {correct}</span>
                <span className="results-dist-item"><span className="results-dist-dot results-dist-dot--wrong" />Wrong {wrong}</span>
                <span className="results-dist-item"><span className="results-dist-dot results-dist-dot--skipped" />Skipped {skipped}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="stat-grid">
          <StatCard icon="✓" value={correct} label="Correct" variant="success" delay={0} />
          <StatCard icon="✗" value={wrong} label="Wrong" variant="error" delay={80} />
          <StatCard icon="⊘" value={skipped} label="Skipped" variant="warning" delay={160} />
          <StatCard
            icon="⚡"
            value={formatTime(avgTime)}
            label="Avg. Time / Q"
            variant="accent"
            delay={240}
          />
          <StatCard
            icon="🕐"
            value={formatTime(totalTime)}
            label="Total Time"
            variant="default"
            delay={320}
          />
          <StatCard
            icon="📊"
            value={totalQuestions}
            label="Questions"
            variant="default"
            delay={400}
          />
        </div>

        {/* ── Quote ── */}
        {quote && (
          <div className="results-quote">
            <div className="results-quote-deco">
              <svg width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
                <path d="M0 32V18.4C0 12.3 1.4 7.6 4.2 4.2 7 .8 11.2-.8 16.8.4L16 6.4C13.6 5.6 11.6 5.8 10 7.2 8.4 8.6 7.6 10.8 7.6 14V18.4H16V32H0ZM24 32V18.4C24 12.3 25.4 7.6 28.2 4.2 31 .8 35.2-.8 40.8.4L40 6.4C37.6 5.6 35.6 5.8 34 7.2 32.4 8.6 31.6 10.8 31.6 14V18.4H40V32H24Z"/>
              </svg>
            </div>
            <p className="results-quote-text">{quote.quote}</p>
            <div className="results-quote-author-row">
              <div className="results-quote-line" />
              <span className="results-quote-author">{quote.author}</span>
            </div>
          </div>
        )}

        {/* ── Question Breakdown ── */}
        {answers.length > 0 && (
          <div className="results-breakdown">
            <div className="results-breakdown-header">
              <h2 className="results-breakdown-title">Question Breakdown</h2>
              <span className="results-breakdown-count">{answers.length} questions</span>
            </div>
            <div className="results-questions-list">
              {answers.map(function (answer, index) {
                return (
                  <QuestionRow
                    key={index}
                    answer={answer}
                    index={index}
                    total={answers.length}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="results-actions">
          <button
            className="btn btn-primary results-action-btn"
            onClick={function () { clearPracticeResult(); navigate('/topics'); }}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 9A7 7 0 1 1 4.05 14.05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M2 5V9H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Practice Again
          </button>
          <button
            className="btn btn-secondary results-action-btn"
            onClick={function () { navigate('/'); }}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L9 3L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 8V15H13V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default Results;
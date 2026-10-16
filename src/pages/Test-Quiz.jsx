import { useState, useEffect, useRef, useContext } from 'react';
import { NavigationContext } from '../App';
import { getQuizParams, clearQuizParams, savePracticeResult } from '../utils/storage';
import { getQuestionsByExactSubtopic, getRandomQuestions } from '../utils/questionUtils';
import quotesData from '../data/quotes.json';
import '../styles/Test-Quiz.css';

function normalizeQuestion(q, index) {
  var options = q.options || [];
  if (options.length > 0 && typeof options[0] === 'object') {
    options = options.map(function (o) { return o.text || o; });
  }

  var correctIndex = 0;
  if (q.correctOption !== undefined) {
    var originalOptions = q.options || [];
    var idx = originalOptions.findIndex(function (o) { return (o.id || '') === q.correctOption; });
    if (idx !== -1) correctIndex = idx;
  } else if (typeof q.answer === 'number') {
    correctIndex = q.answer;
  }

  return {
    id: q.questionId || q.id || ('q-' + index),
    question: q.questionText || q.question || '',
    questionImage: q.questionImage || null,
    options: options,
    correctIndex: correctIndex,
    explanation: q.explanationText || q.explanation || '',
    explanationImage: q.explanationImage || null,
    difficulty: q.difficulty || 'Medium',
  };
}

function shuffleOptions(question) {
  var options = question.options;
  var correctIndex = question.correctIndex;
  if (!options || options.length <= 1) return question;

  var correctText = options[correctIndex];
  var shuffled = options.slice();
  for (var i = shuffled.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }
  var newCorrectIndex = shuffled.indexOf(correctText);

  return {
    id: question.id,
    question: question.question,
    questionImage: question.questionImage,
    options: shuffled,
    correctIndex: newCorrectIndex,
    explanation: question.explanation,
    explanationImage: question.explanationImage,
    difficulty: question.difficulty,
  };
}

function formatDuration(secs) {
  if (secs < 60) return secs + 's';
  var m = Math.floor(secs / 60);
  var s = secs % 60;
  return s > 0 ? m + 'm ' + s + 's' : m + 'm';
}

function getRandomQuote() {
  var quotes = quotesData.quotes || [];
  if (quotes.length === 0) return null;
  var idx = Math.floor(Math.random() * quotes.length);
  return quotes[idx];
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

/* ── Compute final stats from the answers record ──
   status: 'answered' | 'timeout' | 'read'  (missing = never visited = skipped) */
function computeStats(answerList, totalQuestions) {
  var correct = 0;
  var wrong = 0;
  var skipped = 0;
  var attempted = 0;
  var totalTime = 0;

  for (var i = 0; i < totalQuestions; i++) {
    var a = answerList[i];
    if (a && a.status === 'answered') {
      attempted++;
      totalTime += a.timeSpent || 0;
      if (a.isCorrect) correct++;
      else wrong++;
    } else {
      skipped++;
      if (a && a.timeSpent) totalTime += a.timeSpent;
    }
  }

  return {
    total: totalQuestions,
    attempted: attempted,
    correct: correct,
    wrong: wrong,
    skipped: skipped,
    totalTime: totalTime,
    accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : 0,
    avgTime: totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0,
  };
}

/* ── Animated counter hook ── */
function useAnimatedValue(target, duration) {
  if (duration === undefined) duration = 1200;
  var ref = useState(0);
  var value = ref[0];
  var setValue = ref[1];
  useEffect(function () {
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

/* ── Score Ring ── */
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
        <circle className="score-ring-bg" cx="60" cy="60" r="54" fill="none" strokeWidth="8" />
        <circle
          className="score-ring-progress"
          cx="60" cy="60" r="54"
          fill="none" strokeWidth="8" strokeLinecap="round"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-ring-value" style={{ color: color }}>{animatedAccuracy}</span>
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

/* ── Stat Card ── */
function StatCard(_ref) {
  var icon = _ref.icon, value = _ref.value, label = _ref.label, variant = _ref.variant, delay = _ref.delay;
  return (
    <div className={'stat-card stat-card--' + (variant || 'default')} style={{ animationDelay: delay + 'ms' }}>
      <div className="stat-card-shimmer" />
      <div className="stat-card-icon-wrap">
        <span className="stat-card-icon">{icon}</span>
      </div>
      <div className="stat-card-body">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

function TestQuiz() {
  var navContext = useContext(NavigationContext);
  var navigate = navContext.navigate;

  /* Timestamp of when the user arrived at the current question (this visit) */
  var questionStartRef = useRef(Date.now());
  /* Seconds already accumulated per question from PREVIOUS visits */
  var timeSpentRef = useRef([]);

  var phaseState = useState('loading');
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var topicNameState = useState('');
  var topicName = topicNameState[0];
  var setTopicName = topicNameState[1];

  var allQuestionsState = useState([]);
  var allQuestions = allQuestionsState[0];
  var setAllQuestions = allQuestionsState[1];

  var selectedCountState = useState(10);
  var selectedCount = selectedCountState[0];
  var setSelectedCount = selectedCountState[1];

  var timerDurationState = useState(30);
  var timerDuration = timerDurationState[0];
  var setTimerDuration = timerDurationState[1];

  var questionsState = useState([]);
  var questions = questionsState[0];
  var setQuestions = questionsState[1];

  var currentIndexState = useState(0);
  var currentIndex = currentIndexState[0];
  var setCurrentIndex = currentIndexState[1];

  /* ── PER-QUESTION TIMERS: timers[i] = seconds remaining for question i ── */
  var timersState = useState([]);
  var timers = timersState[0];
  var setTimers = timersState[1];

  var answersState = useState([]);
  var answers = answersState[0];
  var setAnswers = answersState[1];

  var showEndConfirmState = useState(false);
  var showEndConfirm = showEndConfirmState[0];
  var setShowEndConfirm = showEndConfirmState[1];

  var showSolutionState = useState(false);
  var showSolution = showSolutionState[0];
  var setShowSolution = showSolutionState[1];

  var imageErrorsState = useState({});
  var imageErrors = imageErrorsState[0];
  var setImageErrors = imageErrorsState[1];

  var savedQuoteState = useState(null);
  var savedQuote = savedQuoteState[0];
  var setSavedQuote = savedQuoteState[1];

  /* ── Derived state for the current question ── */
  var currentAnswer = answers[currentIndex] || null;
  var isLocked = !!(currentAnswer && currentAnswer.status !== 'read');
  var selectedOption = currentAnswer ? currentAnswer.selected : null;
  var isLastQuestion = currentIndex === questions.length - 1;
  var timer = timers[currentIndex] !== undefined ? timers[currentIndex] : timerDuration;

  useEffect(function () {
    var params = getQuizParams();
    if (!params) {
      setPhase('error');
      return;
    }
    try {
      var raw = getQuestionsByExactSubtopic(params.categoryId, params.topicId, params.subtopicId);
      if (raw.length === 0) {
        setTopicName(params.subtopicName || params.subtopicId);
        setPhase('empty');
        return;
      }
      var normalized = raw.map(normalizeQuestion);
      setAllQuestions(normalized);
      setTopicName(params.subtopicName || params.subtopicId);
      setPhase('setup');
    } catch (err) {
      console.error('Quiz load error:', err);
      setPhase('error');
    }
  }, []);

  /* ── Tick ONLY the current question's timer. Stops when locked (answered/timeout). ── */
  useEffect(function () {
    if (phase !== 'quiz' || isLocked) return;
    var remaining = timers[currentIndex];
    if (remaining === undefined) return;

    if (remaining <= 0) {
      handleTimeout();
      return;
    }

    var interval = setInterval(function () {
      setTimers(function (prev) {
        var next = prev.slice();
        next[currentIndex] = Math.max(0, (next[currentIndex] || 0) - 1);
        return next;
      });
    }, 1000);

    return function () { clearInterval(interval); };
  }, [phase, isLocked, currentIndex, timers]);

  /* ── Helpers ── */
  function getVisitSeconds() {
    return Math.max(0, Math.round((Date.now() - questionStartRef.current) / 1000));
  }

  /* ── Answer recording (time accumulates across visits) ── */
  function recordAnswer(index, status, selected) {
    var q = questions[index];
    var timeSpent = (timeSpentRef.current[index] || 0) + getVisitSeconds();
    setAnswers(function (prev) {
      var next = prev.slice();
      next[index] = {
        question: q,
        selected: selected,
        correct: q.correctIndex,
        isCorrect: status === 'answered' && selected === q.correctIndex,
        status: status,
        timeSpent: timeSpent,
      };
      return next;
    });
  }

  function handleTimeout() {
    /* Guard: don't double-record (e.g. if already answered, or effect re-fires) */
    if (currentAnswer && currentAnswer.status !== 'read') return;
    recordAnswer(currentIndex, 'timeout', null);
  }

  function handleSelect(optionIndex) {
    if (isLocked) return;
    recordAnswer(currentIndex, 'answered', optionIndex);
  }

  /* ── Navigation (bank the time spent on the question we're leaving) ── */
  function navigateTo(index) {
    if (index < 0 || index >= questions.length || index === currentIndex) return;

    /* Accumulate time spent on the current question during this visit */
    timeSpentRef.current[currentIndex] = (timeSpentRef.current[currentIndex] || 0) + getVisitSeconds();
    questionStartRef.current = Date.now();

    setCurrentIndex(index);
    setShowEndConfirm(false);
    setShowSolution(false);
    setImageErrors({});
    /* NOTE: no timer reset — each question keeps its own remaining time */
  }

  function goToPrevious() {
    navigateTo(currentIndex - 1);
  }

  function goToNext() {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      navigateTo(currentIndex + 1);
    }
  }

  /* Skip = mark as read (if untouched) and move next. On the last question it just marks it. */
  function handleMarkAsRead() {
    if (!currentAnswer) {
      recordAnswer(currentIndex, 'read', null);
    }
    if (!isLastQuestion) {
      navigateTo(currentIndex + 1);
    }
  }

  function startQuiz() {
    var count = selectedCount === 0 ? allQuestions.length : Math.min(selectedCount, allQuestions.length);
    var picked = getRandomQuestions(allQuestions, count);
    var processed = picked.map(shuffleOptions);

    /* Initialize a fresh timer for every question */
    var initialTimers = [];
    for (var i = 0; i < processed.length; i++) initialTimers.push(timerDuration);

    setQuestions(processed);
    setTimers(initialTimers);
    setCurrentIndex(0);
    setAnswers([]);
    timeSpentRef.current = [];
    questionStartRef.current = Date.now();
    setShowEndConfirm(false);
    setShowSolution(false);
    setImageErrors({});
    setPhase('quiz');
  }

  function finishQuiz() {
    var stats = computeStats(answers, questions.length);
    var quote = getRandomQuote();
    setSavedQuote(quote);

    var result = {
      topicName: topicName,
      total: stats.total,
      attempted: stats.attempted,
      correct: stats.correct,
      wrong: stats.wrong,
      skipped: stats.skipped,
      accuracy: stats.accuracy,
      totalTime: stats.totalTime,
      avgTime: stats.avgTime,
      timerDuration: timerDuration,
      answers: answers,
      quote: quote,
      completedAt: new Date().toISOString(),
    };
    savePracticeResult(result);
    clearQuizParams();
    setPhase('results');
  }

  function handleEndQuiz() {
    setShowEndConfirm(false);
    finishQuiz();
  }

  function handleImageError(key) {
    setImageErrors(function (prev) {
      var next = {};
      for (var k in prev) next[k] = prev[k];
      next[key] = true;
      return next;
    });
  }

  // --- LOADING ---
  if (phase === 'loading') {
    return (
      <div className="quiz-page">
        <div className="quiz-loading">
          <div className="quiz-spinner" />
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  // --- ERROR ---
  if (phase === 'error') {
    return (
      <div className="quiz-page">
        <div className="quiz-error-box">
          <h2>Topic Not Found</h2>
          <p>Could not load questions. Please select a topic from the Topics page.</p>
          <button className="quiz-btn quiz-btn-primary" onClick={function () { navigate('/topics'); }} type="button">Back to Topics</button>
        </div>
      </div>
    );
  }

  // --- EMPTY ---
  if (phase === 'empty') {
    return (
      <div className="quiz-page">
        <div className="quiz-error-box">
          <h2>{topicName}</h2>
          <p>No questions available yet for this topic. Check back later!</p>
          <button className="quiz-btn quiz-btn-primary" onClick={function () { navigate('/topics'); }} type="button">Back to Topics</button>
        </div>
      </div>
    );
  }

  // --- SETUP ---
  if (phase === 'setup') {
    var counts = [10, 20, 50, 100];
    return (
      <div className="quiz-page">
        <div className="quiz-setup">
          <h1 className="quiz-setup-title">{topicName}</h1>
          <p className="quiz-setup-info">{allQuestions.length} questions available</p>

          <div className="quiz-setup-section">
            <label className="quiz-setup-label">Number of Questions</label>
            <div className="quiz-count-options">
              {counts.map(function (count) {
                return (
                  <button
                    key={count}
                    className={'quiz-count-btn' + (selectedCount === count ? ' quiz-count-btn-active' : '')}
                    onClick={function () { setSelectedCount(count); }}
                    disabled={count > allQuestions.length}
                    type="button"
                  >
                    {count}
                  </button>
                );
              })}
              <button
                className={'quiz-count-btn' + (selectedCount === 0 ? ' quiz-count-btn-active' : '')}
                onClick={function () { setSelectedCount(0); }}
                type="button"
              >
                All ({allQuestions.length})
              </button>
            </div>
          </div>

          <div className="quiz-setup-section">
            <label className="quiz-setup-label">Time per Question</label>
            <div className="quiz-timer-slider-wrap">
              <input
                type="range"
                className="quiz-timer-slider"
                min="30"
                max="600"
                step="30"
                value={timerDuration}
                onChange={function (e) { setTimerDuration(Number(e.target.value)); }}
              />
              <div className="quiz-timer-slider-labels">
                <span>30s</span>
                <span className="quiz-timer-slider-value">{formatDuration(timerDuration)}</span>
                <span>10m</span>
              </div>
            </div>
          </div>

          <div className="quiz-setup-section">
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">⏱</span>
              <span>{formatDuration(timerDuration)} per question — each question has its own timer</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">⏸</span>
              <span>Timer pauses when you navigate away and resumes when you return</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">✓</span>
              <span>Instant feedback with explanations</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">⇄</span>
              <span>Navigate freely — previous, skip or next</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">🔀</span>
              <span>Options are shuffled each attempt</span>
            </div>
          </div>

          <button className="quiz-btn quiz-btn-primary quiz-btn-large" onClick={startQuiz} type="button">Start Quiz</button>
          <button className="quiz-btn quiz-btn-ghost" onClick={function () { clearQuizParams(); navigate('/topics'); }} type="button">Cancel</button>
        </div>
      </div>
    );
  }

  // --- RESULTS ---
  if (phase === 'results') {
    var stats = computeStats(answers, questions.length);
    var acc = stats.accuracy;
    var correctPct = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    var wrongPct = stats.total > 0 ? (stats.wrong / stats.total) * 100 : 0;
    var skippedPct = stats.total > 0 ? (stats.skipped / stats.total) * 100 : 0;
    var quote = savedQuote;

    return (
      <div className="quiz-page quiz-page--results">
        <div className="quiz-results">

          {/* Hero */}
          <div className="qr-hero">
            <div className="qr-hero-bg" />
            <div className="qr-hero-content">
              <ScoreRing accuracy={acc} />
              <div className="qr-hero-text">
                <h1 className="qr-title">Quiz Complete</h1>
                {topicName && <span className="qr-topic-badge">{topicName}</span>}
                {/* Distribution bar */}
                <div className="qr-dist-bar">
                  <div className="qr-dist-fill qr-dist-fill--correct" style={{ width: correctPct + '%' }} />
                  <div className="qr-dist-fill qr-dist-fill--wrong" style={{ width: wrongPct + '%' }} />
                  <div className="qr-dist-fill qr-dist-fill--skipped" style={{ width: skippedPct + '%' }} />
                </div>
                <div className="qr-dist-legend">
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--correct" />Correct {stats.correct}</span>
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--wrong" />Wrong {stats.wrong}</span>
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--skipped" />Skipped {stats.skipped}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-grid">
            <StatCard icon="✓" value={stats.correct} label="Correct" variant="success" delay={0} />
            <StatCard icon="✗" value={stats.wrong} label="Wrong" variant="error" delay={80} />
            <StatCard icon="⊘" value={stats.skipped} label="Skipped" variant="warning" delay={160} />
            <StatCard icon="⚡" value={formatDuration(stats.avgTime)} label="Avg. Time / Q" variant="accent" delay={240} />
            <StatCard icon="🕐" value={formatDuration(stats.totalTime)} label="Total Time" variant="default" delay={320} />
            <StatCard icon="📊" value={stats.total} label="Questions" variant="default" delay={400} />
          </div>

          {/* Quote */}
          {quote && (
            <div className="qr-quote">
              <div className="qr-quote-deco">
                <svg width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
                  <path d="M0 32V18.4C0 12.3 1.4 7.6 4.2 4.2 7 .8 11.2-.8 16.8.4L16 6.4C13.6 5.6 11.6 5.8 10 7.2 8.4 8.6 7.6 10.8 7.6 14V18.4H16V32H0ZM24 32V18.4C24 12.3 25.4 7.6 28.2 4.2 31 .8 35.2-.8 40.8.4L40 6.4C37.6 5.6 35.6 5.8 34 7.2 32.4 8.6 31.6 10.8 31.6 14V18.4H40V32H24Z"/>
                </svg>
              </div>
              <p className="qr-quote-text">{quote.quote}</p>
              <div className="qr-quote-author-row">
                <span className="qr-quote-author">— {quote.author}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="qr-actions">
            <button className="quiz-btn quiz-btn-primary qr-action-btn" onClick={function () { setPhase('setup'); setSelectedCount(10); setTimerDuration(30); }} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 9A7 7 0 1 1 4.05 14.05" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M2 5V9H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Practice Again
            </button>
            <button className="quiz-btn quiz-btn-ghost qr-action-btn" onClick={function () { navigate('/topics'); }} type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9L9 3L15 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 8V15H13V8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Topics
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- QUIZ PHASE ---
  if (phase === 'quiz') {
    var currentQ = questions[currentIndex];
    if (!currentQ) return null;

    var correctIndex = currentQ.correctIndex;
    var options = currentQ.options;
    var progressPercent = ((currentIndex + 1) / questions.length) * 100;
    var timerColor = timer <= 5 ? 'quiz-timer-danger' : timer <= 10 ? 'quiz-timer-warning' : 'quiz-timer-normal';
    var timerWidth = (timer / timerDuration) * 100;
    var skipDisabled = !!currentAnswer;

    var answeredCount = 0;
    for (var qi = 0; qi < answers.length; qi++) {
      if (answers[qi] && answers[qi].status === 'answered') answeredCount++;
    }

    return (
      <div className="quiz-page">
        <div className="quiz-container">

          {/* Top Bar */}
          <div className="quiz-top-bar">
            <div className="quiz-top-left">
              <span className="quiz-topic-label">{topicName}</span>
            </div>
            <div className="quiz-top-right">
              <span className="quiz-q-count">{currentIndex + 1} / {questions.length}</span>
              <div className={'quiz-timer-wrap' + (isLocked ? ' quiz-timer-wrap--paused' : '')}
                   title={isLocked ? 'Timer stopped for this question' : 'Time remaining for this question'}>
                <span className={'quiz-timer-text ' + timerColor}>{timer}s</span>
                <div className="quiz-timer-track">
                  <div className={'quiz-timer-fill ' + timerColor} style={{ width: timerWidth + '%' }} />
                </div>
              </div>
              <button className="quiz-end-btn" onClick={function () { setShowEndConfirm(true); }} type="button">End</button>
            </div>
          </div>

          {showEndConfirm && (
            <div className="quiz-end-confirm">
              <p>End quiz? {answeredCount} of {questions.length} answered. Unanswered questions count as skipped.</p>
              <div className="quiz-end-confirm-actions">
                <button className="quiz-btn quiz-btn-ghost-sm" onClick={function () { setShowEndConfirm(false); }} type="button">Cancel</button>
                <button className="quiz-btn quiz-btn-danger" onClick={handleEndQuiz} type="button">End Quiz</button>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: progressPercent + '%' }} />
          </div>

          {/* Question Palette — jump to any question */}
          <div className={'quiz-palette' + (questions.length > 30 ? ' quiz-palette--compact' : '')}>
            {questions.map(function (_, idx) {
              var pa = answers[idx];
              var cls = 'quiz-palette-item';
              if (idx === currentIndex) cls += ' quiz-palette-item--current';
              else if (pa && pa.status === 'answered') cls += ' quiz-palette-item--answered';
              else if (pa) cls += ' quiz-palette-item--skipped';

              var stateLabel = 'Not answered';
              if (idx === currentIndex) stateLabel = 'Current';
              else if (pa && pa.status === 'answered') stateLabel = 'Answered';
              else if (pa) stateLabel = 'Marked as read';

              return (
                <button
                  key={idx}
                  type="button"
                  className={cls}
                  title={'Question ' + (idx + 1) + ' — ' + stateLabel}
                  onClick={function () { navigateTo(idx); }}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Marked as read badge */}
          {currentAnswer && currentAnswer.status === 'read' && (
            <div className="quiz-read-badge">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5H12C12.552 2.5 13 2.948 13 3.5V13.5L8 10.4L3 13.5V3.5C3 2.948 3.448 2.5 4 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Marked as read — you can still answer this question
            </div>
          )}

          {/* Question */}
          <div className="quiz-question-card">
            {currentQ.questionImage && !imageErrors.question && (
              <img
                className="quiz-question-image"
                src={currentQ.questionImage}
                alt="Question"
                onError={function () { handleImageError('question'); }}
              />
            )}
            {currentQ.question && (
              <h2 className="quiz-question-text">{currentQ.question}</h2>
            )}
            {!currentQ.question && !currentQ.questionImage && (
              <p className="quiz-question-text quiz-question-missing">Question content not available</p>
            )}
          </div>

          {/* Options */}
          <div className="quiz-options-grid">
            {options.map(function (option, idx) {
              var optClass = 'quiz-option';
              if (isLocked) {
                if (idx === correctIndex) optClass += ' quiz-option-correct';
                else if (idx === selectedOption && idx !== correctIndex) optClass += ' quiz-option-wrong';
                else optClass += ' quiz-option-dimmed';
              }
              return (
                <button key={idx} className={optClass} onClick={function () { handleSelect(idx); }} disabled={isLocked} type="button">
                  <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="quiz-option-text">{option}</span>
                  {isLocked && idx === correctIndex && <span className="quiz-option-check">✓</span>}
                  {isLocked && idx === selectedOption && idx !== correctIndex && <span className="quiz-option-cross">✗</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback (shown when answered or timed out) */}
          {isLocked && currentAnswer && (
            <div className="quiz-feedback-area">
              <div className="quiz-feedback">
                {currentAnswer.status === 'timeout' ? (
                  <p className="quiz-feedback-msg quiz-feedback-timeout">Time is up! Correct answer highlighted.</p>
                ) : currentAnswer.isCorrect ? (
                  <p className="quiz-feedback-msg quiz-feedback-correct">Correct!</p>
                ) : (
                  <p className="quiz-feedback-msg quiz-feedback-wrong">Incorrect. Correct answer highlighted.</p>
                )}
              </div>

              {currentQ.explanation && (
                <div className="quiz-explanation">
                  <span className="quiz-explanation-icon">💡</span>
                  <p>{currentQ.explanation}</p>
                </div>
              )}

              {currentQ.explanationImage && (
                <div className="quiz-solution-area">
                  <button
                    className="quiz-btn quiz-btn-outline"
                    onClick={function () { setShowSolution(!showSolution); }}
                    type="button"
                  >
                    {showSolution ? 'Hide Handwritten Solution' : 'View Handwritten Solution'}
                  </button>
                  {showSolution && !imageErrors.solution && (
                    <a
                      className="quiz-solution-image-link"
                      href={currentQ.explanationImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Click to open full size"
                    >
                      <img
                        className="quiz-solution-image"
                        src={currentQ.explanationImage}
                        alt="Handwritten solution"
                        onError={function () { handleImageError('solution'); }}
                      />
                    </a>
                  )}
                  {showSolution && imageErrors.solution && (
                    <p className="quiz-solution-missing">
                      Solution image could not be loaded.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation — Previous / Mark as Read / Next */}
          <div className="quiz-nav-bar">
            <button
              className="quiz-nav-btn"
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>

            <button
              className="quiz-nav-btn quiz-nav-btn--skip"
              onClick={handleMarkAsRead}
              disabled={skipDisabled}
              title={skipDisabled ? 'Already handled' : 'Mark as read and move to the next question'}
              type="button"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5H12C12.552 2.5 13 2.948 13 3.5V13.5L8 10.4L3 13.5V3.5C3 2.948 3.448 2.5 4 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Mark as Read
            </button>

            <button className="quiz-nav-btn quiz-nav-btn--primary" onClick={goToNext} type="button">
              {isLastQuestion ? 'View Results' : 'Next'}
              {isLastQuestion ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
}

export default TestQuiz;
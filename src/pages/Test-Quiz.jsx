import { useState, useEffect, useCallback, useRef, useContext } from 'react';
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
  var questionStartRef = useRef(Date.now());

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

  var selectedOptionState = useState(null);
  var selectedOption = selectedOptionState[0];
  var setSelectedOption = selectedOptionState[1];

  var isAnsweredState = useState(false);
  var isAnswered = isAnsweredState[0];
  var setIsAnswered = isAnsweredState[1];

  var scoreState = useState(0);
  var score = scoreState[0];
  var setScore = scoreState[1];

  var skippedState = useState(0);
  var skipped = skippedState[0];
  var setSkipped = skippedState[1];

  var timerState = useState(30);
  var timer = timerState[0];
  var setTimer = timerState[1];

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

  useEffect(function () {
    if (phase !== 'quiz' || isAnswered) return;
    if (timer <= 0) {
      handleTimeout();
      return;
    }
    var interval = setInterval(function () { setTimer(function (t) { return t - 1; }); }, 1000);
    return function () { clearInterval(interval); };
  }, [phase, timer, isAnswered]);

  function recordAnswer(selected, timedOut) {
    var timeSpent = Math.round((Date.now() - questionStartRef.current) / 1000);
    var q = questions[currentIndex];
    var isCorrect = selected === q.correctIndex;
    if (isCorrect && !timedOut) setScore(function (s) { return s + 1; });
    if (timedOut) setSkipped(function (s) { return s + 1; });
    setAnswers(function (prev) {
      return prev.concat([{
        question: q,
        selected: selected,
        correct: q.correctIndex,
        isCorrect: isCorrect,
        timedOut: timedOut,
        timeSpent: timeSpent,
      }]);
    });
  }

  function handleTimeout() {
    setIsAnswered(true);
    recordAnswer(null, true);
  }

  function handleSelect(index) {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    recordAnswer(index, false);
  }

  function startQuiz() {
    var count = selectedCount === 0 ? allQuestions.length : Math.min(selectedCount, allQuestions.length);
    var picked = getRandomQuestions(allQuestions, count);
    var processed = picked.map(shuffleOptions);

    setQuestions(processed);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setSkipped(0);
    setTimer(timerDuration);
    setAnswers([]);
    setShowEndConfirm(false);
    setShowSolution(false);
    setImageErrors({});
    setPhase('quiz');
    questionStartRef.current = Date.now();
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(function (i) { return i + 1; });
      setSelectedOption(null);
      setIsAnswered(false);
      setTimer(timerDuration);
      setShowSolution(false);
      setImageErrors({});
      questionStartRef.current = Date.now();
    } else {
      finishQuiz();
    }
  }

  function finishQuiz() {
    var totalTime = answers.reduce(function (sum, a) { return sum + a.timeSpent; }, 0);
    var correct = answers.filter(function (a) { return a.isCorrect; }).length;
    var wrongCount = answers.filter(function (a) { return !a.isCorrect && !a.timedOut; }).length;
    var skippedCount = answers.filter(function (a) { return a.timedOut; }).length;
    var acc = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;
    var avg = answers.length > 0 ? Math.round(totalTime / answers.length) : 0;
    var quote = getRandomQuote();
    setSavedQuote(quote);

    var result = {
      topicName: topicName,
      total: answers.length,
      correct: correct,
      wrong: wrongCount,
      skipped: skippedCount,
      accuracy: acc,
      totalTime: totalTime,
      avgTime: avg,
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
              <span>{formatDuration(timerDuration)} per question</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">✓</span>
              <span>Instant feedback with explanations</span>
            </div>
            <div className="quiz-setup-detail">
              <span className="quiz-setup-detail-icon">→</span>
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
    var totalTime = answers.reduce(function (sum, a) { return sum + a.timeSpent; }, 0);
    var correctCount = answers.filter(function (a) { return a.isCorrect; }).length;
    var wrongCount = answers.filter(function (a) { return !a.isCorrect && !a.timedOut; }).length;
    var skippedCount = answers.filter(function (a) { return a.timedOut; }).length;
    var total = answers.length;
    var acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    var avg = total > 0 ? Math.round(totalTime / total) : 0;
    var quote = savedQuote;

    var correctPct = total > 0 ? (correctCount / total) * 100 : 0;
    var wrongPct = total > 0 ? (wrongCount / total) * 100 : 0;
    var skippedPct = total > 0 ? (skippedCount / total) * 100 : 0;

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
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--correct" />Correct {correctCount}</span>
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--wrong" />Wrong {wrongCount}</span>
                  <span className="qr-dist-item"><span className="qr-dist-dot qr-dist-dot--skipped" />Skipped {skippedCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-grid">
            <StatCard icon="✓" value={correctCount} label="Correct" variant="success" delay={0} />
            <StatCard icon="✗" value={wrongCount} label="Wrong" variant="error" delay={80} />
            <StatCard icon="⊘" value={skippedCount} label="Skipped" variant="warning" delay={160} />
            <StatCard icon="⚡" value={formatDuration(avg)} label="Avg. Time / Q" variant="accent" delay={240} />
            <StatCard icon="🕐" value={formatDuration(totalTime)} label="Total Time" variant="default" delay={320} />
            <StatCard icon="📊" value={total} label="Questions" variant="default" delay={400} />
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
    var progressPercent = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;
    var timerColor = timer <= 5 ? 'quiz-timer-danger' : timer <= 10 ? 'quiz-timer-warning' : 'quiz-timer-normal';
    var timerWidth = (timer / timerDuration) * 100;

    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div className="quiz-top-bar">
            <div className="quiz-top-left">
              <span className="quiz-topic-label">{topicName}</span>
            </div>
            <div className="quiz-top-right">
              <div className="quiz-timer-wrap">
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
              <p>End quiz? {answers.length} question{answers.length !== 1 ? 's' : ''} answered.</p>
              <div className="quiz-end-confirm-actions">
                <button className="quiz-btn quiz-btn-ghost-sm" onClick={function () { setShowEndConfirm(false); }} type="button">Cancel</button>
                <button className="quiz-btn quiz-btn-danger" onClick={handleEndQuiz} type="button">End Quiz</button>
              </div>
            </div>
          )}

          <div className="quiz-progress-track">
            <div className="quiz-progress-fill" style={{ width: progressPercent + '%' }} />
          </div>
          <div className="quiz-progress-text">Question {currentIndex + 1} of {questions.length}</div>

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

          <div className="quiz-options-grid">
            {options.map(function (option, idx) {
              var optClass = 'quiz-option';
              if (isAnswered) {
                if (idx === correctIndex) optClass += ' quiz-option-correct';
                else if (idx === selectedOption && idx !== correctIndex) optClass += ' quiz-option-wrong';
                else optClass += ' quiz-option-dimmed';
              }
              return (
                <button key={idx} className={optClass} onClick={function () { handleSelect(idx); }} disabled={isAnswered} type="button">
                  <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                  <span className="quiz-option-text">{option}</span>
                  {isAnswered && idx === correctIndex && <span className="quiz-option-check">✓</span>}
                  {isAnswered && idx === selectedOption && idx !== correctIndex && <span className="quiz-option-cross">✗</span>}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="quiz-feedback-area">
              <div className="quiz-feedback">
                <div className="quiz-feedback-left">
                  {selectedOption === null ? (
                    <p className="quiz-feedback-msg quiz-feedback-timeout">Time is up! Correct answer highlighted.</p>
                  ) : selectedOption === correctIndex ? (
                    <p className="quiz-feedback-msg quiz-feedback-correct">Correct!</p>
                  ) : (
                    <p className="quiz-feedback-msg quiz-feedback-wrong">Incorrect. Correct answer highlighted.</p>
                  )}
                </div>
                <button className="quiz-btn quiz-btn-primary" onClick={handleNext} type="button">
                  {currentIndex === questions.length - 1 ? 'View Results' : 'Next →'}
                </button>
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
                    {showSolution ? 'Hide Solution' : 'View Solution'}
                  </button>
                  {showSolution && !imageErrors.solution && (
                    <img
                      className="quiz-solution-image"
                      src={currentQ.explanationImage}
                      alt="Solution"
                      onError={function () { handleImageError('solution'); }}
                    />
                  )}
                </div>
              )}
            </div>
          )}

          <div className="quiz-score-bar">
            <div className="quiz-score-item">
              <span className="quiz-score-correct">✓</span>
              <span>{score}</span>
            </div>
            <div className="quiz-score-item">
              <span className="quiz-score-wrong">✗</span>
              <span>{currentIndex + 1 - score - (isAnswered && selectedOption === null ? 1 : 0)}</span>
            </div>
            <div className="quiz-score-item">
              <span className="quiz-score-skip">⏱</span>
              <span>{skipped}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default TestQuiz;
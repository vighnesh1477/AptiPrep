import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { NavigationContext } from '../App';
import { getPlatformTestParams, savePlatformTestParams } from '../utils/storage';
import mettlQuestionsData from '../data/mettlQuestions.json';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowLeft,
  Check,
  X,
  Eye,
  Layers,
} from 'lucide-react';
import '../styles/Platformtest.css';

/* Default fallback platform */
const DEFAULT_PLATFORM = {
  id: 'mercer-mettl',
  name: 'Mercer | Mettl',
  monogram: 'MM',
  category: 'Assessment Suite',
  sections: 'Aptitude · Logical · Verbal',
  description: 'Enterprise assessment suite with AI-powered proctoring for campus drives and recruitment tests.',
};

/* ── Formatted Question Component for Readability ── */
function FormattedQuestion({ text, isReview = false }) {
  if (!text) return null;

  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={`pt-formatted-q ${isReview ? 'pt-formatted-q--review' : ''}`}>
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // 1. Directions Banner
        if (/^Directions?(?:\s*\([^)]*\))?:/i.test(trimmed)) {
          return (
            <div key={pIdx} className="pt-q-banner-directions">
              <span className="pt-q-banner-tag">Notice</span>
              <span>{trimmed}</span>
            </div>
          );
        }

        // 2. Logic statements / Syllogisms block
        if (/^(Statements?\s*:|Conclusions?\s*:)/i.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <div key={pIdx} className="pt-q-card-structured pt-q-card--logic">
              {lines.map((line, lIdx) => {
                const lTrim = line.trim();
                const isHeading = /^(Statements?\s*:|Conclusions?\s*:)/i.test(lTrim);
                const isBullet = lTrim.startsWith('•') || /^[I|V|X]+\.\s+/i.test(lTrim);
                return (
                  <div
                    key={lIdx}
                    className={
                      isHeading
                        ? 'pt-q-struct-heading'
                        : isBullet
                        ? 'pt-q-struct-bullet'
                        : 'pt-q-struct-line'
                    }
                  >
                    {lTrim}
                  </div>
                );
              })}
            </div>
          );
        }

        // 3. Input & Output machine steps
        if (/^(Input:|Step\s+(?:[0-9]+|[IVXLCDM]+):)/i.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <div key={pIdx} className="pt-q-card-structured pt-q-card--steps">
              {lines.map((line, lIdx) => {
                const lTrim = line.trim();
                const isStep = /^(Input:|Step\s+(?:[0-9]+|[IVXLCDM]+):)/i.test(lTrim);
                return (
                  <div key={lIdx} className={isStep ? 'pt-q-step-row' : 'pt-q-step-note'}>
                    {lTrim}
                  </div>
                );
              })}
            </div>
          );
        }

        // 4. Para Jumbles sentences
        if (/^[A-E]:|^[P-S]:|^S[1-6]:/i.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <div key={pIdx} className="pt-q-card-structured pt-q-card--jumbles">
              {lines.map((line, lIdx) => {
                const lTrim = line.trim();
                return (
                  <div key={lIdx} className="pt-q-jumble-row">
                    {lTrim}
                  </div>
                );
              })}
            </div>
          );
        }

        // 5. Explicit Question prompt
        if (/^Question:\s*/i.test(trimmed)) {
          const lines = trimmed.split('\n');
          return (
            <div key={pIdx} className="pt-q-card-prompt">
              {lines.map((line, lIdx) => {
                const lTrim = line.trim();
                const isSubOpt = /^[A-D]\.\s+/i.test(lTrim);
                return (
                  <div
                    key={lIdx}
                    className={isSubOpt ? 'pt-q-sub-option-item' : 'pt-q-prompt-headline'}
                  >
                    {lTrim}
                  </div>
                );
              })}
            </div>
          );
        }

        // 6. Reading Comprehension passage paragraph
        if (trimmed.length > 250 && !trimmed.endsWith('?')) {
          return (
            <div key={pIdx} className="pt-q-passage-box">
              <p className="pt-q-passage-para">{trimmed}</p>
            </div>
          );
        }

        // 7. Regular paragraph
        return (
          <p key={pIdx} className={isReview ? 'pt-rev-qtext' : 'pt-q-text'}>
            {trimmed}
          </p>
        );
      })}
    </div>
  );
}

/* ── Formatted Explanation Component ── */
function FormattedExplanation({ text }) {
  if (!text) return null;
  const lines = text.split(/\n+/);
  return (
    <div className="pt-rev-exp-text pt-rev-exp-formatted">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return null;
        const isStep = /^(Step\s+[0-9IVX]+:|Input:|Rule:|Answer:|Solution:)/i.test(trimmed);
        return (
          <div key={idx} className={isStep ? 'pt-exp-step-line' : 'pt-exp-line'}>
            {trimmed}
          </div>
        );
      })}
    </div>
  );
}

const SECTION_TABS = ['All Modules', 'Aptitude', 'Logical', 'Verbal'];

// Fisher-Yates array shuffle
function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

// Scramble question options while accurately updating correctIndex and correctAnswer
function scrambleQuestionOptions(q) {
  if (!q.options || q.options.length <= 1) return q;
  const indexed = q.options.map((opt, idx) => ({ opt, idx }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = indexed[i];
    indexed[i] = indexed[j];
    indexed[j] = temp;
  }
  const newCorrectIndex = indexed.findIndex((item) => item.idx === q.correctIndex);
  const shuffledOptions = indexed.map((item) => item.opt);
  return {
    ...q,
    options: shuffledOptions,
    correctIndex: newCorrectIndex !== -1 ? newCorrectIndex : q.correctIndex,
    correctAnswer: newCorrectIndex !== -1 ? shuffledOptions[newCorrectIndex] : q.correctAnswer,
  };
}

// Sample and scramble questions across topics or within a specific topic
function sampleAndScrambleQuestions(topic) {
  let pool = [];

  if (topic === 'All Topics (Mixed Assessment)') {
    const grouped = {};
    mettlQuestionsData.forEach((q) => {
      const t = q.topic || 'General Aptitude';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(q);
    });

    const sampled = [];
    Object.values(grouped).forEach((list) => {
      if (list.length > 0) {
        const randIdx = Math.floor(Math.random() * list.length);
        sampled.push(list[randIdx]);
      }
    });

    pool = shuffleArray(sampled);
    if (pool.length > 25) {
      pool = pool.slice(0, 25);
    } else if (pool.length < 20) {
      const remaining = mettlQuestionsData.filter((q) => !pool.some((p) => p.id === q.id));
      pool = pool.concat(shuffleArray(remaining).slice(0, 20 - pool.length));
    }
  } else if (topic && topic.endsWith('(Mixed Assessment)')) {
    const sectionKeyword = topic.replace('All ', '').replace(' (Mixed Assessment)', '').toLowerCase();
    const sectionQuestions = mettlQuestionsData.filter(
      (q) => (q.section || '').toLowerCase().includes(sectionKeyword) || (q.topic || '').toLowerCase().includes(sectionKeyword)
    );

    const grouped = {};
    sectionQuestions.forEach((q) => {
      const t = q.topic || 'General';
      if (!grouped[t]) grouped[t] = [];
      grouped[t].push(q);
    });

    const sampled = [];
    Object.values(grouped).forEach((list) => {
      if (list.length > 0) {
        const randIdx = Math.floor(Math.random() * list.length);
        sampled.push(list[randIdx]);
      }
    });

    pool = shuffleArray(sampled);
    if (pool.length > 25) {
      pool = pool.slice(0, 25);
    } else if (pool.length < 20) {
      const remaining = sectionQuestions.filter((q) => !pool.some((p) => p.id === q.id));
      pool = pool.concat(shuffleArray(remaining).slice(0, 20 - pool.length));
    }
  } else {
    const topicQuestions = mettlQuestionsData.filter((q) => q.topic === topic);
    if (topicQuestions.length > 0) {
      pool = shuffleArray(topicQuestions);
    } else {
      pool = shuffleArray(mettlQuestionsData).slice(0, 20);
    }
  }

  return pool.map(scrambleQuestionOptions);
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function formatFullTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function Platformtest() {
  const { navigate } = useContext(NavigationContext);

  const [platform, setPlatform] = useState(() => {
    return getPlatformTestParams() || DEFAULT_PLATFORM;
  });

  const [phase, setPhase] = useState('instructions'); // 'instructions' | 'testing' | 'results'
  const [activeSectionTab, setActiveSectionTab] = useState('All Modules');
  const [selectedTopic, setSelectedTopic] = useState('All Topics (Mixed Assessment)');
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [ci, setCi] = useState(0); // Current question index
  const [answers, setAnswers] = useState([]); // [{ selectedOption, status, timeSpent }]
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes default
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all'); // 'all' | 'correct' | 'wrong' | 'unattempted'

  const questionStartTimeRef = useRef(Date.now());
  const timerIntervalRef = useRef(null);
  const isFinishedRef = useRef(false);

  /* Compute dynamically available topics grouped by section */
  const visibleTopics = useMemo(() => {
    const topicsSet = new Set();
    mettlQuestionsData.forEach((q) => {
      if (activeSectionTab === 'All Modules') {
        if (q.topic) topicsSet.add(q.topic);
      } else {
        const sec = (q.section || '').toLowerCase();
        const tab = activeSectionTab.toLowerCase();
        if (sec.includes(tab) || (q.topic && q.topic.toLowerCase().includes(tab))) {
          topicsSet.add(q.topic);
        }
      }
    });

    const topicList = Array.from(topicsSet);
    if (activeSectionTab === 'All Modules') {
      return ['All Topics (Mixed Assessment)', ...topicList];
    }
    return [`All ${activeSectionTab} (Mixed Assessment)`, ...topicList];
  }, [activeSectionTab]);

  /* Ensure selectedTopic is valid when switching section tabs */
  useEffect(() => {
    if (visibleTopics.length > 0 && !visibleTopics.includes(selectedTopic)) {
      setSelectedTopic(visibleTopics[0]);
    }
  }, [visibleTopics, selectedTopic]);

  /* Load questions based on chosen topic with random scrambling */
  useEffect(() => {
    const loadedPlatform = getPlatformTestParams() || DEFAULT_PLATFORM;
    setPlatform(loadedPlatform);

    if (loadedPlatform.id !== 'mercer-mettl') {
      setQuestions([]);
      setAnswers([]);
      setCi(0);
      return;
    }

    const prepared = sampleAndScrambleQuestions(selectedTopic);
    setQuestions(prepared);
    setAnswers(
      prepared.map(() => ({
        selectedOption: null,
        status: 'not_visited', // 'not_visited' | 'not_answered' | 'answered' | 'marked' | 'answered_marked'
        timeSpent: 0,
      }))
    );
    setCi(0);
  }, [selectedTopic, platform.id]);

  /* Exam timer countdown */
  useEffect(() => {
    if (phase !== 'testing') return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [phase]);

  /* Bank time spent on currently viewed question */
  function recordCurrentQuestionTime() {
    const elapsed = Math.max(0, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    questionStartTimeRef.current = Date.now();
    setAnswers((prev) => {
      const copy = [...prev];
      if (copy[ci]) {
        copy[ci] = {
          ...copy[ci],
          timeSpent: (copy[ci].timeSpent || 0) + elapsed,
        };
      }
      return copy;
    });
  }

  /* Start test from instructions */
  function handleStartTest() {
    if (!agreementChecked) return;
    recordCurrentQuestionTime();
    setAnswers((prev) => {
      const copy = [...prev];
      if (copy[0] && copy[0].status === 'not_visited') {
        copy[0] = { ...copy[0], status: 'not_answered' };
      }
      return copy;
    });
    setTimeLeft(Math.max(10, questions.length * 90)); // 1.5 mins per question
    setPhase('testing');
    window.scrollTo(0, 0);
  }

  /* Jump to a specific question from palette */
  function handleJumpToQuestion(targetIndex) {
    if (targetIndex === ci || targetIndex < 0 || targetIndex >= questions.length) return;
    recordCurrentQuestionTime();
    setAnswers((prev) => {
      const copy = [...prev];
      if (copy[targetIndex] && copy[targetIndex].status === 'not_visited') {
        copy[targetIndex] = { ...copy[targetIndex], status: 'not_answered' };
      }
      return copy;
    });
    setCi(targetIndex);
  }

  /* Option selected by candidate */
  function handleSelectOption(optionIdx) {
    setAnswers((prev) => {
      const copy = [...prev];
      const cur = copy[ci];
      const newSelected = cur.selectedOption === optionIdx ? null : optionIdx;
      let newStatus = cur.status;

      if (newSelected !== null) {
        newStatus = cur.status === 'marked' || cur.status === 'answered_marked'
          ? 'answered_marked'
          : 'answered';
      } else {
        newStatus = cur.status === 'answered_marked' || cur.status === 'marked'
          ? 'marked'
          : 'not_answered';
      }

      copy[ci] = {
        ...cur,
        selectedOption: newSelected,
        status: newStatus,
      };
      return copy;
    });
  }

  /* Clear response for current question */
  function handleClearResponse() {
    setAnswers((prev) => {
      const copy = [...prev];
      const cur = copy[ci];
      copy[ci] = {
        ...cur,
        selectedOption: null,
        status: cur.status === 'answered_marked' || cur.status === 'marked' ? 'marked' : 'not_answered',
      };
      return copy;
    });
  }

  /* Mark for Review and advance */
  function handleMarkForReview() {
    recordCurrentQuestionTime();
    setAnswers((prev) => {
      const copy = [...prev];
      const cur = copy[ci];
      const hasAnswer = cur.selectedOption !== null;
      copy[ci] = {
        ...cur,
        status: hasAnswer ? 'answered_marked' : 'marked',
      };

      const nextIdx = ci + 1;
      if (nextIdx < questions.length && copy[nextIdx].status === 'not_visited') {
        copy[nextIdx] = { ...copy[nextIdx], status: 'not_answered' };
      }
      return copy;
    });

    if (ci < questions.length - 1) {
      setCi(ci + 1);
    }
  }

  /* Save and Next */
  function handleSaveAndNext() {
    recordCurrentQuestionTime();
    setAnswers((prev) => {
      const copy = [...prev];
      const cur = copy[ci];
      if (cur.selectedOption !== null) {
        copy[ci] = { ...cur, status: cur.status === 'answered_marked' ? 'answered_marked' : 'answered' };
      } else {
        copy[ci] = { ...cur, status: cur.status === 'marked' ? 'marked' : 'not_answered' };
      }

      const nextIdx = ci + 1;
      if (nextIdx < questions.length && copy[nextIdx].status === 'not_visited') {
        copy[nextIdx] = { ...copy[nextIdx], status: 'not_answered' };
      }
      return copy;
    });

    if (ci < questions.length - 1) {
      setCi(ci + 1);
    } else {
      setShowSubmitModal(true);
    }
  }

  /* Previous question */
  function handlePrevious() {
    if (ci > 0) {
      recordCurrentQuestionTime();
      setCi(ci - 1);
    }
  }

  /* Final Submit */
  function handleFinalSubmit() {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    recordCurrentQuestionTime();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setShowSubmitModal(false);
    setPhase('results');
    window.scrollTo(0, 0);
  }

  /* Retake test (freshly scramble questions and options) */
  function handleRetakeTest() {
    isFinishedRef.current = false;
    const freshQuestions = sampleAndScrambleQuestions(selectedTopic);
    setQuestions(freshQuestions);
    setTimeLeft(Math.max(10, freshQuestions.length * 90));
    setCi(0);
    setAnswers(
      freshQuestions.map(() => ({
        selectedOption: null,
        status: 'not_visited',
        timeSpent: 0,
      }))
    );
    setAgreementChecked(false);
    setPhase('instructions');
    window.scrollTo(0, 0);
  }

  /* Palette stats tally */
  const paletteStats = useMemo(() => {
    let answered = 0;
    let notAnswered = 0;
    let marked = 0;
    let answeredMarked = 0;
    let notVisited = 0;

    answers.forEach((a) => {
      if (a.status === 'answered') answered++;
      else if (a.status === 'not_answered') notAnswered++;
      else if (a.status === 'marked') marked++;
      else if (a.status === 'answered_marked') answeredMarked++;
      else notVisited++;
    });

    return { answered, notAnswered, marked, answeredMarked, notVisited };
  }, [answers]);

  /* Results computed score */
  const resultsData = useMemo(() => {
    if (phase !== 'results') return null;

    let correctCount = 0;
    let wrongCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const evaluated = questions.map((q, idx) => {
      const userAns = answers[idx];
      const selected = userAns?.selectedOption;
      const isAttempted = selected !== null && selected !== undefined;
      const isCorrect = isAttempted && selected === q.correctIndex;

      if (!isAttempted) {
        unattemptedCount++;
      } else if (isCorrect) {
        correctCount++;
        totalScore += 1;
      } else {
        wrongCount++;
      }

      return {
        question: q,
        index: idx + 1,
        selectedOption: selected,
        correctIndex: q.correctIndex,
        isCorrect,
        isAttempted,
        timeSpent: userAns?.timeSpent || 0,
      };
    });

    const total = questions.length;
    const attempted = correctCount + wrongCount;
    const accuracy = attempted > 0 ? Math.round((correctCount / attempted) * 100) : 0;
    const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const totalTimeSpent = answers.reduce((acc, a) => acc + (a.timeSpent || 0), 0);

    return {
      total,
      correctCount,
      wrongCount,
      unattemptedCount,
      totalScore,
      accuracy,
      percentage,
      totalTimeSpent,
      evaluated,
    };
  }, [phase, questions, answers]);

  /* Current question item */
  const currentQ = questions[ci] || null;
  const currentAns = answers[ci] || { selectedOption: null, status: 'not_visited' };

  /* Filtered review list */
  const filteredReviewList = useMemo(() => {
    if (!resultsData) return [];
    if (reviewFilter === 'correct') return resultsData.evaluated.filter((e) => e.isCorrect);
    if (reviewFilter === 'wrong') return resultsData.evaluated.filter((e) => e.isAttempted && !e.isCorrect);
    if (reviewFilter === 'unattempted') return resultsData.evaluated.filter((e) => !e.isAttempted);
    return resultsData.evaluated;
  }, [resultsData, reviewFilter]);

  /* -------------------------------------------------------------
     GUARD: ONLY MERCER | METTL HAS QUESTIONS LOADED FOR NOW
     ------------------------------------------------------------- */
  if (platform.id !== 'mercer-mettl') {
    return (
      <div className="pt-page">
        <div className="pt-empty-container">
          <div className="pt-empty-card">
            <div className="pt-empty-badge">
              <span>{platform.monogram || 'PT'}</span>
            </div>
            <span className="pt-empty-tag">In Preparation</span>
            <h1 className="pt-empty-title">{platform.name}</h1>
            <p className="pt-empty-desc">
              Questions and mock tests for <strong>{platform.name}</strong> are currently in development.
              Currently, questions are only available for <strong>Mercer | Mettl</strong>.
            </p>
            <div className="pt-empty-actions">
              <button
                type="button"
                className="pt-btn pt-btn--primary"
                onClick={() => {
                  savePlatformTestParams(DEFAULT_PLATFORM);
                  setPlatform(DEFAULT_PLATFORM);
                }}
              >
                Practice Mercer | Mettl (500+ Questions)
              </button>
              <button
                type="button"
                className="pt-btn pt-btn--ghost"
                onClick={() => navigate('/platforms')}
              >
                <ArrowLeft size={14} /> Back to Platforms Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     PHASE 1: INSTRUCTIONS & TOPIC SELECTION
     ------------------------------------------------------------- */
  if (phase === 'instructions') {
    return (
      <div className="pt-page">
        <div className="pt-instructions-container">
          {/* Header Card */}
          <div className="pt-inst-header-card">
            <div className="pt-inst-logo-badge">
              <span>{platform.monogram || 'MM'}</span>
            </div>
            <div className="pt-inst-meta">
              <span className="pt-inst-tag">{platform.category}</span>
              <h1 className="pt-inst-title">{platform.name} Assessment</h1>
              <p className="pt-inst-desc">
                Standard platform test environment configured for Aptitude & Problem Solving modules.
              </p>
            </div>
          </div>

          <div className="pt-inst-grid">
            {/* Left Column: Guidelines & Rules */}
            <div className="pt-inst-main">
              <div className="pt-inst-card">
                <h2 className="pt-inst-section-heading">Assessment Structure</h2>
                <div className="pt-inst-stats-row">
                  <div className="pt-inst-stat-box">
                    <span className="pt-stat-num">{questions.length}</span>
                    <span className="pt-stat-lbl">Questions</span>
                  </div>
                  <div className="pt-inst-stat-box">
                    <span className="pt-stat-num">{Math.round((questions.length * 90) / 60)}m</span>
                    <span className="pt-stat-lbl">Duration</span>
                  </div>
                  <div className="pt-inst-stat-box">
                    <span className="pt-stat-num">+1.00</span>
                    <span className="pt-stat-lbl">Correct Mark</span>
                  </div>
                  <div className="pt-inst-stat-box">
                    <span className="pt-stat-num">0.00</span>
                    <span className="pt-stat-lbl">Negative Mark</span>
                  </div>
                </div>

                <h3 className="pt-inst-subheading">Instructions & Test Rules</h3>
                <ul className="pt-inst-list">
                  <li>
                    <strong>Navigation:</strong> Use the Question Palette on the right panel to jump between questions at any time.
                  </li>
                  <li>
                    <strong>Saving Responses:</strong> Click <em>Save & Next</em> to record your choice.
                  </li>
                  <li>
                    <strong>Review Feature:</strong> Use <em>Mark for Review & Next</em> to flag questions for reconsideration before final submission.
                  </li>
                  <li>
                    <strong>Timer:</strong> The test automatically submits when the countdown timer reaches zero.
                  </li>
                </ul>
              </div>

              {/* Palette Legend Guide */}
              <div className="pt-inst-card">
                <h2 className="pt-inst-section-heading">Question Palette Legend</h2>
                <div className="pt-legend-guide-grid">
                  <div className="pt-legend-guide-item">
                    <span className="pt-badge-symbol pt-badge-symbol--answered">1</span>
                    <div>
                      <strong>Answered</strong>
                      <p>Question has been answered.</p>
                    </div>
                  </div>
                  <div className="pt-legend-guide-item">
                    <span className="pt-badge-symbol pt-badge-symbol--not-answered">2</span>
                    <div>
                      <strong>Not Answered</strong>
                      <p>Question visited but left unanswered.</p>
                    </div>
                  </div>
                  <div className="pt-legend-guide-item">
                    <span className="pt-badge-symbol pt-badge-symbol--marked">3</span>
                    <div>
                      <strong>Marked for Review</strong>
                      <p>Flagged for review without an answer.</p>
                    </div>
                  </div>
                  <div className="pt-legend-guide-item">
                    <span className="pt-badge-symbol pt-badge-symbol--answered-marked">4</span>
                    <div>
                      <strong>Answered & Marked</strong>
                      <p>Answered and flagged for later review.</p>
                    </div>
                  </div>
                  <div className="pt-legend-guide-item">
                    <span className="pt-badge-symbol pt-badge-symbol--not-visited">5</span>
                    <div>
                      <strong>Not Visited</strong>
                      <p>Question has not been opened yet.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Topic Selection & Start */}
            <div className="pt-inst-sidebar">
              {/* Topic Selector Card */}
              <div className="pt-inst-card">
                <div className="pt-topic-select-head">
                  <Layers size={17} className="pt-topic-icon" />
                  <h3 className="pt-topic-select-title">Select Module Topic</h3>
                </div>
                <p className="pt-topic-select-sub">
                  Filter by module section or choose an individual topic:
                </p>

                {/* Section filter tabs */}
                <div className="pt-section-tabs">
                  {SECTION_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      className={`pt-section-tab ${activeSectionTab === tab ? 'pt-section-tab--active' : ''}`}
                      onClick={() => setActiveSectionTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="pt-topic-options-list">
                  {visibleTopics.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      className={`pt-topic-btn ${selectedTopic === topic ? 'pt-topic-btn--active' : ''}`}
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <span className="pt-topic-radio">
                        {selectedTopic === topic && <span className="pt-topic-radio-dot" />}
                      </span>
                      <span className="pt-topic-btn-text">{topic}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Agreement & Launch Action */}
              <div className="pt-inst-card pt-action-card">
                <label className="pt-declaration-label">
                  <input
                    type="checkbox"
                    className="pt-declaration-checkbox"
                    checked={agreementChecked}
                    onChange={(e) => setAgreementChecked(e.target.checked)}
                  />
                  <span>
                    I have read and understood all assessment instructions and am ready to start.
                  </span>
                </label>

                <button
                  type="button"
                  className="pt-start-btn"
                  disabled={!agreementChecked}
                  onClick={handleStartTest}
                >
                  Start Assessment ({questions.length} Questions)
                </button>

                <button
                  type="button"
                  className="pt-back-btn"
                  onClick={() => navigate('/platforms')}
                >
                  <ArrowLeft size={14} /> Back to Platforms Directory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     PHASE 2: LIVE PLATFORM TEST
     ------------------------------------------------------------- */
  if (phase === 'testing') {
    const isTimerUrgent = timeLeft <= 300; // < 5 mins
    const isTimerCritical = timeLeft <= 60; // < 1 min

    return (
      <div className="pt-exam-page">
        {/* Platform Assessment Top Bar */}
        <header className="pt-exam-header">
          <div className="pt-exam-header-left">
            <div className="pt-brand-pill">
              <span className="pt-brand-monogram">{platform.monogram || 'MM'}</span>
              <span className="pt-brand-name">{platform.name}<span className="pt-hide-mobile"> Assessment</span></span>
            </div>
            <div className="pt-section-crumb">
              <span className="pt-crumb-label">Module:</span>
              <span className="pt-crumb-value">{selectedTopic}</span>
            </div>
          </div>

          <div className="pt-exam-header-right">
            <div
              className={`pt-timer-display ${isTimerCritical ? 'pt-timer--critical' : isTimerUrgent ? 'pt-timer--urgent' : ''}`}
              title="Time remaining"
            >
              <Clock size={16} />
              <span className="pt-timer-digits">{formatTime(timeLeft)}</span>
            </div>

            <button
              type="button"
              className="pt-submit-header-btn"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit<span className="pt-hide-mobile"> Test</span>
            </button>
          </div>
        </header>

        {/* Main 2-Column Assessment Layout */}
        <div className="pt-exam-layout">
          {/* LEFT: Question Workspace */}
          <main className="pt-exam-main">
            {currentQ ? (
              <div className="pt-q-container">
                {/* Question Info Bar */}
                <div className="pt-q-meta-bar">
                  <div className="pt-q-title-group">
                    <span className="pt-q-index">Question {ci + 1}</span>
                    <span className="pt-q-total">of {questions.length}</span>
                    <span className="pt-q-topic-tag">{currentQ.topic}</span>
                  </div>
                  <div className="pt-q-marks-tag">
                    <span>Marks: +1.00 / 0.00</span>
                  </div>
                </div>

                {/* Question Body */}
                <div className="pt-q-body">
                  <FormattedQuestion text={currentQ.question} />
                  {currentQ.questionImage && (
                    <div className="pt-q-image-container">
                      <img src={currentQ.questionImage} alt="Question diagram" className="pt-q-image" />
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="pt-options-list">
                  {currentQ.options && currentQ.options.map((opt, oIdx) => {
                    const isSelected = currentAns.selectedOption === oIdx;
                    const letter = String.fromCharCode(65 + oIdx);
                    const isImg = typeof opt === 'string' && (opt.startsWith('http://') || opt.startsWith('https://') || opt.startsWith('data:image/'));
                    return (
                      <button
                        key={oIdx}
                        type="button"
                        className={`pt-option-row ${isSelected ? 'pt-option-row--selected' : ''}`}
                        onClick={() => handleSelectOption(oIdx)}
                      >
                        <span className="pt-option-radio">
                          {isSelected && <span className="pt-option-radio-dot" />}
                        </span>
                        <span className="pt-option-letter">{letter}</span>
                        {isImg ? (
                          <img src={opt} alt={`Option ${letter}`} className="pt-option-img" />
                        ) : (
                          <span className="pt-option-text">{opt}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Action Bar */}
                <div className="pt-q-actions-bar">
                  <div className="pt-q-actions-left">
                    <button
                      type="button"
                      className="pt-action-btn pt-action-btn--mark"
                      onClick={handleMarkForReview}
                    >
                      <Bookmark size={14} />
                      <span>Mark<span className="pt-hide-mobile"> for Review</span> & Next</span>
                    </button>
                    <button
                      type="button"
                      className="pt-action-btn pt-action-btn--clear"
                      onClick={handleClearResponse}
                      disabled={currentAns.selectedOption === null}
                    >
                      <span>Clear<span className="pt-hide-mobile"> Response</span></span>
                    </button>
                  </div>

                  <div className="pt-q-actions-right">
                    <button
                      type="button"
                      className="pt-action-btn pt-action-btn--prev"
                      onClick={handlePrevious}
                      disabled={ci === 0}
                    >
                      <ChevronLeft size={16} />
                      <span>Previous</span>
                    </button>

                    <button
                      type="button"
                      className="pt-action-btn pt-action-btn--next"
                      onClick={handleSaveAndNext}
                    >
                      <span>{ci === questions.length - 1 ? 'Save & Review' : 'Save & Next'}</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-loading-box">Loading question...</div>
            )}
          </main>

          {/* RIGHT: Question Palette Console */}
          <aside className="pt-exam-sidebar">
            {/* Status Legend */}
            <div className="pt-palette-legend">
              <div className="pt-legend-row">
                <div className="pt-legend-badge">
                  <span className="pt-dot pt-dot--answered" />
                  <span>Answered ({paletteStats.answered})</span>
                </div>
                <div className="pt-legend-badge">
                  <span className="pt-dot pt-dot--not-answered" />
                  <span>Not Answered ({paletteStats.notAnswered})</span>
                </div>
              </div>
              <div className="pt-legend-row">
                <div className="pt-legend-badge">
                  <span className="pt-dot pt-dot--marked" />
                  <span>Marked for Review ({paletteStats.marked})</span>
                </div>
                <div className="pt-legend-badge">
                  <span className="pt-dot pt-dot--answered-marked" />
                  <span>Ans & Marked ({paletteStats.answeredMarked})</span>
                </div>
              </div>
              <div className="pt-legend-row">
                <div className="pt-legend-badge">
                  <span className="pt-dot pt-dot--not-visited" />
                  <span>Not Visited ({paletteStats.notVisited})</span>
                </div>
              </div>
            </div>

            {/* Palette Grid */}
            <div className="pt-palette-section">
              <div className="pt-palette-title">Question Palette</div>
              <div className="pt-palette-grid">
                {questions.map((_, idx) => {
                  const state = answers[idx]?.status || 'not_visited';
                  const isCurrent = idx === ci;

                  let stateClass = 'pt-grid-btn--not-visited';
                  if (state === 'answered') stateClass = 'pt-grid-btn--answered';
                  else if (state === 'not_answered') stateClass = 'pt-grid-btn--not-answered';
                  else if (state === 'marked') stateClass = 'pt-grid-btn--marked';
                  else if (state === 'answered_marked') stateClass = 'pt-grid-btn--answered-marked';

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`pt-grid-btn ${stateClass} ${isCurrent ? 'pt-grid-btn--current' : ''}`}
                      onClick={() => handleJumpToQuestion(idx)}
                      title={`Question ${idx + 1} (${state.replace('_', ' ')})`}
                    >
                      {idx + 1}
                      {state === 'answered_marked' && <span className="pt-subdot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Final Submit Trigger */}
            <div className="pt-sidebar-footer">
              <button
                type="button"
                className="pt-sidebar-submit-btn"
                onClick={() => setShowSubmitModal(true)}
              >
                Submit Assessment
              </button>
            </div>
          </aside>
        </div>

        {/* Confirmation Modal */}
        {showSubmitModal && (
          <div className="pt-modal-overlay">
            <div className="pt-submit-modal" role="dialog" aria-modal="true">
              <h2 className="pt-modal-heading">End Assessment Confirmation</h2>
              <p className="pt-modal-subheading">
                Are you sure you want to submit your assessment? Check your attempt summary below:
              </p>

              <div className="pt-modal-summary-grid">
                <div className="pt-modal-stat-card">
                  <span className="pt-mstat-val">{questions.length}</span>
                  <span className="pt-mstat-label">Total Questions</span>
                </div>
                <div className="pt-modal-stat-card pt-mstat--green">
                  <span className="pt-mstat-val">{paletteStats.answered + paletteStats.answeredMarked}</span>
                  <span className="pt-mstat-label">Answered</span>
                </div>
                <div className="pt-modal-stat-card pt-mstat--red">
                  <span className="pt-mstat-val">{paletteStats.notAnswered}</span>
                  <span className="pt-mstat-label">Unanswered</span>
                </div>
                <div className="pt-modal-stat-card pt-mstat--purple">
                  <span className="pt-mstat-val">{paletteStats.marked + paletteStats.answeredMarked}</span>
                  <span className="pt-mstat-label">Marked for Review</span>
                </div>
              </div>

              <div className="pt-modal-actions">
                <button
                  type="button"
                  className="pt-modal-cancel-btn"
                  onClick={() => setShowSubmitModal(false)}
                >
                  Resume Test
                </button>
                <button
                  type="button"
                  className="pt-modal-confirm-btn"
                  onClick={handleFinalSubmit}
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* -------------------------------------------------------------
     PHASE 3: PLATFORM PERFORMANCE REPORT & SOLUTION REVIEW
     ------------------------------------------------------------- */
  if (phase === 'results' && resultsData) {
    const isPassing = resultsData.percentage >= 60;

    return (
      <div className="pt-page">
        <div className="pt-results-container">
          {/* Score Header Card */}
          <div className="pt-results-header-card">
            <div className="pt-res-banner-left">
              <div className="pt-inst-logo-badge">
                <span>{platform.monogram || 'MM'}</span>
              </div>
              <div>
                <span className="pt-res-tag">Assessment Final Evaluation</span>
                <h1 className="pt-res-title">{platform.name} Scorecard</h1>
                <p className="pt-res-sub">
                  Completed on {new Date().toLocaleDateString(undefined, { dateStyle: 'medium' })} · Module: {selectedTopic}
                </p>
              </div>
            </div>

            <div className="pt-res-badge-wrap">
              <span className={`pt-verdict-badge ${isPassing ? 'pt-verdict-badge--pass' : 'pt-verdict-badge--fail'}`}>
                {isPassing ? 'Benchmarked / Qualified' : 'Needs Practice'}
              </span>
            </div>
          </div>

          {/* Metric Summary Grid */}
          <div className="pt-metric-grid">
            <div className="pt-metric-card">
              <span className="pt-metric-label">Total Score</span>
              <span className="pt-metric-value">
                {resultsData.totalScore} <span className="pt-metric-subval">/ {resultsData.total}</span>
              </span>
              <span className="pt-metric-hint">+1 per correct question</span>
            </div>

            <div className="pt-metric-card">
              <span className="pt-metric-label">Percentage</span>
              <span className="pt-metric-value">{resultsData.percentage}%</span>
              <span className="pt-metric-hint">Overall platform score</span>
            </div>

            <div className="pt-metric-card">
              <span className="pt-metric-label">Accuracy</span>
              <span className="pt-metric-value">{resultsData.accuracy}%</span>
              <span className="pt-metric-hint">On attempted questions</span>
            </div>

            <div className="pt-metric-card">
              <span className="pt-metric-label">Time Spent</span>
              <span className="pt-metric-value">{formatFullTime(resultsData.totalTimeSpent)}</span>
              <span className="pt-metric-hint">Avg {Math.round(resultsData.totalTimeSpent / (resultsData.total || 1))}s / question</span>
            </div>
          </div>

          {/* Question Breakdown Strip */}
          <div className="pt-breakdown-strip">
            <div className="pt-strip-item">
              <CheckCircle2 size={16} className="pt-strip-green" />
              <span><strong>{resultsData.correctCount}</strong> Correct</span>
            </div>
            <div className="pt-strip-item">
              <XCircle size={16} className="pt-strip-red" />
              <span><strong>{resultsData.wrongCount}</strong> Incorrect</span>
            </div>
            <div className="pt-strip-item">
              <AlertCircle size={16} className="pt-strip-gray" />
              <span><strong>{resultsData.unattemptedCount}</strong> Unattempted</span>
            </div>
          </div>

          {/* Solution & Detailed Review Section */}
          <div className="pt-review-section">
            <div className="pt-review-header">
              <div>
                <h2 className="pt-review-heading">Solutions & Explanations</h2>
                <p className="pt-review-subheading">
                  Review your answers and step-by-step text explanations below.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="pt-filter-tabs">
                {[
                  { id: 'all', label: `All (${resultsData.total})` },
                  { id: 'correct', label: `Correct (${resultsData.correctCount})` },
                  { id: 'wrong', label: `Wrong (${resultsData.wrongCount})` },
                  { id: 'unattempted', label: `Skipped (${resultsData.unattemptedCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`pt-filter-btn ${reviewFilter === tab.id ? 'pt-filter-btn--active' : ''}`}
                    onClick={() => setReviewFilter(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Review List */}
            <div className="pt-review-list">
              {filteredReviewList.map((item, idx) => {
                const { question, selectedOption, correctIndex, isCorrect, isAttempted, index } = item;
                const letter = String.fromCharCode(65 + correctIndex);

                return (
                  <article key={question.id || idx} className="pt-review-card">
                    <div className="pt-rev-card-head">
                      <div className="pt-rev-meta-left">
                        <span className="pt-rev-qno">Q{index || idx + 1}</span>
                        <span className="pt-rev-topic">{question.topic}</span>
                      </div>
                      <div className="pt-rev-status-pill">
                        {isCorrect ? (
                          <span className="pt-pill pt-pill--correct">
                            <Check size={13} /> Correct (+1.0)
                          </span>
                        ) : isAttempted ? (
                          <span className="pt-pill pt-pill--wrong">
                            <X size={13} /> Incorrect (0.0)
                          </span>
                        ) : (
                          <span className="pt-pill pt-pill--skipped">Unattempted</span>
                        )}
                      </div>
                    </div>

                    <FormattedQuestion text={question.question} isReview />
                    {question.questionImage && (
                      <div className="pt-q-image-container">
                        <img src={question.questionImage} alt="Question diagram" className="pt-q-image" />
                      </div>
                    )}

                    {/* Options Review Matrix */}
                    <div className="pt-rev-options-grid">
                      {question.options.map((opt, oIdx) => {
                        const optLetter = String.fromCharCode(65 + oIdx);
                        const isThisCorrect = oIdx === correctIndex;
                        const isThisUser = oIdx === selectedOption;
                        const isImg = typeof opt === 'string' && (opt.startsWith('http://') || opt.startsWith('https://') || opt.startsWith('data:image/'));

                        let optCls = 'pt-rev-opt';
                        if (isThisCorrect) optCls += ' pt-rev-opt--correct';
                        if (isThisUser && !isThisCorrect) optCls += ' pt-rev-opt--wrong';

                        return (
                          <div key={oIdx} className={optCls}>
                            <span className="pt-rev-opt-letter">{optLetter}</span>
                            {isImg ? (
                              <img src={opt} alt={`Option ${optLetter}`} className="pt-rev-opt-img" />
                            ) : (
                              <span className="pt-rev-opt-text">{opt}</span>
                            )}
                            {isThisCorrect && <span className="pt-rev-tag pt-rev-tag--correct">Correct Answer</span>}
                            {isThisUser && !isThisCorrect && <span className="pt-rev-tag pt-rev-tag--user">Your Choice</span>}
                            {isThisUser && isThisCorrect && <span className="pt-rev-tag pt-rev-tag--user-correct">Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {/* Solution Explanation & Handwritten Diagrams */}
                    {(question.explanation || question.explanationImage || (question.explanationImages && question.explanationImages.length > 0)) && (
                      <div className="pt-rev-explanation-box">
                        <div className="pt-rev-exp-head">
                          <Eye size={14} />
                          <strong>Step-by-Step Solution</strong>
                        </div>
                        {question.explanation && (
                          <FormattedExplanation text={question.explanation} />
                        )}
                        {question.explanationImages && question.explanationImages.length > 1 ? (
                          <div className="pt-rev-exp-images-grid">
                            {question.explanationImages.map((imgSrc, imgIdx) => (
                              <div key={imgIdx} className="pt-rev-exp-img-wrap">
                                <img
                                  src={imgSrc}
                                  alt={`Step ${imgIdx + 1} solution diagram`}
                                  className="pt-rev-exp-img"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        ) : question.explanationImage ? (
                          <div className="pt-rev-exp-img-wrap">
                            <img
                              src={question.explanationImage}
                              alt="Step-by-step solution diagram"
                              className="pt-rev-exp-img"
                              loading="lazy"
                            />
                          </div>
                        ) : null}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-results-footer">
            <button
              type="button"
              className="pt-retake-btn"
              onClick={handleRetakeTest}
            >
              <RotateCcw size={15} /> Retake Assessment
            </button>
            <button
              type="button"
              className="pt-exit-btn"
              onClick={() => navigate('/platforms')}
            >
              <ArrowLeft size={15} /> Back to Platforms Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Platformtest;

import { useState, useEffect, useRef, useContext } from 'react';
import { NavigationContext } from '../App';
import { getQuestionsByExactSubtopic } from '../utils/questionUtils';
import { getCompanySubtopics } from '../utils/topicMap';
import { jsPDF } from 'jspdf';
import quotesData from '../data/quotes.json';
import '../styles/Company-test.css';

var CK = 'aptiprep-company-test';

export function saveCompanyTestParams(d) {
  localStorage.setItem(CK, JSON.stringify(d));
}

export function getCompanyTestParams() {
  try {
    return JSON.parse(localStorage.getItem(CK));
  } catch (e) {
    return null;
  }
}

export function clearCompanyTestParams() {
  localStorage.removeItem(CK);
}

function fmt(s) {
  if (s < 60) return s + 's';
  var m = Math.floor(s / 60);
  var r = s % 60;
  return r > 0 ? m + 'm ' + r + 's' : m + 'm';
}

/* Exam clock: M:SS or H:MM:SS */
function fmtClock(s) {
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var sec = s % 60;
  var ss = sec < 10 ? '0' + sec : '' + sec;
  if (h > 0) {
    var mm = m < 10 ? '0' + m : '' + m;
    return h + ':' + mm + ':' + ss;
  }
  return m + ':' + ss;
}

function fmtMins(m) {
  if (m < 60) return m + 'm';
  var h = Math.floor(m / 60);
  var r = m % 60;
  return r > 0 ? h + 'h ' + r + 'm' : h + 'h';
}

function lbl(i) {
  return String.fromCharCode(65 + i);
}

function shuf(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = b[i];
    b[i] = b[j];
    b[j] = t;
  }
  return b;
}

function norm(q, i) {
  var o = q.options || [];
  if (o.length > 0 && typeof o[0] === 'object') {
    o = o.map(function (x) { return x.text || x; });
  }
  var ci = 0;
  if (q.correctOption !== undefined) {
    var oi = q.options || [];
    var f = oi.findIndex(function (x) { return (x.id || '') === q.correctOption; });
    if (f !== -1) ci = f;
  } else if (typeof q.answer === 'number') {
    ci = q.answer;
  }
  return {
    id: q.questionId || q.id || ('q-' + i),
    question: q.questionText || q.question || '',
    questionImage: q.questionImage || null,
    options: o,
    correctIndex: ci,
    explanation: q.explanationText || q.explanation || '',
    explanationImage: q.explanationImage || null,
    difficulty: q.difficulty || 'Medium'
  };
}

function shufOpts(q) {
  if (!q.options || q.options.length <= 1) return q;
  var ct = q.options[q.correctIndex];
  var s = shuf(q.options);
  var ni = s.indexOf(ct);
  return {
    id: q.id,
    question: q.question,
    questionImage: q.questionImage,
    options: s,
    correctIndex: ni,
    explanation: q.explanation,
    explanationImage: q.explanationImage,
    difficulty: q.difficulty
  };
}

function distribute(pools, total) {
  var av = pools.map(function (p) { return p.slice(); });
  var res = [];
  var idx = 0;
  var safe = 0;
  while (res.length < total && safe < total * 3) {
    var found = false;
    for (var i = 0; i < av.length && res.length < total; i++) {
      var c = (idx + i) % av.length;
      if (av[c].length > 0) {
        var r = Math.floor(Math.random() * av[c].length);
        res.push(av[c][r]);
        av[c].splice(r, 1);
        idx = (c + 1) % av.length;
        found = true;
        break;
      }
    }
    if (!found) break;
    safe++;
  }
  return res;
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

/* ── Compute final stats ──
   status: 'answered' | 'read' | 'not-visited' */
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

/* ── Result Ring (animated + badge) ── */
function ResultRing(_ref) {
  var accuracy = _ref.accuracy;
  var animated = useAnimatedValue(accuracy, 1400);
  var circ = 339.292;
  var off = circ - (animated / 100) * circ;
  var col = getScoreColor(accuracy);
  var badge = getPerformanceBadge(accuracy);

  return (
    <div className="cr-ring-wrap">
      <div className="cr-ring-glow" style={{ background: col }} />
      <svg className="cr-ring" viewBox="0 0 120 120">
        <circle className="cr-ring-bg" cx="60" cy="60" r="54" fill="none" strokeWidth="8" />
        <circle className="cr-ring-p" cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round" stroke={col} strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 60 60)" />
      </svg>
      <div className="cr-ring-text">
        <span className="cr-ring-val" style={{ color: col }}>{animated}</span>
        <span className="cr-ring-unit">%</span>
      </div>
      <div className={'performance-badge performance-badge--' + badge.tier}>
        <span className="performance-badge-icon">{badge.icon}</span>
        <span className="performance-badge-label">{badge.label}</span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PDF REPORT GENERATOR
   ══════════════════════════════════════════════════ */

/* Load an image and convert to JPEG data-url for the PDF. Fails silently. */
function loadImgForPdf(src, maxW) {
  return new Promise(function (resolve) {
    if (!src) { resolve(null); return; }
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      try {
        var scale = Math.min(1, maxW / img.naturalWidth);
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * scale));
        c.height = Math.max(1, Math.round(img.naturalHeight * scale));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve({ data: c.toDataURL('image/jpeg', 0.8), w: c.width, h: c.height });
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}

function downloadPDFReport(comp, st, answerList, totalQuestions, done) {
  if (!st || st.total === 0) { if (done) done(); return; }
  var promises = [];
  for (var i = 0; i < totalQuestions; i++) {
    var a = answerList ? answerList[i] : null;
    promises.push(loadImgForPdf(a && a.question ? a.question.questionImage : null, 440));
  }
  Promise.all(promises).then(function (imgs) {
    buildPdf(comp, st, answerList, totalQuestions, imgs, done);
  }).catch(function () {
    buildPdf(comp, st, answerList, totalQuestions, [], done);
  });
}

function buildPdf(comp, st, answerList, totalQuestions, imgs, done) {
  var doc = new jsPDF({ unit: 'pt', format: 'a4' });
  var pageW = doc.internal.pageSize.getWidth();
  var pageH = doc.internal.pageSize.getHeight();
  var M = 48;
  var CW = pageW - M * 2;
  var y = M;

  var INDIGO = [79, 70, 229];
  var GREEN = [22, 163, 74];
  var RED = [220, 38, 38];
  var AMBER = [217, 119, 6];
  var DARK = [15, 23, 42];
  var GRAY = [71, 85, 105];
  var LGRAY = [148, 163, 184];
  var BORDER = [226, 232, 240];
  var BGLIGHT = [248, 250, 252];

  function setCol(c) { doc.setTextColor(c[0], c[1], c[2]); }
  function setFill(c) { doc.setFillColor(c[0], c[1], c[2]); }
  function setStroke(c) { doc.setDrawColor(c[0], c[1], c[2]); }
  function lines(txt, size, width) {
    doc.setFontSize(size);
    return doc.splitTextToSize(String(txt || ''), width);
  }
  function ensure(need) {
    if (y + need > pageH - 56) { doc.addPage(); y = M; return true; }
    return false;
  }

  /* ── Header ── */
  setFill(INDIGO);
  doc.rect(0, 0, pageW, 6, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  setCol(DARK);
  doc.text(comp.name, M, y + 14);
  y += 30;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  setCol(GRAY);
  var sub = 'Aptitude Exam Report  ·  ' + new Date().toLocaleDateString() +
    (st.examDuration ? '  ·  ' + fmtMins(st.examDuration) + ' exam' : '');
  doc.text(sub, M, y + 8);
  y += 34;

  /* ── Summary box ── */
  var boxH = 116;
  ensure(boxH + 20);
  setFill(BGLIGHT);
  setStroke(BORDER);
  doc.roundedRect(M, y, CW, boxH, 8, 8, 'FD');

  var accCol = st.accuracy >= 75 ? GREEN : (st.accuracy >= 50 ? AMBER : RED);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  setCol(accCol);
  doc.text(st.accuracy + '%', M + 22, y + 62);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setCol(LGRAY);
  doc.text('ACCURACY', M + 22, y + 80);

  setStroke(BORDER);
  doc.line(M + 130, y + 18, M + 130, y + boxH - 18);

  var gx = M + 150;
  var gw = (CW - 150 - 10) / 3;
  var sumItems = [
    { l: 'CORRECT', v: '' + st.correct, c: GREEN },
    { l: 'WRONG', v: '' + st.wrong, c: RED },
    { l: 'SKIPPED', v: '' + st.skipped, c: AMBER },
    { l: 'AVG TIME / Q', v: fmt(st.avgTime), c: DARK },
    { l: 'TIME USED', v: fmt(st.totalTime), c: DARK },
    { l: 'QUESTIONS', v: '' + st.total, c: DARK },
  ];
  for (var si = 0; si < sumItems.length; si++) {
    var scol = si % 3;
    var srow = Math.floor(si / 3);
    var sbx = gx + scol * gw;
    var sby = y + 30 + srow * 46;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    setCol(sumItems[si].c);
    doc.text(sumItems[si].v, sbx, sby);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setCol(LGRAY);
    doc.text(sumItems[si].l, sbx, sby + 14);
  }

  y += boxH + 28;

  /* ── Review header + legend ── */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setCol(DARK);
  doc.text('Question Review', M, y + 6);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  setCol(LGRAY);
  doc.text('Correct answers in green · your selection in red when wrong · every question includes its explanation', M, y + 6);
  y += 20;

  /* ── Questions ── */
  for (var i = 0; i < totalQuestions; i++) {
    var a = answerList[i];
    if (!a || !a.question) continue;
    var q = a.question;

    var status, scolor;
    if (a.status === 'answered' && a.isCorrect) { status = 'CORRECT'; scolor = GREEN; }
    else if (a.status === 'answered') { status = 'WRONG'; scolor = RED; }
    else { status = 'SKIPPED'; scolor = AMBER; }

    /* status pill */
    ensure(70);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    var pill = 'Q' + (i + 1) + '  ·  ' + status;
    var pw = doc.getTextWidth(pill) + 16;
    setFill(scolor);
    doc.roundedRect(M, y, pw, 16, 8, 8, 'F');
    setCol([255, 255, 255]);
    doc.text(pill, M + 8, y + 11.5);
    y += 26;

    /* question text */
    if (q.question) {
      var ql = lines(q.question, 11, CW);
      for (var qln = 0; qln < ql.length; qln++) {
        ensure(16);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        setCol(DARK);
        doc.text(ql[qln], M, y + 11);
        y += 15;
      }
      y += 4;
    }

    /* question image */
    var im = imgs[i];
    if (im) {
      var dw = Math.min(im.w, CW);
      var dh = im.h * (dw / im.w);
      if (dh > 280) { dh = 280; dw = im.w * (dh / im.h); }
      ensure(dh + 12);
      doc.addImage(im.data, 'JPEG', M, y, dw, dh);
      y += dh + 10;
    }

    /* options */
    var opts = q.options || [];
    for (var oi = 0; oi < opts.length; oi++) {
      var isC = oi === q.correctIndex;
      var isS = a.status === 'answered' && a.selected === oi;
      var ol = lines(lbl(oi) + '.  ' + opts[oi], 10, CW - 8);
      for (var oln = 0; oln < ol.length; oln++) {
        ensure(15);
        doc.setFont('helvetica', (isC || isS) ? 'bold' : 'normal');
        doc.setFontSize(10);
        setCol(isC ? GREEN : (isS ? RED : GRAY));
        doc.text(ol[oln], M + 6, y + 10);
        y += 14;
      }
      if (isC || isS) {
        ensure(14);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        if (isC && isS) {
          setCol(GREEN);
          doc.text('(Correct answer - your answer)', M + 20, y + 8);
        } else if (isC) {
          setCol(GREEN);
          doc.text('(Correct answer)', M + 20, y + 8);
        } else {
          setCol(RED);
          doc.text('(Your answer)', M + 20, y + 8);
        }
        y += 14;
      }
      y += 3;
    }
    y += 4;

    /* explanation */
    if (q.explanation) {
      ensure(46);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      setCol(INDIGO);
      doc.text('EXPLANATION', M + 14, y + 9);
      y += 20;
      var el = lines(q.explanation, 9.5, CW - 26);
      for (var eln = 0; eln < el.length; eln++) {
        ensure(13);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        setCol(GRAY);
        doc.text(el[eln], M + 14, y + 10);
        setStroke(INDIGO);
        doc.setLineWidth(2);
        doc.line(M + 4, y + 1, M + 4, y + 11);
        doc.setLineWidth(1);
        y += 13;
      }
      y += 6;
    }

    /* divider */
    y += 4;
    ensure(24);
    setStroke(BORDER);
    doc.setLineWidth(0.5);
    doc.line(M, y, pageW - M, y);
    doc.setLineWidth(1);
    y += 18;
  }

  /* ── Footers ── */
  var pages = doc.internal.getNumberOfPages();
  for (var p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setCol(LGRAY);
    doc.text('AptiPrep  ·  ' + comp.name + ' Exam Report', M, pageH - 22);
    doc.text('Page ' + p + ' of ' + pages, pageW - M, pageH - 22, { align: 'right' });
  }

  doc.save(comp.name.replace(/\s+/g, '-') + '-exam-report.pdf');
  if (done) done();
}

function CompanyTest() {
  var nav = useContext(NavigationContext);
  var navigate = nav.navigate;

  /* Time tracking: seconds spent on the question we're currently viewing */
  var questionStartRef = useRef(Date.now());
  /* Total seconds accumulated per question across all visits */
  var timeSpentRef = useRef([]);
  /* Prevents double-submit (manual + auto when timer hits 0) */
  var finishedRef = useRef(false);

  var phaseState = useState('setup');
  var phase = phaseState[0];
  var setPhase = phaseState[1];

  var compState = useState(null);
  var comp = compState[0];
  var setComp = compState[1];

  var qCountState = useState(20);
  var qCount = qCountState[0];
  var setQCount = qCountState[1];

  /* Total exam time in MINUTES (one clock for the whole test) */
  var tTotalState = useState(40);
  var tTotal = tTotalState[0];
  var setTTotal = tTotalState[1];

  var questionsState = useState([]);
  var questions = questionsState[0];
  var setQuestions = questionsState[1];

  var ciState = useState(0);
  var ci = ciState[0];
  var setCi = ciState[1];

  /* Global countdown in SECONDS */
  var timeLeftState = useState(0);
  var timeLeft = timeLeftState[0];
  var setTimeLeft = timeLeftState[1];

  var examTotalState = useState(0);
  var examTotal = examTotalState[0];
  var setExamTotal = examTotalState[1];

  /* answers[i] = { question, selected, correct, isCorrect, status, timeSpent } */
  var answersState = useState([]);
  var answers = answersState[0];
  var setAnswers = answersState[1];

  var showEndConfirmState = useState(false);
  var showEndConfirm = showEndConfirmState[0];
  var setShowEndConfirm = showEndConfirmState[1];

  var imgErrState = useState({});
  var imgErr = imgErrState[0];
  var setImgErr = imgErrState[1];

  var examStatsState = useState(null);
  var examStats = examStatsState[0];
  var setExamStats = examStatsState[1];

  /* Full per-question records for the PDF report */
  var resultAnswersState = useState([]);
  var resultAnswers = resultAnswersState[0];
  var setResultAnswers = resultAnswersState[1];

  var savedQuoteState = useState(null);
  var savedQuote = savedQuoteState[0];
  var setSavedQuote = savedQuoteState[1];

  var pdfBusyState = useState(false);
  var pdfBusy = pdfBusyState[0];
  var setPdfBusy = pdfBusyState[1];

  /* ── Derived state for the current question ── */
  var currentAnswer = answers[ci] || null;
  var selIdx = currentAnswer && currentAnswer.status === 'answered' ? currentAnswer.selected : null;
  var isLastQuestion = ci === questions.length - 1;

  useEffect(function () {
    var p = getCompanyTestParams();
    if (p) setComp(p);
    else setPhase('error');
  }, []);

  /* ── GLOBAL exam timer — one clock for the entire test, auto-submits at 0 ── */
  useEffect(function () {
    if (phase !== 'quiz') return;
    if (timeLeft <= 0) {
      finishExam();
      return;
    }
    var iv = setInterval(function () {
      setTimeLeft(function (t) { return t - 1; });
    }, 1000);
    return function () { clearInterval(iv); };
  }, [phase, timeLeft]);

  /* ── Helpers ── */
  function getVisitSeconds() {
    return Math.max(0, Math.round((Date.now() - questionStartRef.current) / 1000));
  }

  /* Bank the seconds spent on the current question before leaving/submitting */
  function bankCurrentVisit() {
    timeSpentRef.current[ci] = (timeSpentRef.current[ci] || 0) + getVisitSeconds();
    questionStartRef.current = Date.now();
  }

  function recordAnswer(index, status, selected) {
    var q = questions[index];
    setAnswers(function (prev) {
      var next = prev.slice();
      next[index] = {
        question: q,
        selected: selected,
        correct: q.correctIndex,
        isCorrect: status === 'answered' && selected === q.correctIndex,
        status: status,
        timeSpent: 0, /* filled from timeSpentRef at submit time */
      };
      return next;
    });
  }

  /* Exam style: click to select, click another to change, click same to clear */
  function handleSelect(optionIndex) {
    var existing = answers[ci];
    if (existing && existing.status === 'answered' && existing.selected === optionIndex) {
      recordAnswer(ci, 'read', null); /* clear response */
    } else {
      recordAnswer(ci, 'answered', optionIndex);
    }
  }

  /* ── Navigation (banks time spent on the question we're leaving) ── */
  function navigateTo(index) {
    if (index < 0 || index >= questions.length || index === ci) return;
    bankCurrentVisit();
    setCi(index);
    setShowEndConfirm(false);
    setImgErr({});
  }

  function goToPrevious() {
    navigateTo(ci - 1);
  }

  function goToNext() {
    if (isLastQuestion) {
      setShowEndConfirm(true); /* confirm before final submit */
    } else {
      navigateTo(ci + 1);
    }
  }

  /* Mark as read (if untouched) and move next. On the last question it just marks it. */
  function handleMarkAsRead() {
    if (!currentAnswer) {
      recordAnswer(ci, 'read', null);
    }
    if (!isLastQuestion) {
      navigateTo(ci + 1);
    }
  }

  function startExam() {
    setPhase('loading');
    setTimeout(function () {
      var subs = getCompanySubtopics(comp.topics);
      var pools = [];
      for (var i = 0; i < subs.length; i++) {
        var raw = getQuestionsByExactSubtopic(subs[i].category, subs[i].topic, subs[i].subtopic);
        if (raw.length > 0) pools.push(raw.map(norm));
      }
      if (pools.length === 0) { setPhase('error'); return; }
      var picked = distribute(pools, qCount);
      if (picked.length === 0) { setPhase('error'); return; }

      var totalSecs = tTotal * 60;
      setQuestions(picked.map(shufOpts));
      setCi(0);
      setAnswers([]);
      timeSpentRef.current = [];
      questionStartRef.current = Date.now();
      finishedRef.current = false;
      setExamTotal(totalSecs);
      setTimeLeft(totalSecs);
      setShowEndConfirm(false);
      setImgErr({});
      setExamStats(null);
      setResultAnswers([]);
      setSavedQuote(null);
      setPhase('quiz');
    }, 3000);
  }

  function finishExam() {
    if (finishedRef.current) return;
    finishedRef.current = true;

    bankCurrentVisit();

    /* Build final answer records for ALL questions (visited or not) */
    var finalAnswers = [];
    for (var i = 0; i < questions.length; i++) {
      var a = answers[i];
      finalAnswers.push({
        question: questions[i],
        selected: a ? a.selected : null,
        correct: questions[i].correctIndex,
        isCorrect: !!(a && a.status === 'answered' && a.selected === questions[i].correctIndex),
        status: a ? a.status : 'not-visited',
        timeSpent: timeSpentRef.current[i] || 0,
      });
    }

    var stats = computeStats(finalAnswers, questions.length);
    stats.examDuration = examTotal;

    setExamStats(stats);
    setResultAnswers(finalAnswers);
    setSavedQuote(getRandomQuote());
    setShowEndConfirm(false);
    setPhase('results');
  }

  function handleDownloadPdf() {
    if (!examStats || pdfBusy) return;
    setPdfBusy(true);
    downloadPDFReport(comp, examStats, resultAnswers, examStats.total, function () {
      setPdfBusy(false);
    });
  }

  function onImgErr(key) {
    setImgErr(function (p) {
      var n = {};
      for (var k in p) n[k] = p[k];
      n[key] = true;
      return n;
    });
  }

  function retake() {
    setPhase('setup');
  }

  if (phase === 'error' || !comp) {
    return (
      <div className="ct-page">
        <div className="ct-center">
          <p className="ct-err">Could not load test.</p>
          <button className="ct-btn ct-btn-primary" onClick={function () { navigate('/practice'); }} type="button">Back to Companies</button>
        </div>
      </div>
    );
  }

  // --- SETUP ---
  if (phase === 'setup') {
    return (
      <div className="ct-page">
        <div className="ct-card">
          <div className="ct-card-accent" style={{ background: comp.groupColor }} />
          {comp.logo && (
            <div className="ct-logo-box">
              <img src={comp.logo} alt={comp.name} className="ct-logo-img" />
            </div>
          )}
          <h1 className="ct-card-title">{comp.name}</h1>
          <p className="ct-card-sub">{comp.groupName}</p>

          <div className="ct-field">
            <div className="ct-field-head">
              <span className="ct-field-label">Number of Questions</span>
              <span className="ct-field-val">{qCount}</span>
            </div>
            <input
              type="range"
              className="ct-slider"
              min="20"
              max="100"
              step="10"
              value={qCount}
              onChange={function (e) {
                var c = Number(e.target.value);
                setQCount(c);
                /* Auto-recommend ~2 min per question for the WHOLE exam */
                setTTotal(Math.min(Math.max(10, c * 2), 180));
              }}
            />
            <div className="ct-slider-marks"><span>20</span><span>50</span><span>100</span></div>
          </div>

          <div className="ct-field">
            <div className="ct-field-head">
              <span className="ct-field-label">Total Exam Time</span>
              <span className="ct-field-val">{fmtMins(tTotal)}</span>
            </div>
            <input
              type="range"
              className="ct-slider"
              min="10"
              max="180"
              step="5"
              value={tTotal}
              onChange={function (e) { setTTotal(Number(e.target.value)); }}
            />
            <div className="ct-slider-marks"><span>10m</span><span>90m</span><span>3h</span></div>
            <p className="ct-hint">Auto-set to ~40 min adjust as you like. One single timer runs for the entire exam.</p>
          </div>

      

          <button className="ct-btn ct-btn-primary ct-btn-full" onClick={startExam} type="button">Take Exam</button>
          <button className="ct-btn ct-btn-ghost ct-btn-full" onClick={function () { clearCompanyTestParams(); navigate('/practice'); }} type="button">Cancel</button>
        </div>
      </div>
    );
  }

  // --- LOADING ---
  if (phase === 'loading') {
    return (
      <div className="ct-page">
        <div className="ct-center">
          <div className="ct-loader" />
          <p className="ct-load-text">Preparing your exam...</p>
          <p className="ct-load-sub">Distributing questions across topics</p>
        </div>
      </div>
    );
  }

  // --- QUIZ ---
  if (phase === 'quiz') {
    var q = questions[ci];
    if (!q) return null;

    var prog = ((ci + 1) / questions.length) * 100;
    var tc = timeLeft <= 60 ? 'ct-td' : timeLeft <= 300 ? 'ct-tw' : 'ct-to';
    var twPct = examTotal > 0 ? (timeLeft / examTotal) * 100 : 0;

    var answeredCount = 0;
    for (var qi = 0; qi < answers.length; qi++) {
      if (answers[qi] && answers[qi].status === 'answered') answeredCount++;
    }

    var isAnsweredQ = !!(currentAnswer && currentAnswer.status === 'answered');
    var skipDisabled = isAnsweredQ || (isLastQuestion && !!currentAnswer);

    return (
      <div className="ct-page">
        <div className="ct-quiz">

          {/* Top Bar */}
          <div className="ct-bar">
            <span className="ct-bar-topic">{comp.name}</span>
            <div className="ct-bar-right">
              <span className="ct-q-count">{ci + 1} / {questions.length}</span>
              <div className="ct-timer-wrap" title="Total exam time remaining — auto-submits at 0:00">
                <span className={'ct-clock ' + tc}>{fmtClock(timeLeft)}</span>
                <div className="ct-timer-track">
                  <div className={'ct-timer-fill ' + tc} style={{ width: twPct + '%' }} />
                </div>
              </div>
              <button className="ct-end-btn" onClick={function () { setShowEndConfirm(true); }} type="button">Submit</button>
            </div>
          </div>

          {/* Submit Confirmation */}
          {showEndConfirm && (
            <div className="ct-end-confirm">
              <p>Submit exam? You answered <b>{answeredCount}</b> of {questions.length} questions. Unanswered questions count as skipped.</p>
              <div className="ct-end-confirm-actions">
                <button className="ct-btn ct-btn-ghost ct-btn-sm" onClick={function () { setShowEndConfirm(false); }} type="button">Cancel</button>
                <button className="ct-btn ct-btn-primary ct-btn-sm" onClick={finishExam} type="button">Submit Exam</button>
              </div>
            </div>
          )}

          {/* Progress */}
          <div className="ct-prog-track"><div className="ct-prog-fill" style={{ width: prog + '%' }} /></div>
          <p className="ct-prog-text">Q{ci + 1} of {questions.length}</p>

          {/* Question Palette — jump to any question */}
          <div className={'ct-palette' + (questions.length > 30 ? ' ct-palette--compact' : '')}>
            {questions.map(function (_, idx) {
              var pa = answers[idx];
              var cls = 'ct-palette-item';
              if (idx === ci) cls += ' ct-palette-item--current';
              else if (pa && pa.status === 'answered') cls += ' ct-palette-item--answered';
              else if (pa) cls += ' ct-palette-item--read';

              var stateLabel = 'Not answered';
              if (idx === ci) stateLabel = 'Current';
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
            <div className="ct-read-badge">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5H12C12.552 2.5 13 2.948 13 3.5V13.5L8 10.4L3 13.5V3.5C3 2.948 3.448 2.5 4 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Marked as read — you can still answer this question
            </div>
          )}

          {/* Question */}
          <div className="ct-q-card">
            {q.questionImage && !imgErr.q && <img className="ct-q-img" src={q.questionImage} alt="" onError={function () { onImgErr('q'); }} />}
            {q.question && <h2 className="ct-q-text">{q.question}</h2>}
          </div>

          {/* Options — select, change, or clear (tap same option again) */}
          <div className="ct-opts">
            {q.options.map(function (o, i) {
              var cls = 'ct-opt';
              if (i === selIdx) cls += ' ct-opt-sel';
              return (
                <button key={i} className={cls} onClick={function () { handleSelect(i); }} type="button">
                  <span className="ct-opt-letter">{lbl(i)}</span>
                  <span className="ct-opt-text">{o}</span>
                  {i === selIdx && <span className="ct-opt-sel-dot" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Navigation — Previous / Mark as Read / Next→Submit */}
          <div className="ct-nav-bar">
            <button
              className="ct-nav-btn"
              onClick={goToPrevious}
              disabled={ci === 0}
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Previous
            </button>

            <button
              className="ct-nav-btn ct-nav-btn--skip"
              onClick={handleMarkAsRead}
              disabled={skipDisabled}
              title={skipDisabled ? (isAnsweredQ ? 'Question already answered' : 'Nothing to mark') : 'Mark as read and move to the next question'}
              type="button"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M4 2.5H12C12.552 2.5 13 2.948 13 3.5V13.5L8 10.4L3 13.5V3.5C3 2.948 3.448 2.5 4 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Mark as Read
            </button>

            <button className="ct-nav-btn ct-nav-btn--primary" onClick={goToNext} type="button">
              {isLastQuestion ? 'Submit' : 'Next'}
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

  // --- RESULTS ---
  if (phase === 'results') {
    if (!examStats) return null;
    var st = examStats;
    var acc = st.accuracy;
    var correctPct = st.total > 0 ? (st.correct / st.total) * 100 : 0;
    var wrongPct = st.total > 0 ? (st.wrong / st.total) * 100 : 0;
    var skippedPct = st.total > 0 ? (st.skipped / st.total) * 100 : 0;
    var quote = savedQuote;

    return (
      <div className="ct-page ct-page--res">
        <div className="ct-results">
          <div className="cr-hero">
            <div className="cr-hero-bg" />
            <div className="cr-hero-content">
              <ResultRing accuracy={acc} />
              <div className="cr-hero-info">
                <h1 className="cr-title">Exam Complete</h1>
                <span className="cr-badge" style={{ background: comp.groupColor }}>{comp.name}</span>
                {/* Distribution bar */}
                <div className="cr-dist-bar">
                  <div className="cr-dist-fill cr-dist-fill--correct" style={{ width: correctPct + '%' }} />
                  <div className="cr-dist-fill cr-dist-fill--wrong" style={{ width: wrongPct + '%' }} />
                  <div className="cr-dist-fill cr-dist-fill--skipped" style={{ width: skippedPct + '%' }} />
                </div>
                <div className="cr-dist-legend">
                  <span className="cr-dist-item"><span className="cr-dist-dot cr-dist-dot--correct" />Correct {st.correct}</span>
                  <span className="cr-dist-item"><span className="cr-dist-dot cr-dist-dot--wrong" />Wrong {st.wrong}</span>
                  <span className="cr-dist-item"><span className="cr-dist-dot cr-dist-dot--skipped" />Skipped {st.skipped}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cr-grid">
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--success)' }}>{st.correct}</span><span className="cr-stat-l">Correct</span></div>
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--error)' }}>{st.wrong}</span><span className="cr-stat-l">Wrong</span></div>
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--warning)' }}>{st.skipped}</span><span className="cr-stat-l">Skipped</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{fmt(st.avgTime)}</span><span className="cr-stat-l">Avg Time</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{fmt(st.totalTime)}</span><span className="cr-stat-l">Time Used</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{st.total}</span><span className="cr-stat-l">Questions</span></div>
          </div>

          {/* Quote */}
          {quote && (
            <div className="cr-quote">
              <div className="cr-quote-deco">
                <svg width="40" height="32" viewBox="0 0 40 32" fill="currentColor">
                  <path d="M0 32V18.4C0 12.3 1.4 7.6 4.2 4.2 7 .8 11.2-.8 16.8.4L16 6.4C13.6 5.6 11.6 5.8 10 7.2 8.4 8.6 7.6 10.8 7.6 14V18.4H16V32H0ZM24 32V18.4C24 12.3 25.4 7.6 28.2 4.2 31 .8 35.2-.8 40.8.4L40 6.4C37.6 5.6 35.6 5.8 34 7.2 32.4 8.6 31.6 10.8 31.6 14V18.4H40V32H24Z"/>
                </svg>
              </div>
              <p className="cr-quote-text">{quote.quote}</p>
              <div className="cr-quote-author-row">
                <span className="cr-quote-author">— {quote.author}</span>
              </div>
            </div>
          )}

          <div className="cr-actions">
            <button className="ct-btn ct-btn-outline" onClick={handleDownloadPdf} disabled={pdfBusy} type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {pdfBusy ? 'Preparing PDF…' : 'Download PDF Report'}
            </button>
            <button className="ct-btn ct-btn-primary" onClick={retake} type="button">Retake Exam</button>
            <button className="ct-btn ct-btn-ghost" onClick={function () { clearCompanyTestParams(); navigate('/practice'); }} type="button">Exit</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default CompanyTest;
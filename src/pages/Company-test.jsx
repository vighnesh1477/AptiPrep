import { useState, useEffect, useRef, useContext } from 'react';
import { NavigationContext } from '../App';
import { getQuestionsByExactSubtopic } from '../utils/questionUtils';
import { getCompanySubtopics } from '../utils/topicMap';
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

function wTxt(ctx, t, x, y, mw, lh) {
  var w = t.split(' ');
  var l = '';
  var cy = y;
  for (var i = 0; i < w.length; i++) {
    var ts = l + w[i] + ' ';
    if (ctx.measureText(ts).width > mw && i > 0) {
      ctx.fillText(l.trim(), x, cy);
      l = w[i] + ' ';
      cy += lh;
    } else {
      l = ts;
    }
  }
  ctx.fillText(l.trim(), x, cy);
  return cy + lh;
}

function dlQ(q, a) {
  var W = 800, H = 520;
  var c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  var x = c.getContext('2d');
  x.fillStyle = '#0f172a';
  x.fillRect(0, 0, W, H);
  x.fillStyle = '#64748b';
  x.font = '13px system-ui';
  x.fillText(q.id, 24, 32);
  x.fillStyle = '#f1f5f9';
  x.font = 'bold 17px system-ui';
  var ly = wTxt(x, q.question, 24, 68, W - 48, 26);
  ly += 16;
  for (var i = 0; i < (q.options || []).length; i++) {
    var isC = i === q.correctIndex;
    var isS = i === a.selected;
    x.fillStyle = isC ? '#22c55e' : (isS && !isC) ? '#ef4444' : '#94a3b8';
    x.font = (isC || isS ? 'bold ' : '') + '15px system-ui';
    ly = wTxt(x, lbl(i) + '. ' + q.options[i], 44, ly, W - 88, 24);
    ly += 8;
  }
  if (a.isCorrect) {
    x.fillStyle = '#22c55e'; x.font = 'bold 14px system-ui'; x.fillText('Correct', 24, H - 24);
  } else if (a.timedOut) {
    x.fillStyle = '#f59e0b'; x.font = 'bold 14px system-ui'; x.fillText('Skipped', 24, H - 24);
  } else {
    x.fillStyle = '#ef4444'; x.font = 'bold 14px system-ui'; x.fillText('Wrong', 24, H - 24);
  }
  x.fillStyle = '#475569'; x.font = '12px system-ui'; x.fillText('Time: ' + fmt(a.timeSpent), W - 100, H - 24);
  c.toBlob(function (b) {
    var u = URL.createObjectURL(b);
    var a2 = document.createElement('a');
    a2.href = u; a2.download = q.id + '.png'; a2.click(); URL.revokeObjectURL(u);
  });
}

function dlResult(nm, cc, wc, sc, ac, av, tot, tm) {
  var W = 600, H = 300;
  var c = document.createElement('canvas');
  c.width = W; c.height = H;
  var x = c.getContext('2d');
  x.fillStyle = '#0f172a'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#6366f1'; x.fillRect(0, 0, W, 5);
  x.fillStyle = '#f1f5f9'; x.font = 'bold 20px system-ui'; x.fillText(nm, 28, 44);
  x.fillStyle = '#94a3b8'; x.font = '13px system-ui'; x.fillText('Aptitude Test Result', 28, 66);
  var st = [
    { l: 'Correct', v: '' + cc, c: '#22c55e' },
    { l: 'Wrong', v: '' + wc, c: '#ef4444' },
    { l: 'Skipped', v: '' + sc, c: '#f59e0b' },
    { l: 'Accuracy', v: ac + '%', c: '#6366f1' },
    { l: 'Avg Time', v: fmt(av), c: '#06b6d4' },
    { l: 'Total Time', v: fmt(tm), c: '#94a3b8' }
  ];
  var sw = (W - 56) / 3;
  for (var i = 0; i < st.length; i++) {
    var col = i % 3;
    var row = Math.floor(i / 3);
    var bx = 28 + col * sw;
    var by = 100 + row * 70;
    x.fillStyle = st[i].c; x.font = 'bold 24px system-ui'; x.fillText(st[i].v, bx, by + 24);
    x.fillStyle = '#64748b'; x.font = '11px system-ui'; x.fillText(st[i].l, bx, by + 44);
  }
  x.fillStyle = '#475569'; x.font = '10px system-ui'; x.fillText('AptiPrep \u00B7 ' + new Date().toLocaleDateString(), 28, H - 16);
  c.toBlob(function (b) {
    var u = URL.createObjectURL(b);
    var a = document.createElement('a');
    a.href = u; a.download = nm.replace(/\s+/g, '-') + '-result.png'; a.click(); URL.revokeObjectURL(u);
  });
}

function CompanyTest() {
  var nav = useContext(NavigationContext);
  var navigate = nav.navigate;
  var qRef = useRef(Date.now());

  var ps = useState('setup'), phase = ps[0], setPh = ps[1];
  var cs = useState(null), comp = cs[0], setComp = cs[1];
  var qcs = useState(20), qCount = qcs[0], setQC = qcs[1];
  var tps = useState(60), tPerQ = tps[0], setTP = tps[1];
  var qs = useState([]), questions = qs[0], setQs = qs[1];
  var cis = useState(0), ci = cis[0], setCi = cis[1];
  var sels = useState(null), sel = sels[0], setSel = sels[1];
  var ans = useState(false), answered = ans[0], setAns = ans[1];
  var scs = useState(0), score = scs[0], setSc = scs[1];
  var sks = useState(0), skipCnt = sks[0], setSk = sks[1];
  var tms = useState(60), timer = tms[0], setTm = tms[1];
  var ars = useState([]), ansArr = ars[0], setAr = ars[1];
  var ies = useState({}), imgErr = ies[0], setIe = ies[1];

  useEffect(function () {
    var p = getCompanyTestParams();
    if (p) setComp(p);
    else setPh('error');
  }, []);

  useEffect(function () {
    if (phase !== 'quiz' || answered) return;
    if (timer <= 0) { setAns(true); rec(null, true); return; }
    var iv = setInterval(function () { setTm(function (t) { return t - 1; }); }, 1000);
    return function () { clearInterval(iv); };
  }, [phase, timer, answered]);

  function rec(s, to) {
    var ts = Math.round((Date.now() - qRef.current) / 1000);
    var q = questions[ci];
    var ok = s === q.correctIndex;
    if (ok && !to) setSc(function (v) { return v + 1; });
    if (to) setSk(function (v) { return v + 1; });
    setAr(function (p) {
      return p.concat([{ question: q, selected: s, correct: q.correctIndex, isCorrect: ok, timedOut: to, timeSpent: ts }]);
    });
  }

  function handleSelect(i) {
    if (answered) return;
    setSel(i);
    setAns(true);
    rec(i, false);
  }

  function startExam() {
    setPh('loading');
    setTimeout(function () {
      var subs = getCompanySubtopics(comp.topics);
      var pools = [];
      for (var i = 0; i < subs.length; i++) {
        var raw = getQuestionsByExactSubtopic(subs[i].category, subs[i].topic, subs[i].subtopic);
        if (raw.length > 0) pools.push(raw.map(norm));
      }
      if (pools.length === 0) { setPh('error'); return; }
      var picked = distribute(pools, qCount);
      if (picked.length === 0) { setPh('error'); return; }
      setQs(picked.map(shufOpts));
      setCi(0); setSel(null); setAns(false); setSc(0); setSk(0); setTm(tPerQ); setAr([]); setIe({});
      setPh('quiz');
      qRef.current = Date.now();
    }, 3000);
  }

  function handleNext() {
    if (ci < questions.length - 1) {
            setCi(function (i) { return i + 1; });
      setSel(null); setAns(false); setTm(tPerQ); setIe({});
      qRef.current = Date.now();
    } else {
      setPh('results');
    }
  }

  function onImgErr(key) {
        setIe(function (p) { var n = {}; for (var k in p) n[k] = p[k]; n[key] = true; return n; });
  }

  function retake() { setQC(20); setTP(60); setPh('setup'); }

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

  if (phase === 'setup') {
    return (
      <div className="ct-page">
        <div className="ct-card">
          <div className="ct-card-accent" style={{ background: comp.groupColor }} />
          <h1 className="ct-card-title">{comp.name}</h1>
          <p className="ct-card-sub">{comp.groupName}</p>
          <div className="ct-field">
            <div className="ct-field-head">
              <span className="ct-field-label">Number of Questions</span>
              <span className="ct-field-val">{qCount}</span>
            </div>
                        <input type="range" className="ct-slider" min="20" max="100" step="10" value={qCount} onChange={function (e) { setQC(Number(e.target.value)); }} />
                       <div className="ct-slider-marks"><span>20</span><span>50</span><span>100</span></div>
          </div>
          <div className="ct-field">
            <div className="ct-field-head">
              <span className="ct-field-label">Time per Question</span>
              <span className="ct-field-val">{fmt(tPerQ)}</span>
            </div>
            <input type="range" className="ct-slider" min="30" max="600" step="30" value={tPerQ} onChange={function (e) { setTP(Number(e.target.value)); }} />
            <div className="ct-slider-marks"><span>30s</span><span>5m</span><span>10m</span></div>
          </div>
          <button className="ct-btn ct-btn-primary ct-btn-full" onClick={startExam} type="button">Take Exam</button>
          <button className="ct-btn ct-btn-ghost ct-btn-full" onClick={function () { clearCompanyTestParams(); navigate('/practice'); }} type="button">Cancel</button>
        </div>
      </div>
    );
  }

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

  if (phase === 'quiz') {
    var q = questions[ci];
    if (!q) return null;
    var cI = q.correctIndex;
    var prog = ((ci + (answered ? 1 : 0)) / questions.length) * 100;
    var tc = timer <= 5 ? 'ct-td' : timer <= 10 ? 'ct-tw' : 'ct-to';
    var tw = (timer / tPerQ) * 100;
    var la = ansArr.length > 0 ? ansArr[ansArr.length - 1] : null;

    return (
      <div className="ct-page">
        <div className="ct-quiz">
          <div className="ct-bar">
            <span className="ct-bar-topic">{comp.name}</span>
            <div className="ct-bar-right">
              <span className={'ct-timer ' + tc}>{timer}s</span>
              <div className="ct-timer-track"><div className={'ct-timer-fill ' + tc} style={{ width: tw + '%' }} /></div>
            </div>
          </div>
          <div className="ct-prog-track"><div className="ct-prog-fill" style={{ width: prog + '%' }} /></div>
          <p className="ct-prog-text">Q{ci + 1} of {questions.length}</p>
          <div className="ct-q-card">
            {q.questionImage && !imgErr.q && <img className="ct-q-img" src={q.questionImage} alt="" onError={function () { onImgErr('q'); }} />}
            {q.question && <h2 className="ct-q-text">{q.question}</h2>}
          </div>
          <div className="ct-opts">
            {q.options.map(function (o, i) {
              var cls = 'ct-opt';
              if (answered) { if (i === cI) cls += ' ct-opt-ok'; else if (i === sel && i !== cI) cls += ' ct-opt-bad'; else cls += ' ct-opt-dim'; }
              return (
                <button key={i} className={cls} onClick={function () { handleSelect(i); }} disabled={answered} type="button">
                  <span className="ct-opt-letter">{lbl(i)}</span>
                  <span className="ct-opt-text">{o}</span>
                  {answered && i === cI && <span className="ct-opt-chk">&#10003;</span>}
                  {answered && i === sel && i !== cI && <span className="ct-opt-x">&#10007;</span>}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="ct-fb">
              <div className="ct-fb-row">
                <div className="ct-fb-left">
                  {sel === null ? <p className="ct-fb-msg ct-fb-to">Time&#39;s up!</p> : sel === cI ? <p className="ct-fb-msg ct-fb-ok">Correct!</p> : <p className="ct-fb-msg ct-fb-bad">Wrong. Answer: {lbl(cI)}</p>}
                </div>
                <div className="ct-fb-btns">
                  {la && (
                    <button className="ct-btn ct-btn-sm ct-btn-outline" onClick={function () { dlQ(q, la); }} type="button" title="Download question">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  )}
                  <button className="ct-btn ct-btn-primary" onClick={handleNext} type="button">{ci === questions.length - 1 ? 'Finish' : 'Next'}</button>
                </div>
              </div>
              {q.explanation && <div className="ct-expl"><p>{q.explanation}</p></div>}
            </div>
          )}
          <div className="ct-scorebar">
            <span className="ct-sc ct-sc-ok">&#10003; {score}</span>
            <span className="ct-sc ct-sc-bad">&#10007; {ci + 1 - score - (answered && sel === null ? 1 : 0)}</span>
            <span className="ct-sc ct-sc-skip">&#9201; {skipCnt}</span>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'results') {
    var tT = ansArr.reduce(function (s, a) { return s + a.timeSpent; }, 0);
    var cC = ansArr.filter(function (a) { return a.isCorrect; }).length;
    var wC = ansArr.filter(function (a) { return !a.isCorrect && !a.timedOut; }).length;
    var sC = ansArr.filter(function (a) { return a.timedOut; }).length;
    var tot = ansArr.length;
    var acc = tot > 0 ? Math.round((cC / tot) * 100) : 0;
    var avg = tot > 0 ? Math.round(tT / tot) : 0;
    var col = acc >= 75 ? 'var(--success)' : acc >= 50 ? 'var(--warning)' : 'var(--error)';
    var circ = 339.292;
    var off = circ - (acc / 100) * circ;

    return (
      <div className="ct-page ct-page--res">
        <div className="ct-results">
          <div className="cr-hero">
            <div className="cr-hero-bg" />
            <div className="cr-hero-content">
              <div className="cr-ring-wrap">
                <svg className="cr-ring" viewBox="0 0 120 120">
                  <circle className="cr-ring-bg" cx="60" cy="60" r="54" fill="none" strokeWidth="8" />
                  <circle className="cr-ring-p" cx="60" cy="60" r="54" fill="none" strokeWidth="8" strokeLinecap="round" stroke={col} strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 60 60)" />
                </svg>
                <div className="cr-ring-text">
                  <span className="cr-ring-val" style={{ color: col }}>{acc}</span>
                  <span className="cr-ring-unit">%</span>
                </div>
              </div>
              <div className="cr-hero-info">
                <h1 className="cr-title">Exam Complete</h1>
                <span className="cr-badge" style={{ background: comp.groupColor }}>{comp.name}</span>
              </div>
            </div>
          </div>
          <div className="cr-grid">
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--success)' }}>{cC}</span><span className="cr-stat-l">Correct</span></div>
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--error)' }}>{wC}</span><span className="cr-stat-l">Wrong</span></div>
            <div className="cr-stat"><span className="cr-stat-v" style={{ color: 'var(--warning)' }}>{sC}</span><span className="cr-stat-l">Skipped</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{fmt(avg)}</span><span className="cr-stat-l">Avg Time</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{fmt(tT)}</span><span className="cr-stat-l">Total Time</span></div>
            <div className="cr-stat"><span className="cr-stat-v">{tot}</span><span className="cr-stat-l">Questions</span></div>
          </div>
          <div className="cr-actions">
            <button className="ct-btn ct-btn-outline" onClick={function () { dlResult(comp.name, cC, wC, sC, acc, avg, tot, tT); }} type="button">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Result
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
import { useState, useMemo, useContext, useRef } from 'react';
import { NavigationContext } from '../App';
import '../styles/practice.css';

const groups = [
  {
    id: 'A',
    name: 'IT Service Platforms',
    subtitle: 'Tech & MCA Recruiters',
    color: '#2563EB',
    companies: [
      { name: 'Cogitate', depts: ['CSE-Allied'] },
      { name: 'Arctic Wolf', depts: ['CSE-Allied'] },
      { name: 'MPHASIS', depts: ['All'] },
      { name: 'ITC Infotech', depts: ['All'] },
      { name: 'Dextris', depts: ['CSE-Allied', 'ECE'] },
      { name: 'TechFabric LLC', depts: ['MCA', 'CSE-Allied'] },
      { name: 'Invenger', depts: ['All'] },
      { name: 'Sasken', depts: ['All'] },
      { name: 'XTransMatrix', depts: ['All'] },
      { name: 'Kaizentrix', depts: ['All'] },
    ],
    topics: {
      'Quantitative Aptitude': [
        'Divisibility Rules', 'Remainder Theorems', 'HCF and LCM',
        'Percentages', 'Profit, Loss, and Discount', 'Averages',
        'Ratio, Proportion, and Variation', 'Time and Work',
        'Time, Speed, and Distance', 'Simple Equations',
      ],
      'Logical Reasoning': [
        'Number and Letter Series', 'Coding and Decoding', 'Odd One Out',
        'Blood Relations', 'Direction Sense Test', 'Syllogisms', 'Venn Diagrams',
      ],
      'Data Interpretation': [
        'Tables and Matrices', 'Bar Charts and Histograms',
      ],
      'Verbal Ability': [
        'Spotting Errors', 'Sentence Correction', 'Synonyms and Antonyms',
        'Contextual Fill in the Blanks', 'Reading Comprehension', 'Para Jumbles',
      ],
    },
  },
  {
    id: 'B',
    name: 'Analytics & Fintech',
    subtitle: 'High-End Analytical Firms',
    color: '#7C3AED',
    companies: [
      { name: 'Mu-Sigma', depts: ['All'] },
      { name: 'Finzly', depts: ['All'] },
      { name: 'ABSYZ', depts: ['All'] },
      { name: 'Info Edge', depts: ['All'] },
      { name: 'Accorian', depts: ['All'] },
      { name: 'YuniQ', depts: ['All'] },
      { name: 'Winman', depts: ['All'] },
    ],
    topics: {
      'Quantitative Aptitude': [
        'Averages', 'Ratio, Proportion, and Variation', 'Percentages',
        'Profit, Loss, and Discount', 'Permutations and Combinations',
        'Probability', 'Progressions', 'Logarithms', 'Geometry and Mensuration',
      ],
      'Logical Reasoning': [
        'Linear Seating Arrangement', 'Circular Seating Arrangement',
        'Matrix and Complex Puzzles', 'Venn Diagrams',
        'Mathematical Operations', 'Statement and Assumptions',
        'Statement and Conclusions', 'Data Sufficiency',
      ],
      'Data Interpretation': [
        'Tables and Matrices', 'Pie Charts', 'Line Graphs', 'Caselets',
      ],
      'Verbal Ability': [
        'Sentence Correction', 'Reading Comprehension', 'Para Jumbles', 'Theme Detection',
      ],
    },
  },
  {
    id: 'C',
    name: 'Core Engineering',
    subtitle: 'Electronics & Automotive',
    color: '#0891B2',
    companies: [
      { name: 'Toyota Industries', depts: ['MECH', 'MTR'] },
      { name: 'HL Mando Anand', depts: ['MECH', 'MTR', 'ECE'] },
      { name: 'Delphi TVS', depts: ['MECH', 'MTR', 'ECE'] },
      { name: 'CoreEL', depts: ['ECE'] },
      { name: 'KarMic', depts: ['ECE'] },
      { name: 'Veer-O-Metals', depts: ['MECH', 'MTR', 'ECE'] },
      { name: 'Virtual Simutech', depts: ['MECH', 'MTR'] },
      { name: 'Qlar Technologies', depts: ['MECH', 'MTR'] },
      { name: 'Pinnacle', depts: ['MECH', 'MTR'] },
      { name: 'Ankit Aerospace', depts: ['MTR', 'MECH', 'AERO'] },
      { name: 'WPG India Electronics', depts: ['ECE', 'MTR'] },
      { name: 'Ennovi Mobility', depts: ['ECE', 'MTR', 'MECH'] },
      { name: 'Trempplin', depts: ['CSE-Allied', 'ECE', 'MTR'] },
      { name: 'Larsen & Toubro', depts: ['All'] },
    ],
    topics: {
      'Quantitative Aptitude': [
        'Fractions and Decimals', 'Ratio, Proportion, and Variation',
        'Simple Equations', 'Time and Work', 'Pipes and Cisterns',
        'Time, Speed, and Distance', 'Problems on Trains',
        'Geometry and Mensuration', 'Heights and Distances',
      ],
      'Logical Reasoning': [
        'Analogy and Classification', 'Direction Sense Test',
        'Cubes and Dice', 'Mathematical Operations', 'Cause and Effect',
      ],
      'Data Interpretation': [
        'Tables and Matrices', 'Line Graphs',
      ],
    },
  },
  {
    id: 'D',
    name: 'Non-Tech Allied',
    subtitle: 'Content, Media & Broad Recruiters',
    color: '#16A34A',
    companies: [
      { name: 'Innodata India', depts: ['MCA', 'All'] },
      { name: 'TVS Credit', depts: ['All'] },
      { name: 'Dr. Reddy', depts: ['All'] },
      { name: 'Codeyoung', depts: ['All'] },
      { name: 'SIMS', depts: ['MECH', 'MTR'] },
    ],
    topics: {
      'Quantitative Aptitude': [
        'Percentages', 'Profit, Loss, and Discount',
        'Simple Interest', 'Compound Interest', 'Averages',
        'Partnerships', 'Clocks and Calendars',
      ],
      'Logical Reasoning': [
        'Number and Letter Series', 'Coding and Decoding', 'Blood Relations',
      ],
      'Data Interpretation': [
        'Tables and Matrices', 'Bar Charts and Histograms', 'Pie Charts',
      ],
      'Verbal Ability': [
        'Spotting Errors', 'Active and Passive Voice', 'Direct and Indirect Speech',
        'Contextual Fill in the Blanks', 'Cloze Test',
        'Idioms and Phrases', 'One-Word Substitutions', 'Reading Comprehension',
      ],
    },
  },
];

var groupTabs = [
  { id: 'all', label: 'All' },
].concat(groups.map(function (g) {
  return { id: g.id, label: g.name, color: g.color };
}));

var categoryIcons = {
  'Quantitative Aptitude': 'Q',
  'Logical Reasoning': 'L',
  'Data Interpretation': 'D',
  'Verbal Ability': 'V',
};

function Practice() {
  var nav = useContext(NavigationContext);
  var navigate = nav.navigate;
  var searchState = useState('');
  var search = searchState[0];
  var setSearch = searchState[1];
  var activeGroupState = useState('all');
  var activeGroup = activeGroupState[0];
  var setActiveGroup = activeGroupState[1];
  var selectedCompanyState = useState(null);
  var selectedCompany = selectedCompanyState[0];
  var setSelectedCompany = selectedCompanyState[1];
  var modalClosingState = useState(false);
  var modalClosing = modalClosingState[0];
  var setModalClosing = modalClosingState[1];
  var closeTimerRef = useRef(null);

  var allCompanies = useMemo(function () {
    return groups.flatMap(function (group) {
      return group.companies.map(function (company) {
        return {
          name: company.name,
          depts: company.depts,
          groupId: group.id,
          groupName: group.name,
          groupSubtitle: group.subtitle,
          groupColor: group.color,
          topics: group.topics,
        };
      });
    });
  }, []);

  var filteredCompanies = useMemo(function () {
    var list = allCompanies;
    if (activeGroup !== 'all') {
      list = list.filter(function (c) { return c.groupId === activeGroup; });
    }
    if (search.trim()) {
      var q = search.toLowerCase();
      list = list.filter(function (c) {
        return c.name.toLowerCase().indexOf(q) !== -1 ||
          c.depts.some(function (d) { return d.toLowerCase().indexOf(q) !== -1; });
      });
    }
    return list;
  }, [allCompanies, activeGroup, search]);

  function handleOpenCompany(company) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setModalClosing(false);
    setSelectedCompany(company);
  }

  function handleCloseModal() {
    setModalClosing(true);
    closeTimerRef.current = setTimeout(function () {
      setSelectedCompany(null);
      setModalClosing(false);
    }, 280);
  }

  function handleTakeTest() {
    if (!selectedCompany) return;
    localStorage.setItem('aptiprep-company-test', JSON.stringify({
      name: selectedCompany.name,
      groupName: selectedCompany.groupName,
      groupSubtitle: selectedCompany.groupSubtitle,
      groupColor: selectedCompany.groupColor,
      topics: selectedCompany.topics,
    }));
    navigate('/company-test');
  }

  var totalCompanies = allCompanies.length;
  var mc = selectedCompany;
  var modalTopics = mc ? Object.entries(mc.topics) : [];
  var modalTotal = modalTopics.reduce(function (s, e) { return s + e[1].length; }, 0);

  return (
    <div className="practice-page">
      <div className="practice-container">

        <div className="practice-header">
          <h1 className="practice-title">Companies</h1>
          <p className="practice-subtitle">{totalCompanies} companies across {groups.length} sectors</p>
        </div>

        <div className="practice-search-wrap">
          <span className="practice-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input type="text" placeholder="Search companies or departments..." className="practice-search-input" value={search} onChange={function (e) { setSearch(e.target.value); }} />
          {search && (
            <button className="practice-search-clear" onClick={function () { setSearch(''); }} type="button">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>

        <div className="practice-tabs">
          {groupTabs.map(function (tab) {
            var isActive = activeGroup === tab.id;
            return (
              <button key={tab.id} className={'practice-tab' + (isActive ? ' practice-tab-active' : '')} style={isActive && tab.color ? { '--tab-color': tab.color } : {}} onClick={function () { setActiveGroup(tab.id); }} type="button">
                {tab.id !== 'all' && <span className="practice-tab-dot" style={{ background: tab.color }} />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {filteredCompanies.length > 0 ? (
          <div className="practice-grid">
            {filteredCompanies.map(function (company, index) {
              var tc = Object.values(company.topics).reduce(function (s, t) { return s + t.length; }, 0);
              return (
                <button key={company.name} className="company-card" style={{ '--card-color': company.groupColor, animationDelay: (index * 25) + 'ms' }} onClick={function () { handleOpenCompany(company); }} type="button">
                  <div className="company-card-accent" />
                  <div className="company-card-body">
                    <span className="company-card-name">{company.name}</span>
                    <span className="company-card-group">{company.groupName}</span>
                    <div className="company-card-footer">
                      <div className="company-card-depts">
                        {company.depts.slice(0, 3).map(function (d) { return <span key={d} className="dept-tag">{d}</span>; })}
                        {company.depts.length > 3 && <span className="dept-tag dept-tag-more">+{company.depts.length - 3}</span>}
                      </div>
                      <span className="company-card-count">{tc} topics</span>
                    </div>
                  </div>
                  <span className="company-card-arrow">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="practice-empty">
            <p>No companies found matching &ldquo;{search}&rdquo;</p>
            <button className="practice-empty-btn" onClick={function () { setSearch(''); }} type="button">Clear Search</button>
          </div>
        )}
      </div>

      {mc && (
        <div className={'modal-overlay' + (modalClosing ? ' modal-overlay--closing' : '')} onClick={handleCloseModal}>
          <div className={'modal' + (modalClosing ? ' modal--closing' : '')} onClick={function (e) { e.stopPropagation(); }} style={{ '--modal-color': mc.groupColor }}>

            <div className="modal-topbar">
              <div className="modal-topbar-left">
                <div className="modal-indicator" />
                <h2 className="modal-title">{mc.name}</h2>
              </div>
              <button className="modal-close" onClick={handleCloseModal} type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="modal-scroll">
              <div className="modal-meta">
                <span className="modal-group-badge">{mc.groupName}</span>
                <span className="modal-subtitle">{mc.groupSubtitle}</span>
              </div>

              <div className="modal-depts">
                {mc.depts.map(function (d) { return <span key={d} className="modal-dept-tag">{d}</span>; })}
              </div>

              <div className="modal-topics">
                <div className="modal-topics-bar">
                  <span className="modal-topics-label">Aptitude Pattern</span>
                  <span className="modal-topics-count">{modalTotal} topics</span>
                </div>
                {modalTopics.map(function (entry) {
                  var cat = entry[0];
                  var topics = entry[1];
                  var icon = categoryIcons[cat] || 'T';
                  return (
                    <div key={cat} className="modal-topic-section">
                      <div className="modal-topic-cat">
                        <span className="modal-topic-cat-icon">{icon}</span>
                        <span className="modal-topic-cat-name">{cat}</span>
                        <span className="modal-topic-cat-count">{topics.length}</span>
                      </div>
                      <div className="modal-topic-pills">
                        {topics.map(function (t) { return <span key={t} className="modal-topic-pill">{t}</span>; })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="modal-action">
              <button className="modal-btn" onClick={handleTakeTest} type="button">
                Take Test
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;
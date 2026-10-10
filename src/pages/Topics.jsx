import { useState, useMemo, useContext } from 'react';
import { NavigationContext } from '../App';
import { setQuizParams } from '../utils/storage';
import { Search, X, ChevronDown, ArrowUpRight } from 'lucide-react';
import '../styles/topics.css';

const categories = [
  {
    id: 'quantitative_aptitude',
    name: 'Quantitative Aptitude',
    icon: CalculatorIcon,
    color: '#2563EB',
    subcategories: [
      {
        id: 'number_system',
        name: 'Number System',
        topics: [
          { id: 'divisibility_rules', name: 'Divisibility Rules' },
          { id: 'remainder_theorems', name: 'Remainder Theorems' },
          { id: 'hcf_lcm', name: 'HCF and LCM' },
          { id: 'unit_digit', name: 'Unit Digit' },
          { id: 'factors_multiples', name: 'Factors and Multiples' },
          { id: 'fractions_decimals', name: 'Fractions and Decimals' },
        ],
      },
      {
        id: 'percentages',
        name: 'Percentages',
        topics: [{ id: 'percentages', name: 'Percentages' }],
      },
      {
        id: 'profit_loss_discount',
        name: 'Profit, Loss & Discount',
        topics: [{ id: 'profit_loss_discount', name: 'Profit, Loss, and Discount' }],
      },
      {
        id: 'simple_compound_interest',
        name: 'Interest',
        topics: [{ id: 'simple_compound_interest', name: 'Simple & Compound Interest' }],
      },
      {
        id: 'averages',
        name: 'Averages',
        topics: [{ id: 'averages', name: 'Averages' }],
      },
      {
        id: 'ratio_proportion_variation',
        name: 'Ratio & Proportion',
        topics: [{ id: 'ratio_proportion_variation', name: 'Ratio, Proportion, and Variation' }],
      },
      {
        id: 'partnerships',
        name: 'Partnerships',
        topics: [{ id: 'partnerships', name: 'Partnerships' }],
      },
      {
        id: 'mixtures_alligations',
        name: 'Mixtures',
        topics: [{ id: 'mixtures_alligations', name: 'Mixtures and Alligations' }],
      },
      {
        id: 'time_work',
        name: 'Time & Work',
        topics: [{ id: 'time_work', name: 'Time and Work' }],
      },
      {
        id: 'pipes_cisterns',
        name: 'Pipes & Cisterns',
        topics: [{ id: 'pipes_cisterns', name: 'Pipes and Cisterns' }],
      },
      {
        id: 'time_speed_distance',
        name: 'Time, Speed & Distance',
        topics: [{ id: 'time_speed_distance', name: 'Time, Speed, and Distance' }],
      },
      {
        id: 'problems_on_trains',
        name: 'Problems on Trains',
        topics: [{ id: 'problems_on_trains', name: 'Problems on Trains' }],
      },
      {
        id: 'boats_streams',
        name: 'Boats & Streams',
        topics: [{ id: 'boats_streams', name: 'Boats and Streams' }],
      },
      {
        id: 'races_games_skills',
        name: 'Races & Games',
        topics: [{ id: 'races_games_skills', name: 'Races and Games of Skills' }],
      },
      {
        id: 'permutations_combinations',
        name: 'Permutations & Combinations',
        topics: [{ id: 'permutations_combinations', name: 'Permutations and Combinations' }],
      },
      {
        id: 'probability',
        name: 'Probability',
        topics: [{ id: 'probability', name: 'Probability' }],
      },
      {
        id: 'set_theory_venn',
        name: 'Set Theory',
        topics: [{ id: 'set_theory_venn', name: 'Set Theory and Venn Diagrams' }],
      },
      {
        id: 'algebra',
        name: 'Algebra',
        topics: [
          { id: 'linear_quadratic_equations', name: 'Linear & Quadratic Equations' },
          { id: 'inequalities', name: 'Inequalities' },
          { id: 'progressions', name: 'Progressions (AP, GP, HP)' },
          { id: 'surds_indices', name: 'Surds and Indices' },
          { id: 'logarithms', name: 'Logarithms' },
          { id: 'functions', name: 'Functions' },
        ],
      },
      {
        id: 'geometry_mensuration',
        name: 'Geometry & Mensuration',
        topics: [
          { id: 'lines_angles', name: 'Lines and Angles' },
          { id: 'triangles', name: 'Triangles' },
          { id: 'quadrilaterals_polygons', name: 'Quadrilaterals and Polygons' },
          { id: 'circles', name: 'Circles' },
          { id: 'mensuration_2d', name: '2D Mensuration (Area & Perimeter)' },
          { id: 'mensuration_3d', name: '3D Mensuration (Volume & Surface Area)' },
          { id: 'coordinate_geometry', name: 'Coordinate Geometry' },
        ],
      },
      {
        id: 'trigonometry',
        name: 'Trigonometry',
        topics: [
          { id: 'trigonometric_ratios_identities', name: 'Trigonometric Ratios & Identities' },
          { id: 'heights_distances', name: 'Heights and Distances' },
        ],
      },
      {
        id: 'clocks_calendars',
        name: 'Clocks & Calendars',
        topics: [
          { id: 'clocks', name: 'Clocks' },
          { id: 'calendars', name: 'Calendars' },
        ],
      },
    ],
  },
  {
    id: 'logical_reasoning',
    name: 'Logical Reasoning',
    icon: PuzzleIcon,
    color: '#7C3AED',
    subcategories: [
      {
        id: 'alphanumeric_logic',
        name: 'Alphanumeric Logic',
        topics: [
          { id: 'number_letter_series', name: 'Number and Letter Series' },
          { id: 'coding_decoding', name: 'Coding and Decoding' },
          { id: 'analogy_classification', name: 'Analogy and Classification' },
          { id: 'odd_one_out', name: 'Odd One Out' },
        ],
      },
      {
        id: 'spatial_relational_logic',
        name: 'Spatial & Relational Logic',
        topics: [
          { id: 'blood_relations', name: 'Blood Relations' },
          { id: 'direction_sense', name: 'Direction Sense Test' },
          { id: 'linear_seating', name: 'Linear Seating Arrangement' },
          { id: 'circular_seating', name: 'Circular Seating Arrangement' },
          { id: 'matrix_complex_puzzles', name: 'Matrix and Complex Puzzles' },
        ],
      },
      {
        id: 'deductive_reasoning',
        name: 'Deductive Reasoning',
        topics: [
          { id: 'syllogisms', name: 'Syllogisms' },
          { id: 'venn_diagrams', name: 'Venn Diagrams' },
          { id: 'cubes_dice', name: 'Cubes and Dice' },
          { id: 'mathematical_operations_inequalities', name: 'Mathematical Operations' },
        ],
      },
      {
        id: 'critical_reasoning',
        name: 'Critical Reasoning',
        topics: [
          { id: 'statement_assumptions', name: 'Statement and Assumptions' },
          { id: 'statement_conclusions', name: 'Statement and Conclusions' },
          { id: 'course_of_action', name: 'Course of Action' },
          { id: 'cause_effect', name: 'Cause and Effect' },
          { id: 'data_sufficiency', name: 'Data Sufficiency' },
        ],
      },
    ],
  },
  {
    id: 'data_interpretation',
    name: 'Data Interpretation',
    icon: BarChartIcon,
    color: '#16A34A',
    subcategories: [
      {
        id: 'visual_data_analysis',
        name: 'Visual Data Analysis',
        topics: [
          { id: 'tables_matrices', name: 'Tables and Matrices' },
          { id: 'bar_charts_histograms', name: 'Bar Charts and Histograms' },
          { id: 'pie_charts', name: 'Pie Charts' },
          { id: 'line_graphs', name: 'Line Graphs' },
          { id: 'radar_web_charts', name: 'Radar and Web Charts' },
          { id: 'mixed_graphs', name: 'Mixed Graphs' },
          { id: 'caselets', name: 'Caselets' },
        ],
      },
    ],
  },
  {
    id: 'verbal_ability',
    name: 'Verbal Ability',
    icon: BookIcon,
    color: '#DC2626',
    subcategories: [
      {
        id: 'grammar_mechanics',
        name: 'Grammar & Mechanics',
        topics: [
          { id: 'spotting_errors', name: 'Spotting Errors' },
          { id: 'sentence_correction', name: 'Sentence Correction' },
          { id: 'active_passive', name: 'Active and Passive Voice' },
          { id: 'direct_indirect', name: 'Direct and Indirect Speech' },
        ],
      },
      {
        id: 'vocabulary_context',
        name: 'Vocabulary & Context',
        topics: [
          { id: 'synonyms_antonyms', name: 'Synonyms and Antonyms' },
          { id: 'contextual_fill_blanks', name: 'Contextual Fill in the Blanks' },
          { id: 'cloze_test', name: 'Cloze Test' },
          { id: 'idioms_phrases', name: 'Idioms and Phrases' },
          { id: 'one_word_substitutions', name: 'One-Word Substitutions' },
        ],
      },
      {
        id: 'comprehension_arrangement',
        name: 'Comprehension & Arrangement',
        topics: [
          { id: 'reading_comprehension', name: 'Reading Comprehension' },
          { id: 'para_jumbles', name: 'Para Jumbles' },
          { id: 'paragraph_completion', name: 'Paragraph Completion' },
          { id: 'theme_detection', name: 'Theme Detection' },
        ],
      },
    ],
  },
];

function getTopicCount(category) {
  return category.subcategories.reduce(
    (sum, sub) => sum + sub.topics.length,
    0
  );
}

/* ---- Category Icons (stroke style, follows CSS color) ---- */

function CalculatorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8.01" y2="10" />
      <line x1="12" y1="10" x2="12.01" y2="10" />
      <line x1="16" y1="10" x2="16.01" y2="10" />
      <line x1="8" y1="14" x2="8.01" y2="14" />
      <line x1="12" y1="14" x2="12.01" y2="14" />
      <line x1="16" y1="14" x2="16.01" y2="14" />
      <line x1="8" y1="18" x2="8.01" y2="18" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
      <line x1="16" y1="18" x2="16.01" y2="18" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.077.877.528 1.073 1.01a2.5 2.5 0 1 0 3.259-3.259c-.482-.196-.933-.558-1.01-1.073-.05-.336.062-.676.303-.917l1.525-1.525A2.402 2.402 0 0 1 12 1.998c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.237 3.237c-.464.18-.894.527-.967 1.02Z" />
    </svg>
  );
}

function BarChartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18" />
      <path d="M8 17v-3" />
      <path d="M13 17V5" />
      <path d="M18 17V9" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function Topics() {
  const { navigate } = useContext(NavigationContext);
  const [search, setSearch] = useState(() => {
    const saved = sessionStorage.getItem('aptiprep_topic_search');
    if (saved) {
      sessionStorage.removeItem('aptiprep_topic_search');
      return saved;
    }
    return '';
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [expanded, setExpanded] = useState(new Set(['quantitative_aptitude']));

  function toggleCategory(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleTopicClick(categoryId, subcategoryId, topic) {
    setQuizParams(categoryId, subcategoryId, topic.id, topic.name);
    navigate('/quiz');
  }

  const filteredCategories = useMemo(() => {
    let result = categories;

    if (activeCategoryFilter !== 'all') {
      result = result.filter((cat) => cat.id === activeCategoryFilter);
    }

    if (!search.trim()) return result;
    const q = search.toLowerCase();

    return result
      .map((cat) => {
        const filteredSubs = cat.subcategories
          .map((sub) => {
            const matchingTopics = sub.topics.filter(
              (t) => t.name.toLowerCase().includes(q) || sub.name.toLowerCase().includes(q)
            );
            return { ...sub, topics: matchingTopics };
          })
          .filter((sub) => sub.topics.length > 0);
        if (filteredSubs.length === 0) return null;
        return { ...cat, subcategories: filteredSubs };
      })
      .filter(Boolean);
  }, [search, activeCategoryFilter]);

  const effectiveExpanded = useMemo(() => {
    if (!search.trim()) return expanded;
    return new Set(filteredCategories.map((c) => c.id));
  }, [search, expanded, filteredCategories]);

  const totalTopics = categories.reduce((sum, cat) => sum + getTopicCount(cat), 0);

  return (
    <div className="topics-page">
      <div className="topics-container container">
        {/* Header */}
        <div className="topics-header">
          <h1 className="topics-title">Topics & Practice Modules</h1>
          <p className="topics-subtitle">
            Explore {categories.length} core categories and {totalTopics} specialized subtopics with
            step-by-step problem sets.
          </p>
        </div>

        {/* 21st.dev Style Search & Filter Controls */}
        <div className="topics-controls-card">
          <div className="topics-search-wrap">
            <Search size={16} className="topics-search-icon" />
            <input
              type="text"
              placeholder="Search across all aptitude topics and concepts..."
              className="topics-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search ? (
              <button
                className="topics-search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                type="button"
              >
                <X size={14} />
              </button>
            ) : (
              <kbd className="topics-kbd">ESC</kbd>
            )}
          </div>

          {/* Category Filter Pills (21st.dev style) */}
          <div className="topics-filter-pills">
            <button
              className={`topics-filter-chip ${activeCategoryFilter === 'all' ? 'topics-filter-chip-active' : ''}`}
              onClick={() => setActiveCategoryFilter('all')}
              type="button"
            >
              All Topics
            </button>
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <button
                  key={cat.id}
                  className={`topics-filter-chip ${activeCategoryFilter === cat.id ? 'topics-filter-chip-active' : ''}`}
                  onClick={() => setActiveCategoryFilter(cat.id)}
                  type="button"
                >
                  <span className="topics-chip-icon"><CatIcon /></span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Accordion / Cards List */}
        {filteredCategories.length > 0 ? (
          <div className="topics-accordion">
            {filteredCategories.map((category) => {
              const isExpanded = effectiveExpanded.has(category.id);
              const count = getTopicCount(category);
              const CategoryIcon = category.icon;

              return (
                <div
                  key={category.id}
                  className={`topics-category-card ${isExpanded ? 'topics-category-card-expanded' : ''}`}
                  style={{ '--cat-color': category.color }}
                >
                  <button
                    className="topics-category-header"
                    onClick={() => toggleCategory(category.id)}
                    type="button"
                    aria-expanded={isExpanded}
                  >
                    <div className="topics-category-left">
                      <div className="topics-category-icon-box">
                        <span className="topics-category-icon"><CategoryIcon /></span>
                      </div>
                      <div className="topics-category-info">
                        <span className="topics-category-name">{category.name}</span>
                        <span className="topics-category-count">
                          {count} topic{count !== 1 ? 's' : ''} available
                        </span>
                      </div>
                    </div>

                    <div className="topics-category-right">
                      <span className="topics-category-badge">{count} Modules</span>
                      <span className={`topics-category-chevron ${isExpanded ? 'chevron-open' : ''}`}>
                        <ChevronDown size={18} />
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="topics-category-body">
                      {category.subcategories.map((sub) => (
                        <div key={sub.id} className="topics-subcategory-block">
                          <h3 className="topics-subcategory-name">{sub.name}</h3>
                          <div className="topics-pills-grid">
                            {sub.topics.map((topic) => (
                              <button
                                key={topic.id}
                                className="topic-pill-btn"
                                onClick={() => handleTopicClick(category.id, sub.id, topic)}
                                type="button"
                                title={`Practice ${topic.name}`}
                              >
                                <span className="topic-pill-name">{topic.name}</span>
                                <ArrowUpRight size={14} className="topic-pill-arrow" />
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="topics-empty-state">
            <div className="topics-empty-icon-wrap">
              <Search size={24} />
            </div>
            <h3 className="topics-empty-title">No matching topics found</h3>
            <p className="topics-empty-desc">
              We couldn't find any topics matching &ldquo;{search}&rdquo;. Try another keyword or reset the filter.
            </p>
            <button
              className="btn-secondary-21st"
              onClick={() => {
                setSearch('');
                setActiveCategoryFilter('all');
              }}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topics;
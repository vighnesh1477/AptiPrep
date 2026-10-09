import { useState, useMemo, useContext } from 'react';
import { NavigationContext } from '../App';
import { setQuizParams } from '../utils/storage';
import '../styles/topics.css';

const categories = [
  {
    id: 'quantitative_aptitude',
    name: 'Quantitative Aptitude',
    icon: '🔢',
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
        id: 'simple_equations',
        name: 'Simple Equations',
        topics: [{ id: 'simple_equations', name: 'Simple Equations' }],
      },
      {
        id: 'logarithms',
        name: 'Logarithms',
        topics: [{ id: 'logarithms', name: 'Logarithms' }],
      },
      {
        id: 'progressions',
        name: 'Progressions',
        topics: [{ id: 'progressions', name: 'Progressions (AP, GP, HP)' }],
      },
      {
        id: 'geometry_mensuration',
        name: 'Geometry & Mensuration',
        topics: [{ id: 'geometry_mensuration', name: 'Geometry and Mensuration' }],
      },
      {
        id: 'heights_distances',
        name: 'Heights & Distances',
        topics: [{ id: 'heights_distances', name: 'Heights and Distances' }],
      },
      {
        id: 'clocks_calendars',
        name: 'Clocks & Calendars',
        topics: [{ id: 'clocks_calendars', name: 'Clocks and Calendars' }],
      },
    ],
  },
  {
    id: 'logical_reasoning',
    name: 'Logical Reasoning',
    icon: '🧠',
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
    icon: '📊',
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
    icon: '🔤',
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
  const [search, setSearch] = useState('');
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
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
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
  }, [search]);

  const effectiveExpanded = useMemo(() => {
    if (!search.trim()) return expanded;
    return new Set(filteredCategories.map((c) => c.id));
  }, [search, expanded, filteredCategories]);

  const totalTopics = categories.reduce((sum, cat) => sum + getTopicCount(cat), 0);

  return (
    <div className="topics-page">
      <div className="topics-container">
        <div className="topics-header">
          <h1 className="topics-title">All Topics</h1>
          <p className="topics-subtitle">
            {categories.length} categories · {totalTopics} topics to practice
          </p>
        </div>

        <div className="topics-search-wrap">
          <span className="topics-search-icon"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search topics..."
            className="topics-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="topics-search-clear" onClick={() => setSearch('')} aria-label="Clear search" type="button">×</button>
          )}
        </div>

        {filteredCategories.length > 0 ? (
          <div className="topics-accordion">
            {filteredCategories.map((category, catIndex) => {
              const isExpanded = effectiveExpanded.has(category.id);
              const count = getTopicCount(category);

              return (
                <div key={category.id} className="topics-category" style={{ '--cat-color': category.color, animationDelay: `${catIndex * 60}ms` }}>
                  <button className="topics-category-header" onClick={() => toggleCategory(category.id)} type="button" aria-expanded={isExpanded}>
                    <div className="topics-category-left">
                      <span className="topics-category-icon">{category.icon}</span>
                      <div className="topics-category-info">
                        <span className="topics-category-name">{category.name}</span>
                        <span className="topics-category-count">{count} topic{count !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                    <span className={`topics-category-chevron ${isExpanded ? 'chevron-open' : ''}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="topics-category-body">
                      {category.subcategories.map((sub) => (
                        <div key={sub.id} className="topics-subcategory">
                          <h3 className="topics-subcategory-name">{sub.name}</h3>
                          <div className="topics-pills">
                            {sub.topics.map((topic) => (
                              <button
                                key={topic.id}
                                className="topic-pill"
                                onClick={() => handleTopicClick(category.id, sub.id, topic)}
                                type="button"
                              >
                                {topic.name}
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
          <div className="topics-empty">
            <span className="topics-empty-icon"><SearchIcon /></span>
            <p>No topics found matching &ldquo;{search}&rdquo;</p>
            <button className="topics-empty-btn" onClick={() => setSearch('')} type="button">Clear Search</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Topics;
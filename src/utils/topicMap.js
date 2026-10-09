var topicMap = {
  'Divisibility Rules': { c: 'quantitative_aptitude', t: 'number_system', s: 'divisibility_rules' },
  'Remainder Theorems': { c: 'quantitative_aptitude', t: 'number_system', s: 'remainder_theorems' },
  'HCF and LCM': { c: 'quantitative_aptitude', t: 'number_system', s: 'hcf_lcm' },
  'Factors and Multiples': { c: 'quantitative_aptitude', t: 'number_system', s: 'factors_multiples' },
  'Fractions and Decimals': { c: 'quantitative_aptitude', t: 'number_system', s: 'fractions_decimals' },
  'Unit Digit': { c: 'quantitative_aptitude', t: 'number_system', s: 'unit_digit' },
  'Percentages': { c: 'quantitative_aptitude', t: 'percentages', s: 'percentages' },
  'Profit, Loss, and Discount': { c: 'quantitative_aptitude', t: 'profit_loss_discount', s: 'profit_loss_discount' },
  'Averages': { c: 'quantitative_aptitude', t: 'averages', s: 'averages' },
  'Ratio, Proportion, and Variation': { c: 'quantitative_aptitude', t: 'ratio_proportion_variation', s: 'ratio_proportion_variation' },
  'Time and Work': { c: 'quantitative_aptitude', t: 'time_work', s: 'time_work' },
  'Pipes and Cisterns': { c: 'quantitative_aptitude', t: 'pipes_cisterns', s: 'pipes_cisterns' },
  'Time, Speed, and Distance': { c: 'quantitative_aptitude', t: 'time_speed_distance', s: 'time_speed_distance' },
  'Problems on Trains': { c: 'quantitative_aptitude', t: 'problems_on_trains', s: 'problems_on_trains' },
  'Simple Equations': { c: 'quantitative_aptitude', t: 'simple_equations', s: 'simple_equations' },
  'Permutations and Combinations': { c: 'quantitative_aptitude', t: 'permutations_combinations', s: 'permutations_combinations' },
  'Probability': { c: 'quantitative_aptitude', t: 'probability', s: 'probability' },
  'Progressions': { c: 'quantitative_aptitude', t: 'progressions', s: 'progressions' },
  'Logarithms': { c: 'quantitative_aptitude', t: 'logarithms', s: 'logarithms' },
  'Geometry and Mensuration': { c: 'quantitative_aptitude', t: 'geometry_mensuration', s: 'geometry_mensuration' },
  'Heights and Distances': { c: 'quantitative_aptitude', t: 'heights_distances', s: 'heights_distances' },
  'Simple Interest': { c: 'quantitative_aptitude', t: 'simple_compound_interest', s: 'simple_compound_interest' },
  'Compound Interest': { c: 'quantitative_aptitude', t: 'simple_compound_interest', s: 'simple_compound_interest' },
  'Partnerships': { c: 'quantitative_aptitude', t: 'partnerships', s: 'partnerships' },
  'Clocks and Calendars': { c: 'quantitative_aptitude', t: 'clocks_calendars', s: 'clocks_calendars' },
  'Boats and Streams': { c: 'quantitative_aptitude', t: 'boats_streams', s: 'boats_streams' },
  'Mixtures and Alligations': { c: 'quantitative_aptitude', t: 'mixtures_alligations', s: 'mixtures_alligations' },
  'Races, Games and Skills': { c: 'quantitative_aptitude', t: 'races_games_skills', s: 'races_games_skills' },
  'Number and Letter Series': { c: 'logical_reasoning', t: 'alphanumeric_logic', s: 'number_letter_series' },
  'Coding and Decoding': { c: 'logical_reasoning', t: 'alphanumeric_logic', s: 'coding_decoding' },
  'Odd One Out': { c: 'logical_reasoning', t: 'alphanumeric_logic', s: 'odd_one_out' },
  'Analogy and Classification': { c: 'logical_reasoning', t: 'alphanumeric_logic', s: 'analogy_classification' },
  'Blood Relations': { c: 'logical_reasoning', t: 'spatial_relational_logic', s: 'blood_relations' },
  'Direction Sense Test': { c: 'logical_reasoning', t: 'spatial_relational_logic', s: 'direction_sense' },
  'Linear Seating Arrangement': { c: 'logical_reasoning', t: 'spatial_relational_logic', s: 'linear_seating' },
  'Circular Seating Arrangement': { c: 'logical_reasoning', t: 'spatial_relational_logic', s: 'circular_seating' },
  'Matrix and Complex Puzzles': { c: 'logical_reasoning', t: 'spatial_relational_logic', s: 'matrix_complex_puzzles' },
  'Syllogisms': { c: 'logical_reasoning', t: 'deductive_reasoning', s: 'syllogisms' },
  'Venn Diagrams': { c: 'logical_reasoning', t: 'deductive_reasoning', s: 'venn_diagrams' },
  'Cubes and Dice': { c: 'logical_reasoning', t: 'deductive_reasoning', s: 'cubes_dice' },
  'Mathematical Operations': { c: 'logical_reasoning', t: 'deductive_reasoning', s: 'mathematical_operations_inequalities' },
  'Statement and Assumptions': { c: 'logical_reasoning', t: 'critical_reasoning', s: 'statement_assumptions' },
  'Statement and Conclusions': { c: 'logical_reasoning', t: 'critical_reasoning', s: 'statement_conclusions' },
  'Cause and Effect': { c: 'logical_reasoning', t: 'critical_reasoning', s: 'cause_effect' },
  'Course of Action': { c: 'logical_reasoning', t: 'critical_reasoning', s: 'course_of_action' },
  'Data Sufficiency': { c: 'logical_reasoning', t: 'critical_reasoning', s: 'data_sufficiency' },
  'Tables and Matrices': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'tables_matrices' },
  'Bar Charts and Histograms': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'bar_charts_histograms' },
  'Pie Charts': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'pie_charts' },
  'Line Graphs': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'line_graphs' },
  'Caselets': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'caselets' },
  'Mixed Graphs': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'mixed_graphs' },
  'Radar and Web Charts': { c: 'data_interpretation', t: 'visual_data_analysis', s: 'radar_web_charts' },
  'Spotting Errors': { c: 'verbal_ability', t: 'grammar_mechanics', s: 'spotting_errors' },
  'Sentence Correction': { c: 'verbal_ability', t: 'grammar_mechanics', s: 'sentence_correction' },
  'Active and Passive Voice': { c: 'verbal_ability', t: 'grammar_mechanics', s: 'active_passive' },
  'Direct and Indirect Speech': { c: 'verbal_ability', t: 'grammar_mechanics', s: 'direct_indirect' },
  'Synonyms and Antonyms': { c: 'verbal_ability', t: 'vocabulary_context', s: 'synonyms_antonyms' },
  'Contextual Fill in the Blanks': { c: 'verbal_ability', t: 'vocabulary_context', s: 'contextual_fill_blanks' },
  'Cloze Test': { c: 'verbal_ability', t: 'vocabulary_context', s: 'cloze_test' },
  'Idioms and Phrases': { c: 'verbal_ability', t: 'vocabulary_context', s: 'idioms_phrases' },
  'One-Word Substitutions': { c: 'verbal_ability', t: 'vocabulary_context', s: 'one_word_substitutions' },
  'Reading Comprehension': { c: 'verbal_ability', t: 'comprehension_arrangements', s: 'reading_comprehension' },
  'Para Jumbles': { c: 'verbal_ability', t: 'comprehension_arrangements', s: 'para_jumbles' },
  'Theme Detection': { c: 'verbal_ability', t: 'comprehension_arrangements', s: 'theme_detection' },
  'Paragraph Completion': { c: 'verbal_ability', t: 'comprehension_arrangements', s: 'paragraph_completion' },
};

export function resolveTopic(displayName) {
  return topicMap[displayName] || null;
}

export function getCompanySubtopics(topics) {
  var result = [];
  var categories = Object.keys(topics);
  for (var ci = 0; ci < categories.length; ci++) {
    var names = topics[categories[ci]];
    for (var ni = 0; ni < names.length; ni++) {
      var m = topicMap[names[ni]];
      if (m) {
        result.push({ name: names[ni], category: m.c, topic: m.t, subtopic: m.s });
      }
    }
  }
  return result;
}
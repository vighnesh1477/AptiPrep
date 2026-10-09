/*
============================================================
AptiPrep Statistics Utilities
============================================================
*/

export function calculateAccuracy(
  correct,
  total
) {
  if (!total || total <= 0) {
    return 0;
  }

  return Number(
    ((correct / total) * 100).toFixed(2)
  );
}

export function calculateAverageTime(
  totalTime,
  questionCount
) {
  if (!questionCount || questionCount <= 0) {
    return 0;
  }

  return Number(
    (totalTime / questionCount).toFixed(2)
  );
}

export function calculateResult(
  answers
) {
  const total = answers.length;

  const correct = answers.filter(
    (answer) => answer.isCorrect
  ).length;

  const wrong = answers.filter(
    (answer) => answer.isCorrect === false
  ).length;

  const unanswered = answers.filter(
    (answer) =>
      answer.selectedOption === null ||
      answer.selectedOption === undefined
  ).length;

  return {
    total,
    correct,
    wrong,
    unanswered,
    accuracy: calculateAccuracy(
      correct,
      total
    )
  };
}

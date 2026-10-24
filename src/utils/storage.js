const KEYS = {
  QUIZ_CATEGORY: 'aptiprep_quiz_category',
  QUIZ_TOPIC: 'aptiprep_quiz_topic',
  QUIZ_SUBTOPIC: 'aptiprep_quiz_subtopic',
  QUIZ_SUBTOPIC_NAME: 'aptiprep_quiz_subtopic_name',
  PRACTICE_RESULT: 'aptiprep_practice_result',
  COMPANY_TEST: 'aptiprep-company-test',
};

export function saveCompanyTestParams(data) {
  localStorage.setItem(KEYS.COMPANY_TEST, JSON.stringify(data));
}

export function getCompanyTestParams() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.COMPANY_TEST));
  } catch {
    return null;
  }
}

export function clearCompanyTestParams() {
  localStorage.removeItem(KEYS.COMPANY_TEST);
}

export function setQuizParams(categoryId, topicId, subtopicId, subtopicName) {
  localStorage.setItem(KEYS.QUIZ_CATEGORY, categoryId);
  localStorage.setItem(KEYS.QUIZ_TOPIC, topicId);
  localStorage.setItem(KEYS.QUIZ_SUBTOPIC, subtopicId);
  localStorage.setItem(KEYS.QUIZ_SUBTOPIC_NAME, subtopicName || subtopicId);
}

export function getQuizParams() {
  const categoryId = localStorage.getItem(KEYS.QUIZ_CATEGORY);
  const topicId = localStorage.getItem(KEYS.QUIZ_TOPIC);
  const subtopicId = localStorage.getItem(KEYS.QUIZ_SUBTOPIC);
  const subtopicName = localStorage.getItem(KEYS.QUIZ_SUBTOPIC_NAME);
  if (!categoryId || !topicId || !subtopicId) return null;
  return { categoryId, topicId, subtopicId, subtopicName };
}

export function clearQuizParams() {
  localStorage.removeItem(KEYS.QUIZ_CATEGORY);
  localStorage.removeItem(KEYS.QUIZ_TOPIC);
  localStorage.removeItem(KEYS.QUIZ_SUBTOPIC);
  localStorage.removeItem(KEYS.QUIZ_SUBTOPIC_NAME);
}

export function savePracticeResult(result) {
  localStorage.setItem(KEYS.PRACTICE_RESULT, JSON.stringify(result));
}

export function getPracticeResult() {
  const result = localStorage.getItem(KEYS.PRACTICE_RESULT);
  return result ? JSON.parse(result) : null;
}

export function clearPracticeResult() {
  localStorage.removeItem(KEYS.PRACTICE_RESULT);
}
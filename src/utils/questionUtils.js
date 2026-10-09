/*
============================================================
AptiPrep Question Utilities
============================================================
*/

import {
  getQuestionsFromAllSets,
  getQuestionSet
} from './dataLoader';

export function getAllQuestions() {
  return getQuestionsFromAllSets();
}

export function getQuestionsByCategory(categoryId) {
  return getAllQuestions().filter(
    (question) => question.categoryId === categoryId
  );
}

export function getQuestionsByTopic(topicId) {
  return getAllQuestions().filter(
    (question) => question.topicId === topicId
  );
}

export function getQuestionsBySubtopic(subtopicId) {
  return getAllQuestions().filter(
    (question) => question.subtopicId === subtopicId
  );
}

export function getQuestionsByCategoryAndTopic(
  categoryId,
  topicId
) {
  return getAllQuestions().filter(
    (question) =>
      question.categoryId === categoryId &&
      question.topicId === topicId
  );
}

export function getQuestionsByExactSubtopic(
  categoryId,
  topicId,
  subtopicId
) {
  const data = getQuestionSet(
    categoryId,
    topicId,
    subtopicId
  );

  return data?.questions || [];
}

export function getRandomQuestions(
  questions,
  count
) {
  const shuffled = [...questions];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] =
      [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function getRandomQuestionsBySubtopic(
  categoryId,
  topicId,
  subtopicId,
  count
) {
  const questions = getQuestionsByExactSubtopic(
    categoryId,
    topicId,
    subtopicId
  );

  return getRandomQuestions(questions, count);
}

export function getQuestionCountBySubtopic(
  categoryId,
  topicId,
  subtopicId
) {
  return getQuestionsByExactSubtopic(
    categoryId,
    topicId,
    subtopicId
  ).length;
}

export function getQuestionById(questionId) {
  return getAllQuestions().find(
    (question) => question.questionId === questionId
  );
}

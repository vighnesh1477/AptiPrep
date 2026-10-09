import { useState } from 'react';
import OptionButton from './OptionButton';
import Explanation from './Explanation';
import SolutionViewer from './SolutionViewer';
import { getOptionLabel } from '../utils/questionUtils';

function QuestionCard({
  question,
  selectedOption,
  isAnswered,
  isCorrect,
  onOptionSelect,
}) {
  const [imageError, setImageError] = useState(false);

  const correctIndex = question.answer;
  const correctLabel = `${getOptionLabel(correctIndex)}. ${question.options[correctIndex]}`;

  return (
    <div className="question-card">
      <div className="question-meta">
        <span className="question-topic-badge">{question.topic}</span>
        <span className={`question-difficulty-badge difficulty-${question.difficulty.toLowerCase()}`}>
          {question.difficulty}
        </span>
      </div>

      <div className="question-image-wrapper">
        {!imageError ? (
          <img
            className="question-image"
            src={question.questionImage}
            alt={`Question ${question.id}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="question-image-placeholder">
            <p>Question image not available</p>
            <p className="question-image-placeholder-hint">
              Image will be displayed once uploaded
            </p>
            <p className="question-image-placeholder-id">ID: {question.id}</p>
          </div>
        )}
      </div>

      <div className="question-options">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            label={getOptionLabel(index)}
            text={option}
            selected={selectedOption === index}
            isCorrect={index === correctIndex}
            isRevealed={isAnswered}
            disabled={isAnswered}
            onClick={() => onOptionSelect(index)}
          />
        ))}
      </div>

      {isAnswered && (
        <div className="question-feedback">
          <Explanation
            text={question.explanation}
            isCorrect={isCorrect}
            correctLabel={correctLabel}
          />
          <SolutionViewer
            solutionImage={question.solutionImage}
            questionId={question.id}
          />
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
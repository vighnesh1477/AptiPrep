function Explanation({ text, isCorrect, correctLabel }) {
  return (
    <div className={`explanation ${isCorrect ? 'explanation-correct' : 'explanation-incorrect'}`}>
      <div className="explanation-header">
        <span className="explanation-status">
          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
        </span>
        {!isCorrect && correctLabel && (
          <span className="explanation-correct-answer">
            Correct answer: {correctLabel}
          </span>
        )}
      </div>
      <p className="explanation-text">{text}</p>
    </div>
  );
}

export default Explanation;
function OptionButton({ label, text, selected, isCorrect, isRevealed, disabled, onClick }) {
  let className = 'option-button';

  if (isRevealed && isCorrect) {
    className += ' option-correct';
  } else if (isRevealed && selected && !isCorrect) {
    className += ' option-incorrect';
  } else if (selected) {
    className += ' option-selected';
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span className="option-label">{label}</span>
      <span className="option-text">{text}</span>
      {isRevealed && isCorrect && (
        <span className="option-indicator option-indicator-correct">✓</span>
      )}
      {isRevealed && selected && !isCorrect && (
        <span className="option-indicator option-indicator-incorrect">✗</span>
      )}
    </button>
  );
}

export default OptionButton;
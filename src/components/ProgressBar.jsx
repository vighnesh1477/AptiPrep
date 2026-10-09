function ProgressBar({ current, total, label }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="progress-bar-wrapper">
      {label && <span className="progress-bar-label">{label}</span>}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="progress-bar-count">
        {current} / {total}
      </span>
    </div>
  );
}

export default ProgressBar;
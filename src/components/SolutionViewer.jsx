import { useState } from 'react';

function SolutionViewer({ solutionImage, questionId }) {
  const [visible, setVisible] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="solution-viewer">
      <button
        className="btn btn-outline solution-toggle-btn"
        onClick={() => setVisible(!visible)}
        type="button"
      >
        {visible ? 'Hide Solution' : 'View Solution'}
      </button>

      {visible && (
        <div className="solution-image-container">
          {!imageError ? (
            <img
              className="solution-image"
              src={solutionImage}
              alt={`Solution for question ${questionId}`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="solution-image-placeholder">
              <p>Solution image not available</p>
              <p className="solution-image-placeholder-hint">
                Image will be available once uploaded
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SolutionViewer;
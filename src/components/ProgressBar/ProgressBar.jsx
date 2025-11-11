import './ProgressBar.css';

function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">Mission Progress</span>
        <span className="progress-count">
          {current}/{total} Tasks
        </span>
      </div>
      <div className="progress-bar-wrapper">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        >
          <span className="progress-percentage">{percentage}%</span>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;

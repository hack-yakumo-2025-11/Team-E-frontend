import './ProgressBar.css';

function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);
  
  // Generate steps from 0 to total (0, 1, 2, 3)
  const steps = Array.from({ length: total + 1 }, (_, i) => i);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-header">
        <span className="progress-label">Mission Progress</span>
        <span className="progress-percentage">{percentage}%</span>
      </div>

      <div className="progress-steps">
        <div className="progress-line">
          <div 
            className="progress-line-fill" 
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        
        {steps.map((step) => (
          <div key={step} className="progress-step-wrapper">
            <div 
              className={`progress-step ${step <= current ? 'completed' : ''}`}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      <div className="progress-info">
        <span className="tasks-completed">{current} of {total} tasks completed</span>
      </div>
    </div>
  );
}

export default ProgressBar;

import './TaskCard.css';
import { ChevronRight, Star } from 'lucide-react';

function TaskCard({ task, taskNumber, isCompleted, isRecommended, onClick }) {
  const getIconForType = (type) => {
    const icons = {
      food: '🍜',
      photo: '📸',
      entertainment: '🎢',
      shopping: '🛍️',
    };
    return icons[type] || '📍';
  };

  const getColorForType = (type) => {
    const colors = {
      food: '#4caf50',
      photo: '#9c27b0',
      entertainment: '#ff9800',
      shopping: '#1E90FF',
    };
    return colors[type] || '#757575';
  };

  return (
    <div
      className={`task-card ${isCompleted ? 'completed' : ''} ${
        isRecommended ? 'recommended' : ''
      }`}
      onClick={!isCompleted ? onClick : undefined}
      style={{ cursor: isCompleted ? 'default' : 'pointer' }}
    >
      {isRecommended && !isCompleted && (
        <div className="recommended-badge">
          <Star size={14} fill="#FFB800" color="#FFB800" />
          <span>Recommended Next</span>
        </div>
      )}

      <div className="task-card-header">
        <div
          className="task-icon"
          style={{
            backgroundColor: isCompleted ? '#e0e0e0' : getColorForType(task.type),
          }}
        >
          {getIconForType(task.type)}
        </div>
        <div className="task-badge">Task {taskNumber} of 3</div>
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        <p className="task-description">{task.description}</p>

        {task.locationName && (
          <div className="task-location">
            📍 {task.walkTime} • {task.distance}
          </div>
        )}

        <div className="task-footer">
          <div className="task-reward">
            <span className="reward-icon">🎁</span>
            <span className="reward-text">+{task.reward} FUN</span>
          </div>

          <div className="task-status">
            {isCompleted ? (
              <span className="status-completed">✅ Completed</span>
            ) : (
              <>
                <span className="status-available">Available</span>
                <ChevronRight size={20} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;

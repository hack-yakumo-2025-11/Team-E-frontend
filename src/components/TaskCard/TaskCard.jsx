import './TaskCard.css';

function TaskCard({ task, taskNumber, isCompleted, isRecommended, onClick }) {
  const getTypeIcon = (type) => {
    switch(type) {
      case 'food': return '🍜';
      case 'photo': return '📸';
      case 'entertainment': return '🎢';
      case 'shopping': return '🛍️';
      default: return '📍';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'food': return '#4caf50';
      case 'photo': return '#9c27b0';
      case 'entertainment': return '#ff9800';
      case 'shopping': return '#1E90FF';
      default: return '#757575';
    }
  };

  return (
    <div 
      className={`task-card ${isCompleted ? 'completed' : ''} ${isRecommended ? 'recommended' : ''}`}
      onClick={onClick}
      style={{ cursor: isCompleted ? 'default' : 'pointer' }}
    >
      {isRecommended && !isCompleted && (
        <div className="recommended-badge">
          ⭐ 次におすすめ
        </div>
      )}
      
      {isCompleted && (
        <div className="completed-badge">
          ✅ 完了
        </div>
      )}

      <div className="task-card-content">
        <div className="task-icon" style={{ backgroundColor: getTypeColor(task.type) }}>
          {getTypeIcon(task.type)}
        </div>

        <h3 className="task-title">タスク {taskNumber}: {task.title}</h3>
        
        <div className="task-reward">+{task.reward} FUN</div>

        <p className="task-description">{task.description}</p>

        <div className="task-location">
          <span className="location-pin">📍</span>
          <span className="location-name">{task.locationName}</span>
        </div>

        <div className="task-meta">
          <span className="walk-icon">🚶</span>
          <span className="walk-time">{task.walkTime} • {task.distance} 先</span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
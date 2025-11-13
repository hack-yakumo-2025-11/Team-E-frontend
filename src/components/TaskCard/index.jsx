import styles from './styles.module.css';

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
      className={
        [
          styles.task_card, 
          isCompleted ? styles.completed : null, 
          isRecommended ? styles.recommended : null
        ]}
      onClick={onClick}
      style={{ cursor: isCompleted ? 'default' : 'pointer' }}
    >
      {isRecommended && !isCompleted && (
        <div className={styles.recommended_badge}>
          ⭐ 次におすすめ
        </div>
      )}
      
      {isCompleted && (
        <div className={styles.completed_badge}>
          ✅ 完了
        </div>
      )}

      <div className={styles.task_card_content}>
        <div 
          className={styles.task_icon} 
          style={{ backgroundColor: getTypeColor(task.type) }}
        >
          {getTypeIcon(task.type)}
        </div>

        <h3 className={styles.task_title}>タスク {taskNumber}: {task.title}</h3>
        
        <div className={styles.task_reward}>+{task.reward} FUN</div>

        <p className={styles.task_description}>{task.description}</p>

        <div className={styles.task_location}>
          <span className={styles.location_pin}>📍</span>
          <span className={styles.location_name}>{task.locationName}</span>
        </div>

        <div className={styles.task_meta}>
          <span className={styles.walk_icon}>🚶</span>
          <span className={styles.walk_time}>{task.walkTime} • {task.distance} 先</span>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
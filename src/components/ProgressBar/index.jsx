import styles from './styles.module.css';

function ProgressBar({ current, total }) {
  const percentage = Math.round((current / total) * 100);
  
  // Generate steps from 0 to total (0, 1, 2, 3)
  const steps = Array.from({ length: total + 1 }, (_, i) => i);

  return (
    <div className={styles.progress_bar_container}>
      <div className={styles.progress_bar_header}>
        <span className={styles.progress_label}>ミッション進捗</span>
        <span className={styles.progress_percentage}>{percentage}%</span>
      </div>

      <div className={styles.progress_steps}>
        <div className={styles.progress_line}>
          <div 
            className={styles.progress_line_fill} 
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
        
        {steps.map((step) => (
          <div key={step} className={styles.progress_step_wrapper}>
            <div 
              className={[
                styles.progress_step, 
                step <= current ? styles.completed : null
              ].join(' ')}
            >
              {step}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progress_info}>
        <span className={styles.tasks_completed}>{current} / {total} タスク完了</span>
      </div>
    </div>
  );
}

export default ProgressBar;

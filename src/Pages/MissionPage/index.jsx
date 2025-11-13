import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CountdownTimer from '../../components/countdownTimer/countdownTimer';
import TaskCard from '../../components/TaskCard/TaskCard';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import BottomBar from '../../components/BottomBar';
import { getMissions } from '../../services/api';

import styles from './styles.module.css';

function MissionPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const MISSION_ID = "m1";

  // ============================================
  // FETCH MISSION FROM BACKEND
  // ============================================
  const fetchMission = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📡 Fetching mission from backend...");
      const response = await getMissions();
      
      // Get the first mission (m1)
      const missionData = response.data.missions.find(m => m.id === MISSION_ID);
      
      if (missionData) {
        console.log("✅ Mission loaded from backend:", missionData);
        setMission(missionData);
      } else {
        throw new Error("Mission not found");
      }
    } catch (err) {
      console.error("❌ Error fetching mission:", err);
      setError("ミッションを読み込めませんでした");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    fetchMission();
  }, []);

  // ============================================
  // HANDLE NEW CHECK-IN (Reset mission)
  // ============================================
  useEffect(() => {
    if (locationState.state?.isNewCheckIn) {
      console.log("🎯 New check-in detected - reloading mission");
      
      // Clear navigation state
      navigate(window.location.pathname, { replace: true, state: {} });
      
      // Reload mission data from backend
      fetchMission();
    }
  }, [locationState.state?.isNewCheckIn, navigate]);

  // ============================================
  // HANDLE TASK COMPLETION from LocationPage
  // ============================================
  useEffect(() => {
    if (locationState.state?.completedTaskId) {
      console.log("✅ Task completion detected:", locationState.state.completedTaskId);
      
      // Reload mission to get updated task statuses
      fetchMission();
      
      // Clear navigation state
      navigate(window.location.pathname, { replace: true, state: {} });
    }
  }, [locationState.state?.completedTaskId, navigate]);

  // ============================================
  // HANDLE TASK CLICK
  // ============================================
  const handleTaskClick = (task) => {
    if (task.completed) {
      console.log("⚠️ Task already completed");
      return;
    }

    console.log("🎯 Navigating to task location:", task.id);
    navigate(`/location/${task.locationId}`, {
      state: { task, missionId: mission.id },
    });
  };

  // ============================================
  // HANDLE FUN PAGE REDIRECT
  // ============================================
  const handleGoToFunPage = () => {
    console.log("🎉 Navigating to FUN page");
    navigate('/fun');
  };

  // ============================================
  // CALCULATE PROGRESS
  // ============================================
  const getCompletedCount = () => {
    return mission?.tasks.filter((t) => t.completed).length || 0;
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div className={styles.mission_page}>
        <div className={styles.loading}>ミッションを読み込み中...</div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className={styles.mission_page}>
        <div className={styles.error}>{error || "ミッションが見つかりません"}</div>
      </div>
    );
  }

  const completedCount = getCompletedCount();
  const allTasksComplete = completedCount === mission.tasks.length;

  return (
    <div className={styles.mission_page}>
      <div className={styles.mission_header}>
        <h1 className={styles.mission_title}>
          <span className={styles.mission_icon}>🎯</span>
          {mission.title}
        </h1>
      </div>

      <div className={styles.mission_content}>
        <CountdownTimer expiryTime={mission.expiryTime} />

        {allTasksComplete && (
          <div className={styles.mission_complete_banner}>
            <h2>🎉 ミッション完了！</h2>
            <p>
              {mission.totalReward} FUNポイントを獲得しました！
            </p>
            <button 
              className={styles.fun_page_button} 
              onClick={handleGoToFunPage}
              aria-label="Go to FUN page"
            >
              <span className={styles.fun_icon}>🎮</span>
              <span className={styles.fun_text}>FUNを見る</span>
            </button>
          </div>
        )}

        <div className={styles.mission_info_card}>
          <p className={styles.mission_description}>{mission.description}</p>
          <div className={styles.mission_rewards}>
            <div className={styles.mission_rewawrd}>
              <span className={styles.reward_icon}>🎁</span>
              <span className={styles.reward_text}>
                合計報酬: {mission.totalReward} FUN
              </span>
            </div>
          </div>
        </div>

        <div className={styles.tips_card}>
          <h3 className={styles.tips_title}>💡 ヒント</h3>
          <ul className={styles.tips_list}>
            <li>✅ タスクは順不同で完了できます</li>
            <li>📍 すべての場所は徒歩10分圏内です</li>
            <li>🏆 アチーブメントバッジを集めよう！</li>
          </ul>
        </div>

        <div className={styles.task_list}>
          <h2 className={styles.section_title}>
            あなたのタスク ({completedCount}/{mission.tasks.length})
          </h2>
          {mission.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              taskNumber={index + 1}
              isCompleted={task.completed}
              onClick={() => handleTaskClick(task)}
            />
          ))}
        </div>

        <ProgressBar current={completedCount} total={mission.tasks.length} />
      </div>
      <BottomBar/>
    </div>
  );
}

export default MissionPage;
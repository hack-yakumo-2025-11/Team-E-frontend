// FULL MissionPage.jsx with Back Button — COPY THIS WHOLE FILE

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TaskCard from '../../components/TaskCard/TaskCard';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import BottomBar from '../../components/BottomBar';
import MissionSelector from '../../components/MissionSelector/MissionSelector';
import { getMissionById, swapMission } from '../../services/api';

import styles from './styles.module.css';

function MissionPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [currentMissionId, setCurrentMissionId] = useState(null);

  // ===============================
  // ⬅️ BACK BUTTON HANDLER
  // ===============================
  const handleBack = () => {
    
      navigate(-1);

  };

  // ===============================
  // FETCH MISSION FROM BACKEND
  // ===============================
  const fetchMission = async (missionId) => {
    try {
      setLoading(true);
      setError(null);

      console.log("📡 Fetching mission:", missionId);
      const response = await getMissionById(missionId);

      console.log("✅ Mission loaded:", response.data);
      setMission(response.data);
      setCurrentMissionId(missionId);
    } catch (error) {
      console.error("❌ Error fetching mission:", error);
      setError("ミッションを読み込めませんでした");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // INITIAL LOAD (check selected mission)
  // ===============================
  useEffect(() => {
    const selectedMissionId = locationState.state?.selectedMissionId;

    if (selectedMissionId) {
      console.log("🎯 Loading selected mission:", selectedMissionId);
      fetchMission(selectedMissionId);

      if (!locationState.state?.completedTaskId) {
        navigate(window.location.pathname, { replace: true, state: {} });
      }
    } else if (currentMissionId) {
      console.log("📍 Keeping mission:", currentMissionId);
    } else {
      setError("ミッションが選択されていません");
      setLoading(false);
    }
  }, []);

  // ===============================
  // SAVE ACTIVE MISSION AND LOCK STATE
  // ===============================
  useEffect(() => {
    if (mission) {
      localStorage.setItem("activeMissionId", mission.id);
      localStorage.setItem("missionLocked", mission.locked ? "1" : "0");
    }
  }, [mission]);

  // ===============================
  // RELOAD MISSION AFTER TASK COMPLETION
  // ===============================
  useEffect(() => {
    if (locationState.state?.completedTaskId && currentMissionId) {
      fetchMission(currentMissionId);

      navigate(window.location.pathname, { replace: true, state: {} });
    }
  }, [locationState.state?.completedTaskId]);

  // ===============================
  // TASK CLICK
  // ===============================
  const handleTaskClick = (task) => {
    if (task.completed) return;

    navigate(`/location/${task.locationId}`, {
      state: { task, missionId: mission.id },
    });
  };

  // ===============================
  // SWAP MISSION
  // ===============================
  const handleSwapClick = () => {
    if (mission.locked) {
      alert("ミッションがロックされています。変更できません。");
      return;
    }
    setShowSwapDialog(true);
  };

  const handleSwapConfirm = async (newMissionId) => {
    try {
      console.log("🔄 Swapping:", currentMissionId, "→", newMissionId);

      const response = await swapMission(currentMissionId, newMissionId);

      if (response.data.success) {
        fetchMission(newMissionId);
        setShowSwapDialog(false);
      }
    } catch (error) {
      console.error("❌ Error swapping:", error);

      if (error.response?.data?.locked) {
        alert("このミッションはロックされているため、変更できません");
      } else {
        alert("ミッション変更中にエラーが発生しました");
      }
    }
  };

  // ===============================
  // FUN PAGE NAVIGATION
  // ===============================
  const handleGoToFunPage = () => {
    navigate('/fun');
  };

  // ===============================
  // PROGRESS CALCULATION
  // ===============================
  const getCompletedCount = () =>
    mission?.tasks.filter((t) => t.completed).length || 0;

  // ===============================
  // RENDER — LOADING / ERROR
  // ===============================
  if (loading) {
    return (
      <div className={styles.mission_page}>
        <div className={styles.loading}>ミッションを読み込み中...</div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="mission-page">
        <div className="error">{error || "ミッションが見つかりません"}</div>
        <button className="back-to-home-button" onClick={() => navigate('/')}>
          ホームに戻る
        </button>
      </div>
    );
  }

  const completedCount = getCompletedCount();
  const allTasksComplete = completedCount === mission.tasks.length;

  // ===============================
  // FULL PAGE RENDER
  // ===============================
  return (
    <div className="mission-page">
      {/* ============================ */}
      {/* HEADER with BACK & TITLE     */}
      {/* ============================ */}
      <div className="mission-header">

        {/* BACK BUTTON */}
        <button
          className="mission-back-button"
          onClick={handleBack}
          aria-label="戻る"
        >
          ← 戻る
        </button>

        <div className="mission-title-section">
          <h1 className="mission-title">
            <span className="mission-icon">{mission.icon}</span>
            {mission.title}
          </h1>
          <div className="mission-duration-badge">{mission.duration}</div>
        </div>

        {/* SWAP BUTTON */}
        {!allTasksComplete && (
          <button
            className={`swap-mission-button ${mission.locked ? 'disabled' : ''}`}
            onClick={handleSwapClick}
            disabled={mission.locked}
          >
            <span className="swap-icon">🔄</span>
            <span className="swap-text">変更</span>
          </button>
        )}
      </div>

      {/* ============================ */}
      {/* CONTENT SECTION               */}
      {/* ============================ */}
      <div className="mission-content">
        {mission.locked && !allTasksComplete && (
          <div className="mission-locked-banner">
            <span className="lock-icon">🔒</span>
            <span className="lock-text">
              ミッションがロックされました！タスクを完了してください
            </span>
          </div>
        )}

        {allTasksComplete && (
          <div className={styles.mission_complete_banner}>
            <h2>🎉 ミッション完了！</h2>
            <p>{mission.totalReward} FUNポイントを獲得しました！</p>
            <button
              className="fun-page-button"
              onClick={handleGoToFunPage}
            >
              <span className={styles.fun_icon}>🎮</span>
              <span className={styles.fun_text}>FUNを見る</span>
            </button>
          </div>
        )}

        <div className="mission-info-card">
          <p className="mission-description">{mission.description}</p>
          <div className="mission-rewards">
            <div className="mission-reward">
              <span className="reward-icon">🎁</span>
              <span className="reward-text">合計報酬: {mission.totalReward} FUN</span>
            </div>
          </div>
        </div>

        <div className={styles.tips_card}>
          <h3 className={styles.tips_title}>💡 ヒント</h3>
          <ul className={styles.tips_list}>
            <li>✅ タスクは順不同で完了できます</li>
            <li>📍 すべての場所は徒歩圏内です</li>
            <li>🔒 最初のタスク完了後はミッション変更不可</li>
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

      {/* ============================ */}
      {/* SWAP MISSION SELECTOR        */}
      {/* ============================ */}
      {showSwapDialog && (
        <MissionSelector
          isOpen={showSwapDialog}
          onClose={() => setShowSwapDialog(false)}
          onSelectMission={handleSwapConfirm}
          isSwapMode={true}
        />
      )}

      <BottomBar />
    </div>
  );
}

export default MissionPage;

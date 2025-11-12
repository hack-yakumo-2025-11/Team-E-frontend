import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CountdownTimer from '../../components/countdownTimer/countdownTimer';
import TaskCard from '../../components/TaskCard/TaskCard';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import './MissionPage.css';
import BottomBar from '../../components/BottomBar';

function MissionPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);

  const MISSION_ID = "m1";

  // ============================================
  // MISSION DATA - Japanese Theme
  // ============================================
  const getDummyMission = useCallback((completed = []) => {
    return {
      id: "m1",
      title: "今日のミッション",
      description: "試合前に東京ドームシティを探索しよう！",
      totalReward: 70,
      bonusReward: 100,
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      tasks: [
        {
          id: "t1",
          order: 1,
          type: "food",
          title: "ラーメンハント",
          description: "美味しいラーメンを探しに行こう",
          locationId: "ramen-location",
          locationName: "ラーメン通り",
          distance: "200m",
          walkTime: "3分",
          reward: 10,
          completed: completed.includes("t1"),
        },
        {
          id: "t2",
          order: 2,
          type: "shopping",
          title: "お土産ショッピング",
          description: "ショッピングエリアでお土産を見つけよう",
          locationId: "shopping-location",
          locationName: "ショッピングエリア",
          distance: "150m",
          walkTime: "2分",
          reward: 25,
          completed: completed.includes("t2"),
        },
        {
          id: "t3",
          order: 3,
          type: "entertainment",
          title: "動物園訪問",
          description: "小さな動物園で癒されよう",
          locationId: "zoo-location",
          locationName: "ミニ動物園",
          distance: "300m",
          walkTime: "4分",
          reward: 35,
          completed: completed.includes("t3"),
        },
      ],
    };
  }, []);

  // ============================================
  // INITIALIZE: Handle new check-in or load existing progress
  // ============================================
  useEffect(() => {
    if (locationState.state?.isNewCheckIn) {
      console.log("🎯 新しいチェックイン: 新しいミッション開始");
      setCompletedTasks([]);
      navigate(window.location.pathname, { replace: true, state: {} });
    } else {
      const saved = localStorage.getItem("completedTasks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedTasks(parsed);
          console.log("📥 保存されたタスク:", parsed);
        } catch (error) {
          console.error("❌ タスク読み込みエラー:", error);
          setCompletedTasks([]);
        }
      }
    }
  }, [locationState.state?.isNewCheckIn, navigate]);

  // ============================================
  // HANDLE TASK COMPLETION from LocationPage
  // ============================================
  useEffect(() => {
    if (locationState.state?.completedTaskId) {
      const taskId = locationState.state.completedTaskId;

      setCompletedTasks((prevTasks) => {
        if (prevTasks.includes(taskId)) {
          console.log("⚠️ タスク完了済み");
          return prevTasks;
        }

        const newCompletedTasks = [...prevTasks, taskId];
        console.log("✅ 新しい完了タスク:", newCompletedTasks);
        
        localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
        updateAchievements(taskId);
        
        return newCompletedTasks;
      });

      navigate(window.location.pathname, { replace: true, state: {} });
    }
  }, [locationState.state?.completedTaskId, navigate]);

  // ============================================
  // UPDATE ACHIEVEMENTS when task completed
  // ============================================
  const updateAchievements = (taskId) => {
    const taskTypes = {
      't1': 'food',
      't2': 'shopping',
      't3': 'entertainment'
    };

    const achievements = JSON.parse(
      localStorage.getItem("achievements") || 
      '{"food": 0, "entertainment": 0, "shopping": 0}'
    );
    
    const type = taskTypes[taskId];
    console.log("🏆 アチーブメント更新:", type);
    
    if (type === "food") achievements.food += 1;
    if (type === "entertainment") achievements.entertainment += 1;
    if (type === "shopping") achievements.shopping += 1;

    localStorage.setItem("achievements", JSON.stringify(achievements));
    console.log("💾 保存されたアチーブメント:", achievements);
  };

  // ============================================
  // FETCH MISSION
  // ============================================
  useEffect(() => {
    const fetchMission = async () => {
      try {
        setLoading(true);
        setMission(getDummyMission(completedTasks));
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [getDummyMission, completedTasks]);

  // ============================================
  // HANDLE TASK CLICK
  // ============================================
  const handleTaskClick = (task) => {
    if (task.completed) {
      console.log("⚠️ タスク完了済み");
      return;
    }

    console.log("🎯 タスクに移動:", task.id);
    navigate(`/location/${task.locationId}`, {
      state: { task, missionId: mission.id },
    });
  };

  // ============================================
  // HANDLE FUN PAGE REDIRECT
  // ============================================
  const handleGoToFunPage = () => {
    console.log("🎉 FUNページへ移動");
    navigate('/fun');
  };

  const getCompletedCount = () => {
    return mission?.tasks.filter((t) => t.completed).length || 0;
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return (
      <div className="mission-page">
        <div className="loading">ミッションを読み込み中...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="mission-page">
        <div className="error">ミッションが見つかりません</div>
      </div>
    );
  }

  const completedCount = getCompletedCount();
  const allTasksComplete = completedCount === mission.tasks.length;

  return (
    <div className="mission-page">
      <div className="mission-header">
        <h1 className="mission-title">
          <span className="mission-icon">🎯</span>
          {mission.title}
        </h1>
      </div>

      <div className="mission-content">
        <CountdownTimer expiryTime={mission.expiryTime} />

        {allTasksComplete && (
          <div className="mission-complete-banner">
            <h2>🎉 ミッション完了！</h2>
            <p>
              {mission.totalReward} FUNポイントを獲得しました！
            </p>
            <button 
              className="fun-page-button" 
              onClick={handleGoToFunPage}
              aria-label="Go to FUN page"
            >
              <span className="fun-icon">🎮</span>
              <span className="fun-text">FUNを見る</span>
            </button>
          </div>
        )}

        <div className="mission-info-card">
          <p className="mission-description">{mission.description}</p>
          <div className="mission-rewards">
            <div className="mission-reward">
              <span className="reward-icon">🎁</span>
              <span className="reward-text">
                合計報酬: {mission.totalReward} FUN
              </span>
            </div>
          </div>
        </div>

        <div className="tips-card">
          <h3 className="tips-title">💡 ヒント</h3>
          <ul className="tips-list">
            <li>✅ タスクは順不同で完了できます</li>
            <li>📍 すべての場所は徒歩10分圏内です</li>
            <li>🏆 アチーブメントバッジを集めよう！</li>
          </ul>
        </div>

        <div className="task-list">
          <h2 className="section-title">
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
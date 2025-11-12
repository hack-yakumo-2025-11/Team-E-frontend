import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CountdownTimer from "../../components/countdownTimer/countdownTimer";
import TaskCard from "../../components/TaskCard/TaskCard";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import "./MissionPage.css";

function MissionPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);

  const MISSION_ID = "m1";

  // ============================================
  // KEY FEATURE: DATE-BASED RESET LOGIC
  // ============================================
  const checkAndResetForNewDay = useCallback((checkinDate) => {
    const lastCheckinDate = localStorage.getItem("lastCheckinDate");
    const today = new Date(checkinDate).toDateString();
    
    console.log("🔍 Checking dates...");
    console.log("Last checkin:", lastCheckinDate);
    console.log("Current checkin:", today);
    
    if (lastCheckinDate !== today) {
      console.log("🔄 NEW DAY DETECTED! Resetting mission state...");
      localStorage.setItem("lastCheckinDate", today);
      localStorage.removeItem("completedTasks");
      setCompletedTasks([]);
      return true;
    }
    
    console.log("✅ Same day - loading existing progress");
    return false;
  }, []);

  // ============================================
  // MISSION DATA (update with your locations)
  // ============================================
  const getDummyMission = useCallback((completed = []) => {
    return {
      id: "m1",
      title: "Today's Mission",
      description: "Explore 3 TDC spots before the game!",
      totalReward: 800,
      bonusReward: 100,
      expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      tasks: [
        {
          id: "t1",
          order: 1,
          type: "entertainment",
          title: "Thrilling Ride",
          description: "Experience Thunder Dolphin roller coaster",
          locationId: "dolphin-location",
          locationName: "Thunder Dolphin",
          distance: "400m",
          walkTime: "5 min",
          reward: 300,
          completed: completed.includes("t1"),
        },
        {
          id: "t2",
          order: 2,
          type: "food",
          title: "Ramen Experience",
          description: "Visit Ichiran Ramen",
          locationId: "ichiran-location",
          locationName: "Ichiran Ramen",
          distance: "200m",
          walkTime: "3 min",
          reward: 100,
          completed: completed.includes("t2"),
        },
        {
          id: "t3",
          order: 3,
          type: "sports",
          title: "Stadium Entry",
          description: "Check in at Stadium Entrance",
          locationId: "stadium-location",
          locationName: "Stadium Entrance",
          distance: "300m",
          walkTime: "4 min",
          reward: 400,
          completed: completed.includes("t3"),
        },
      ],
    };
  }, []);

  // ============================================
  // INITIALIZE: Check date and load tasks
  // ============================================
  useEffect(() => {
    // Get checkin date from navigation state or use current date
    const checkinDate = locationState.state?.checkinDate || new Date().toISOString();
    const isNewDay = checkAndResetForNewDay(checkinDate);
    
    if (!isNewDay) {
      // Load existing completed tasks
      const saved = localStorage.getItem("completedTasks");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedTasks(parsed);
          console.log("📥 Loaded existing tasks:", parsed);
        } catch (error) {
          console.error("❌ Error parsing saved tasks:", error);
          setCompletedTasks([]);
        }
      }
    }
  }, [locationState.state?.checkinDate, checkAndResetForNewDay]);

  // ============================================
  // HANDLE TASK COMPLETION from LocationPage
  // ============================================
  useEffect(() => {
    if (locationState.state?.completedTaskId) {
      const taskId = locationState.state.completedTaskId;

      setCompletedTasks((prevTasks) => {
        if (prevTasks.includes(taskId)) {
          console.log("⚠️ Task already completed");
          return prevTasks;
        }

        const newCompletedTasks = [...prevTasks, taskId];
        console.log("✅ New completed tasks:", newCompletedTasks);
        
        // Save to localStorage
        localStorage.setItem("completedTasks", JSON.stringify(newCompletedTasks));
        
        // Update achievements
        updateAchievements(taskId);
        
        return newCompletedTasks;
      });

      // Clear navigation state
      navigate(window.location.pathname, { replace: true, state: {} });
    }
  }, [locationState.state?.completedTaskId, navigate]);

  // ============================================
  // UPDATE ACHIEVEMENTS when task completed
  // ============================================
  const updateAchievements = (taskId) => {
    const taskTypes = {
      't1': 'entertainment',
      't2': 'food',
      't3': 'sports' // Maps to shopping in achievements
    };

    const achievements = JSON.parse(
      localStorage.getItem("achievements") || 
      '{"food": 0, "entertainment": 0, "shopping": 0}'
    );
    
    const type = taskTypes[taskId];
    console.log("🏆 Updating achievement:", type);
    
    if (type === "food") achievements.food += 1;
    if (type === "entertainment") achievements.entertainment += 1;
    if (type === "sports") achievements.shopping += 1;

    localStorage.setItem("achievements", JSON.stringify(achievements));
    console.log("💾 Saved achievements:", achievements);
  };

  // ============================================
  // FETCH MISSION (update with your API)
  // ============================================
  useEffect(() => {
    const fetchMission = async () => {
      try {
        setLoading(true);
        // Replace with your API call
        // const response = await getMissionById(MISSION_ID);
        // setMission(response.data);
        
        // For now, use dummy data
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
      console.log("⚠️ Task already completed");
      return;
    }

    console.log("🎯 Navigating to task:", task.id);
    navigate(`/location/${task.locationId}`, {
      state: { task, missionId: mission.id },
    });
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
        <div className="loading">Loading mission...</div>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="mission-page">
        <div className="error">No mission available</div>
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
            <h2>🎉 Mission Complete!</h2>
            <p>
              You've earned {mission.totalReward} FUN points!
            </p>
          </div>
        )}

        <div className="mission-info-card">
          <p className="mission-description">{mission.description}</p>
          <div className="mission-rewards">
            <div className="mission-reward">
              <span className="reward-icon">🎁</span>
              <span className="reward-text">
                Total Reward: {mission.totalReward} FUN
              </span>
            </div>
          </div>
        </div>

        <div className="tips-card">
          <h3 className="tips-title">💡 Tips</h3>
          <ul className="tips-list">
            <li>✅ Complete tasks in any order</li>
            <li>📍 All locations within 10 min walk</li>
            <li>🏆 Build your achievement badges!</li>
          </ul>
        </div>

        <div className="task-list">
          <h2 className="section-title">
            Your Tasks ({completedCount}/{mission.tasks.length})
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
    </div>
  );
}

export default MissionPage;

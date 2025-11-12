import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CountdownTimer from '../../components/countdownTimer/countdownTimer';
import TaskCard from '../../components/TaskCard/TaskCard';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import { getMissionById } from '../../services/api';
import './MissionPage.css';
import BottomBar from '../../components/BottomBar';

function MissionPage() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState([]);

  const MISSION_ID = "m1";

  const getDummyMission = useCallback((completed = []) => {
    console.log("Creating dummy mission with completed tasks:", completed);

    return {
      id: "m1",
      title: "Todays Mission",
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
          description: "Experience Big-O roller coaster",
          locationId: "loc1",
          locationName: "Big O",
          distance: "400m",
          walkTime: "5 min",
          reward: 300,
          completed: completed.includes("t1"),
        },
        {
          id: "t2",
          order: 2,
          type: "food",
          title: "Sweet Treats",
          description: "Visit Half Saints BAKES",
          locationId: "loc2",
          locationName: "Half Saints BAKES",
          distance: "200m",
          walkTime: "3 min",
          reward: 100,
          completed: completed.includes("t2"),
        },
        {
          id: "t3",
          order: 3,
          type: "shopping",
          title: "Fan Gear",
          description: "Check out Giants Official Store",
          locationId: "loc3",
          locationName: "GIANTS OFFICIAL TEAM STORE",
          distance: "300m",
          walkTime: "4 min",
          reward: 400,
          completed: completed.includes("t3"),
        },
      ],
    };
  }, []);
  // Load completed tasks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("completedTasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCompletedTasks(parsed);
        console.log("Loaded completed tasks from storage:", parsed);
      } catch (error) {
        console.error("Error parsing saved tasks:", error);
        setCompletedTasks([]);
      }
    }
  }, []);

  // Handle completed task from LocationDetailPage
  useEffect(() => {
    if (locationState.state?.completedTaskId) {
      const taskId = locationState.state.completedTaskId;

      setCompletedTasks((prevTasks) => {
        console.log("Received completed task:", taskId);
        console.log("Current completed tasks:", prevTasks);

        if (prevTasks.includes(taskId)) {
          return prevTasks; // Already completed
        }

        const newCompletedTasks = [...prevTasks, taskId];
        console.log("New completed tasks list:", newCompletedTasks);

        // Save to localStorage
        localStorage.setItem(
          "completedTasks",
          JSON.stringify(newCompletedTasks)
        );
        console.log("Saved to localStorage:", newCompletedTasks);

        return newCompletedTasks;
      });

      // Clear navigation state
      navigate(window.location.pathname, { replace: true, state: {} });
    }
  }, [locationState.state?.completedTaskId, navigate]);

  // Fetch mission on mount and when completedTasks changes
  useEffect(() => {
    const fetchMission = async () => {
      try {
        setLoading(true);
        const response = await getMissionById(MISSION_ID);
        setMission(response.data);
      } catch (error) {
        console.error("Error fetching mission:", error);
        console.log("Using dummy data with completed tasks:", completedTasks);
        setMission(getDummyMission(completedTasks));
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [getDummyMission, completedTasks, MISSION_ID]);

  const handleTaskClick = (task) => {
    if (task.completed) {
      console.log("Task already completed, not navigating");
      return;
    }

    console.log("Navigating to task:", task.id);
    navigate(`/location/${task.locationId}`, {
      state: { task, missionId: mission.id },
    });
  };

  const getRecommendedTask = () => {
    return mission?.tasks.find((task) => !task.completed);
  };

  const getCompletedCount = () => {
    return mission?.tasks.filter((t) => t.completed).length || 0;
  };

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

  const recommendedTask = getRecommendedTask();
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
              You've completed all tasks and earned {mission.totalReward} FUN
              points!
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
            <div className="bonus-info">
              <span className="bonus-icon">⭐</span>
              <span className="bonus-text">
                +{mission.bonusReward} bonus for completing in order!
              </span>
            </div>
          </div>
        </div>

        <div className="tips-card">
          <h3 className="tips-title">💡 Tips</h3>
          <ul className="tips-list">
            <li>✅ Complete tasks in any order you prefer</li>
            {/* <li>⭐ Follow recommended order for bonus points</li> */}
            <li>📍 All locations are within 10 min walk</li>
          </ul>
        </div>

        <div className="task-list">
          <h2 className="section-title">
            Your Tasks ({completedCount}/{mission.tasks.length} completed)
          </h2>
          {mission.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              taskNumber={index + 1}
              isCompleted={task.completed}
              isRecommended={recommendedTask?.id === task.id}
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

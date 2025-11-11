import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CountdownTimer from '../components/countdownTimer/countdownTimer';
import ProgressBar from '../components/ProgressBar/ProgressBar';
import TaskCard from '../components/TaskCard/TaskCard';
import { getMissionById } from '../services/api';
import './MissionPage.css';

function MissionPage() {
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  const MISSION_ID = 'm1';

const fetchMission = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMissionById(MISSION_ID);
      setMission(response.data);
    } catch (error) {
      console.error('Error fetching mission:', error);
      setMission(getDummyMission());
    } finally {
      setLoading(false);
    }
  }, [MISSION_ID]); // Add MISSION_ID as dependency

  useEffect(() => {
    fetchMission();
  }, [fetchMission]); // Now include fetchMission in dependency array
  const getDummyMission = () => ({
    id: 'm1',
    title: 'Pre-Game Power Hour',
    description: 'Explore 3 TDC spots before the game!',
    totalReward: 800,
    bonusReward: 100,
    expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: 't1',
        order: 1,
        type: 'food',
        title: 'Fuel Up',
        description: 'Go to Ichiran Ramen',
        locationId: 'loc1',
        locationName: 'Ichiran Ramen',
        distance: '400m',
        walkTime: '5 min',
        reward: 300,
        completed: false,
      },
      {
        id: 't2',
        order: 2,
        type: 'photo',
        title: 'Stadium Shot',
        description: 'Take a photo at Tokyo Dome entrance',
        locationId: 'loc2',
        locationName: 'Tokyo Dome Main Entrance',
        distance: '150m',
        walkTime: '2 min',
        reward: 100,
        completed: false,
      },
      {
        id: 't3',
        order: 3,
        type: 'entertainment',
        title: 'Quick Thrill',
        description: 'Visit Thunder Dolphin attraction',
        locationId: 'loc3',
        locationName: 'Thunder Dolphin',
        distance: '600m',
        walkTime: '8 min',
        reward: 400,
        completed: false,
      },
    ],
  });

  const handleTaskClick = (task) => {
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
            <li>⭐ Follow recommended order for bonus points</li>
            <li>📍 All locations are within 10 min walk</li>
          </ul>
        </div>

        <div className="task-list">
          <h2 className="section-title">Your Tasks</h2>
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

        <ProgressBar current={getCompletedCount()} total={mission.tasks.length} />
      </div>

      {/* <BottomNav /> */}
    </div>
  );
}

export default MissionPage;

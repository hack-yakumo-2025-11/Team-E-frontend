import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getLocationById, completeTask } from "../../services/api";
import styles from './styles.module.css';

function LocationDetailPage() {
  const { locationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { task, missionId } = location.state || {};

  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);

  // ============================================
  // FETCH LOCATION FROM BACKEND
  // ============================================
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("📡 Fetching location from backend:", locationId);
        const response = await getLocationById(locationId);
        
        console.log("✅ Location loaded:", response.data);
        setLocationData(response.data);
      } catch (err) {
        console.error("❌ Error fetching location:", err);
        setError("場所情報を読み込めませんでした");
      } finally {
        setLoading(false);
      }
    };

    if (locationId) {
      fetchLocation();
    }
  }, [locationId]);

  // ============================================
  // COMPLETE TASK - KEY FUNCTION
  // ============================================
  const handleTaskCompletion = async () => {
    if (!task || !missionId) {
      console.error("❌ No task or mission data available");
      console.log("Task:", task);
      console.log("Mission ID:", missionId);
      alert("タスク情報が見つかりません。ミッションページに戻ります。");
      navigate("/mission-page");
      return;
    }

    if (completing) {
      console.log("⚠️ Task completion already in progress");
      return;
    }

    try {
      setCompleting(true);
      console.log("📡 Completing task via backend...");
      console.log("Mission ID:", missionId);
      console.log("Task ID:", task.id);

      // Call backend API to complete task
      const response = await completeTask(missionId, task.id);
      
      console.log("✅ Task completed successfully:", response.data);
      console.log("🎁 Reward earned:", response.data.reward);
      console.log("💰 New total points:", response.data.newTotalPoints);
      console.log("🔒 Mission locked:", response.data.missionLocked);

      // Navigate back to mission page with completion state
      navigate("/mission-page", {
        state: {
          selectedMissionId: missionId,
          completedTaskId: task.id,
          taskReward: response.data.reward,
          newTotalPoints: response.data.newTotalPoints,
          missionCompleted: response.data.missionCompleted,
          missionLocked: response.data.missionLocked
        },
      });
    } catch (err) {
      console.error("❌ Error completing task:", err);
      console.error("Error response:", err.response?.data);
      
      // Show error but still navigate back
      alert("タスクの完了中にエラーが発生しました");
      navigate("/mission-page", {
        state: {
          selectedMissionId: missionId
        }
      });
    } finally {
      setCompleting(false);
    }
  };

  // ============================================
  // CHECK-IN HANDLER
  // ============================================
  const handleCheckIn = async () => {
    console.log("📍 Check-in button clicked");
    console.log("Task:", task);
    console.log("Mission ID:", missionId);
    
    // Show a quick feedback animation
    const button = document.querySelector('.checkin_button_overlay');
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }

    // Complete the task and navigate back
    await handleTaskCompletion();
  };

  // ============================================
  // RENDER
  // ============================================
  if (loading) {
    return <div className={styles.loading}>場所を読み込み中...</div>;
  }

  if (error || !locationData) {
    return (
      <div className={styles.location_page_screenshot}>
        <div className={styles.loading}>{error || "場所が見つかりません"}</div>
        <button 
          className={styles.back_btn_overlay} 
          onClick={() => navigate("/mission-page")} 
          aria-label="Go back"
        />
      </div>
    );
  }

  // Check if we have task and mission data
  if (!task || !missionId) {
    console.warn("⚠️ Missing task or mission data in location state");
  }

  return (
    <div className={styles.location_page_screenshot}>
      {/* Back button overlay - transparent clickable area on grey back arrow */}
      <button 
        className={styles.back_btn_overlay} 
        onClick={() => {
          console.log("⬅️ Back button clicked, navigating to mission page");
          navigate("/mission-page", {
            state: {
              selectedMissionId: missionId
            }
          });
        }} 
        aria-label="Go back"
      />

      {/* Screenshot of existing TDC location page */}
      <div className={styles.screenshot_container}>
        <img
          src={locationData.imageUrl}
          alt={locationData.name}
          className={styles.location_screenshot}
        />
      </div>

      {/* Check-in button overlaid on screenshot - below Map button */}
      {task && missionId ? (
        <button 
          className={styles.checkin_button_overlay} 
          onClick={handleCheckIn}
          disabled={completing}
          style={{ opacity: completing ? 0.6 : 1 }}
        >
          <span className={styles.checkin_icon}>📍</span>
          <span className={styles.checkin_text}>
            {completing ? "処理中..." : "チェックイン"}
          </span>
        </button>
      ) : (
        <div className="error-banner">
          タスク情報が見つかりません
        </div>
      )}
    </div>
  );
}

export default LocationDetailPage;
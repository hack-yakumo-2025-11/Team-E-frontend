import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import "./LocationPage.css";
import { getLocationById, completeTask } from "../../services/api";

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
      navigate("/mission-page");
      return;
    }

    if (completing) {
      console.log("⚠️ Task completion already in progress");
      return;
    }

    try {
      setCompleting(true);
      console.log("📡 Completing task via backend:", task.id);

      // Call backend API to complete task
      const response = await completeTask(missionId, task.id);
      
      console.log("✅ Task completed successfully:", response.data);
      console.log("🎁 Reward earned:", response.data.reward);
      console.log("💰 New total points:", response.data.newTotalPoints);

      // Navigate back to mission page with completion state
      navigate("/mission-page", {
        state: {
          completedTaskId: task.id,
          taskReward: response.data.reward,
          newTotalPoints: response.data.newTotalPoints,
          missionCompleted: response.data.missionCompleted
        },
      });
    } catch (err) {
      console.error("❌ Error completing task:", err);
      
      // Show error but still navigate back
      alert("タスクの完了中にエラーが発生しました");
      navigate("/mission-page");
    } finally {
      setCompleting(false);
    }
  };

  // ============================================
  // CHECK-IN HANDLER
  // ============================================
  const handleCheckIn = async () => {
    console.log("📍 Check-in button clicked for task:", task?.id);
    
    // Show a quick feedback animation
    const button = document.querySelector('.checkin-button-overlay');
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
    return <div className="loading">場所を読み込み中...</div>;
  }

  if (error || !locationData) {
    return (
      <div className="location-page-screenshot">
        <div className="loading">{error || "場所が見つかりません"}</div>
        <button 
          className="back-btn-overlay" 
          onClick={() => navigate("/mission-page")} 
          aria-label="Go back"
        />
      </div>
    );
  }

  return (
    <div className="location-page-screenshot">
      {/* Back button overlay - transparent clickable area on grey back arrow */}
      <button 
        className="back-btn-overlay" 
        onClick={() => navigate("/mission-page")} 
        aria-label="Go back"
      />

      {/* Screenshot of existing TDC location page */}
      <div className="screenshot-container">
        <img
          src={locationData.imageUrl}
          alt={locationData.name}
          className="location-screenshot"
        />
      </div>

      {/* Check-in button overlaid on screenshot - below Map button */}
      {task && (
        <button 
          className="checkin-button-overlay" 
          onClick={handleCheckIn}
          disabled={completing}
          style={{ opacity: completing ? 0.6 : 1 }}
        >
          <span className="checkin-icon">📍</span>
          <span className="checkin-text">
            {completing ? "処理中..." : "チェックイン"}
          </span>
        </button>
      )}
    </div>
  );
}

export default LocationDetailPage;
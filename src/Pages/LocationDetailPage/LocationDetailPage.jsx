import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./LocationPage.css";

function LocationDetailPage() {
  const { locationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { task } = location.state || {};

  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  // ============================================
  // FETCH LOCATION (or use dummy)
  // ============================================
  useEffect(() => {
    const getDummyLocation = () => {
      const dummyLocations = {
        "dolphin-location": {
          id: "dolphin-location",
          name: "Thunder Dolphin",
          screenshotUrl: "/screenshots/big-o.png",
          specialBarcode: "TDC-DOLPHIN-001",
        },
        "ichiran-location": {
          id: "ichiran-location",
          name: "Ichiran Ramen",
          screenshotUrl: "/screenshots/giants-store.png",
          specialBarcode: "TDC-ICHIRAN-001",
        },
        "stadium-location": {
          id: "stadium-location",
          name: "Stadium Entrance",
          screenshotUrl: "/screenshots/giants-store.png",
          specialBarcode: "TDC-STADIUM-001",
        },
      };

      return dummyLocations[locationId] || dummyLocations["dolphin-location"];
    };

    const fetchLocation = async () => {
      try {
        setLoading(true);
        setLocationData(getDummyLocation());
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationData(getDummyLocation());
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  // ============================================
  // CLEANUP SCANNER
  // ============================================
  useEffect(() => {
    return () => {
      if (scanner) {
        scanner
          .clear()
          .catch((err) => console.log("Scanner cleanup error:", err));
      }
    };
  }, [scanner]);

  // ============================================
  // COMPLETE TASK - KEY FUNCTION
  // ============================================
  const handleTaskCompletion = async () => {
    if (!task) {
      console.error("❌ No task data available");
      navigate("/mission-page");
      return;
    }

    try {
      console.log("✅ Task completed:", task.id);

      // Get current completed tasks from localStorage
      const savedTasks = localStorage.getItem("completedTasks");
      const completedTasks = savedTasks ? JSON.parse(savedTasks) : [];

      // Add this task if not already completed
      if (!completedTasks.includes(task.id)) {
        const updatedTasks = [...completedTasks, task.id];
        localStorage.setItem("completedTasks", JSON.stringify(updatedTasks));
        console.log("💾 Updated completed tasks:", updatedTasks);

        // Update achievements
        updateAchievements(task.id);
      }

      // Navigate back to mission page with completion state
      navigate("/mission-page", {
        state: {
          completedTaskId: task.id,
          taskReward: task.reward,
        },
      });
    } catch (error) {
      console.error("Error completing task:", error);
      
      // Still navigate back even if something fails
      navigate("/", {
        state: {
          completedTaskId: task.id,
          taskReward: task.reward,
        },
      });
    }
  };

  // ============================================
  // UPDATE ACHIEVEMENTS
  // ============================================
  const updateAchievements = (taskId) => {
    const taskTypes = {
      't1': 'entertainment',
      't2': 'food',
      't3': 'shopping'
    };

    const achievements = JSON.parse(
      localStorage.getItem("achievements") || 
      '{"food": 0, "entertainment": 0, "shopping": 0}'
    );
    
    const type = taskTypes[taskId];
    console.log("🏆 Updating achievement:", type);
    
    if (type === "food") achievements.food += 1;
    if (type === "entertainment") achievements.entertainment += 1;
    if (type === "shopping") achievements.shopping += 1;

    localStorage.setItem("achievements", JSON.stringify(achievements));
    console.log("💾 Saved achievements:", achievements);
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
    return <div className="loading">Loading location...</div>;
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
          src={locationData.screenshotUrl}
          alt={locationData.name}
          className="location-screenshot"
        />
      </div>

      {/* Check-in button overlaid on screenshot - below Map button */}
      {task && (
        <button className="checkin-button-overlay" onClick={handleCheckIn}>
          <span className="checkin-icon">📍</span>
          <span className="checkin-text">チェックイン</span>
        </button>
      )}
    </div>
  );
}

export default LocationDetailPage;
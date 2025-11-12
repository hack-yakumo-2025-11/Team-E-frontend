import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ArrowLeft } from "lucide-react";
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
          screenshotUrl: "/screenshots/half-saints.png",
          specialBarcode: "TDC-STADIUM-001",
        },
      };

      return dummyLocations[locationId] || dummyLocations["dolphin-location"];
    };

    const fetchLocation = async () => {
      try {
        setLoading(true);
        // Replace with your API call
        // const response = await getLocationById(locationId);
        // setLocationData(response.data);
        
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
    try {
      // Optional: If you add API later, uncomment this:
      // const response = await completeTask({
      //   userId: "u1",
      //   missionId: location.state?.missionId,
      //   taskId: task.id,
      //   locationId: locationId,
      // });

      console.log("✅ Task completed:", task.id);

      // Navigate back with completedTaskId
      navigate("/", {
        state: {
          completedTaskId: task.id,
          taskReward: task.reward,
        },
      });
    } catch (error) {
      console.error("Error completing task:", error);
      
      // Still navigate back even if API fails
      navigate("/", {
        state: {
          completedTaskId: task.id,
          taskReward: task.reward,
        },
      });
    }
  };

  // ============================================
  // BARCODE SCANNING (Real mode)
  // ============================================
  const onScanSuccess = async (decodedText) => {
    console.log("📱 Scanned:", decodedText);

    if (scanner) {
      scanner.clear().catch((err) => console.log("Scanner clear error:", err));
    }

    setScanning(false);

    if (decodedText === locationData.specialBarcode) {
      await handleTaskCompletion();
    } else {
      alert("❌ Invalid barcode! Please scan the correct mission barcode.");
    }
  };

  const onScanError = (error) => {
    console.warn("Scan error:", error);
  };

  const startScanning = () => {
    setScanning(true);

    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch((err) => console.log("Scanner stop error:", err));
    }
    setScanning(false);
  };

  // ============================================
  // DEMO MODE - Instant completion
  // ============================================
  const handleDemoScan = async () => {
    console.log("🎮 Demo mode - auto completing task");
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
      {/* Back button overlay */}
      <button className="back-btn-overlay" onClick={() => navigate(-1)}>
        <ArrowLeft size={28} color="white" />
      </button>

      {/* Screenshot of existing TDC location page */}
      <div className="screenshot-container">
        <img
          src={locationData.screenshotUrl}
          alt={locationData.name}
          className="location-screenshot"
        />
      </div>

      {/* Check-in button overlaid on screenshot (similar to Image 2) */}
      {task && (
        <button className="checkin-button-overlay" onClick={handleDemoScan}>
          <span className="checkin-icon">📍</span>
          <span className="checkin-text">チェックイン</span>
        </button>
      )}
    </div>
  );
}

export default LocationDetailPage;
import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { getLocationById, completeTask } from "../../services/api";
import { ArrowLeft } from "lucide-react";
import "./LocationPage.css";

function LocationDetailPage() {
  const { locationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { task, missionId } = location.state || {};

  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState(null);

  const getDummyLocation = useCallback(() => {
    const dummyLocations = {
      loc1: {
        id: "loc1",
        name: "ビッグ・オー",
        // Use the Big-O roller coaster screenshot
        screenshotUrl: "/screenshots/big-o.png",
        specialBarcode: "TDC-BIGO-001",
      },
      loc2: {
        id: "loc2",
        name: "Half Saints BAKES",
        // Use the Half Saints bakery screenshot
        screenshotUrl: "/screenshots/half-saints.png",
        specialBarcode: "TDC-HALFsaints-001",
      },
      loc3: {
        id: "loc3",
        name: "GIANTS OFFICIAL TEAM STORE",
        // Use the Giants store screenshot
        screenshotUrl: "/screenshots/giants-store.png",
        specialBarcode: "TDC-GIANTS-001",
      },
    };

    return dummyLocations[locationId] || dummyLocations["loc1"];
  }, [locationId]);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLocationById(locationId);
      setLocationData(response.data);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationData(getDummyLocation());
    } finally {
      setLoading(false);
    }
  }, [locationId, getDummyLocation]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner
          .clear()
          .catch((err) => console.log("Scanner cleanup error:", err));
      }
    };
  }, [scanner]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleTaskCompletion = async () => {
    try {
      const response = await completeTask({
        userId: "u1",
        missionId: missionId,
        taskId: task.id,
        locationId: locationId,
      });

      const message = response.data.bonusAwarded
        ? `🎉 Task Complete! +${response.data.reward} FUN (including bonus!)`
        : `✅ Task Complete! +${task.reward} FUN earned`;

      alert(message);
      navigate("/", { state: { completedTask: task.id } });
    } catch (error) {
      console.error("Error completing task:", error);

      alert(`✅ Task Complete! +${task.reward} FUN earned`);

      navigate("/", {
        state: {
          completedTaskId: task.id,
          taskReward: task.reward,
        },
      });
    }
  };

  const onScanSuccess = async (decodedText) => {
    console.log("Scanned:", decodedText);

    if (scanner) {
      scanner.clear().catch((err) => console.log("Scanner clear error:", err));
    }

    setScanning(false);

    if (decodedText === locationData.specialBarcode) {
      await handleTaskCompletion();
    } else {
      alert("Invalid barcode! Please scan the correct mission barcode.");
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

  const handleDemoScan = async () => {
    console.log("Demo scan - auto completing task");
    await handleTaskCompletion();
  };

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
          style={{
            maxWidth: "100%",
            height: "auto",
            maxHeight: "60vh",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Your NEW section with demo buttons - overlaid at bottom */}
      {task && (
        <div className="demo-overlay-section">
          <div className="demo-section-header">
            <h3>🎯 MISSION CHECK-IN</h3>
            <p>Complete task to earn +{task.reward} FUN points</p>
          </div>

          {!scanning ? (
            <div className="demo-buttons">
              {/* DEMO MODE BUTTON */}
              <button className="demo-complete-btn" onClick={handleDemoScan}>
                ✅ COMPLETE TASK (DEMO)
              </button>

              {/* REAL SCAN BUTTON */}
              <button className="demo-scan-btn" onClick={startScanning}>
                📱 SCAN BARCODE (REAL)
              </button>

              <p className="demo-helper-text">
                💡 Use demo button for presentation or scan real barcode
              </p>
            </div>
          ) : (
            <div className="scanner-wrapper">
              <div id="qr-reader" style={{ width: "100%" }}></div>
              <button className="cancel-scan-btn" onClick={stopScanning}>
                Cancel Scanning
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationDetailPage;

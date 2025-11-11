import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { getLocationById, completeTask } from '../../services/api';
import { ArrowLeft, MapPin, Clock, Star } from 'lucide-react';
import './LocationPage.css';

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
      'loc1': {
        id: 'loc1',
        name: 'Ichiran Ramen',
        category: 'food',
        rating: 4.8,
        reviewCount: 2341,
        distance: '400m',
        walkTime: '5 min',
        hours: 'Open until 11:00 PM',
        description: 'Famous tonkotsu ramen chain with rich, creamy broth. Perfect pre-game meal!',
        imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80',
        specialBarcode: 'TDC-ICHIRAN-001',
        address: 'Tokyo Dome City, Bunkyo-ku, Tokyo',
      },
      'loc2': {
        id: 'loc2',
        name: 'Baseball Stadium Entrance',
        category: 'photo',
        rating: 4.9,
        reviewCount: 5432,
        distance: '150m',
        walkTime: '2 min',
        hours: 'Always accessible',
        description: 'Iconic entrance to Tokyo Dome stadium. Capture the perfect shot with stunning architecture and vibrant atmosphere!',
        imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
        specialBarcode: 'TDC-DOME-ENTRANCE-001',
        address: 'Tokyo Dome City, Bunkyo-ku, Tokyo',
      },
      'loc3': {
        id: 'loc3',
        name: 'Thunder Dolphin',
        category: 'entertainment',
        rating: 4.9,
        reviewCount: 5123,
        distance: '600m',
        walkTime: '8 min',
        hours: 'Open until 10:00 PM',
        description: 'Heart-pounding roller coaster that weaves through buildings! Feel the rush as you soar at 130 km/h with incredible Tokyo views.',
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80',
        specialBarcode: 'TDC-THUNDER-DOLPHIN-001',
        address: 'Tokyo Dome City Attractions, Bunkyo-ku, Tokyo',
        waitTime: '15 minutes',
      },
    };

    return dummyLocations[locationId] || dummyLocations['loc1'];
  }, [locationId]);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLocationById(locationId);
      setLocationData(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
      setLocationData(getDummyLocation());
    } finally {
      setLoading(false);
    }
  }, [locationId, getDummyLocation]);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.log('Scanner cleanup error:', err));
      }
    };
  }, [scanner]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleTaskCompletion = async () => {
    try {
      const response = await completeTask({
        userId: 'u1',
        missionId: missionId,
        taskId: task.id,
        locationId: locationId,
      });

      const message = response.data.bonusAwarded
        ? `🎉 Task Complete! +${response.data.reward} FUN (including bonus!)`
        : `✅ Task Complete! +${task.reward} FUN earned`;
      
      alert(message);
      navigate('/', { state: { completedTask: task.id } });
    } catch (error) {
      console.error('Error completing task:', error);
      
      // DEMO MODE: Update dummy data locally
      alert(`✅ Task Complete! +${task.reward} FUN earned`);
      
      // Pass completed task info back to mission page
      navigate('/', { 
        state: { 
          completedTaskId: task.id,
          taskReward: task.reward 
        } 
      });
    }
  };

  const onScanSuccess = async (decodedText) => {
    console.log('Scanned:', decodedText);
    
    if (scanner) {
      scanner.clear().catch(err => console.log('Scanner clear error:', err));
    }
    
    setScanning(false);

    if (decodedText === locationData.specialBarcode) {
      await handleTaskCompletion();
    } else {
      alert('Invalid barcode! Please scan the correct mission barcode.');
    }
  };

  const onScanError = (error) => {
    console.warn('Scan error:', error);
  };

  const startScanning = () => {
    setScanning(true);
    
    const html5QrcodeScanner = new Html5QrcodeScanner(
      'qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    html5QrcodeScanner.render(onScanSuccess, onScanError);
    setScanner(html5QrcodeScanner);
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.clear().catch(err => console.log('Scanner stop error:', err));
    }
    setScanning(false);
  };

  // NEW: Demo function - simulate barcode scan
  const handleDemoScan = async () => {
    console.log('Demo scan - auto completing task');
    await handleTaskCompletion();
  };

  if (loading) {
    return <div className="loading">Loading location...</div>;
  }

  return (
    <div className="location-page">
      <div className="location-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={28} />
        </button>
        <h1 className="location-title">
          {task ? `Task ${task.order}: ${task.title}` : locationData.name}
        </h1>
        <div className="task-icon-header">
          {task?.type === 'food' ? '🍜' : task?.type === 'photo' ? '📸' : '🎢'}
        </div>
      </div>

      {task && (
        <div className="task-progress-indicator">
          <span>Mission Progress: {task.order - 1}/3 tasks • {((task.order - 1) / 3 * 100).toFixed(0)}%</span>
        </div>
      )}

      <div className="location-image-container">
        <img
          src={locationData.imageUrl}
          alt={locationData.name}
          className="location-image"
        />
      </div>

      <div className="location-info">
        <h2 className="location-name">{locationData.name}</h2>
        
        <div className="location-meta">
          <div className="rating">
            <Star size={16} fill="#ffd700" color="#ffd700" />
            <span>{locationData.rating}</span>
            <span className="review-count">({locationData.reviewCount} reviews)</span>
          </div>
          
          <div 
            className="category-badge"
            style={{
              backgroundColor: 
                locationData.category === 'food' ? '#4caf50' :
                locationData.category === 'photo' ? '#9c27b0' :
                locationData.category === 'entertainment' ? '#ff9800' :
                locationData.category === 'shopping' ? '#1E90FF' :
                '#757575'
            }}
          >
            {locationData.category.toUpperCase()}
          </div>
        </div>

        <div className="location-details">
          <div className="detail-item">
            <MapPin size={16} />
            <span>{locationData.walkTime} • {locationData.distance} away</span>
          </div>
          <div className="detail-item">
            <Clock size={16} />
            <span>{locationData.hours}</span>
          </div>
        </div>

        <p className="location-description">{locationData.description}</p>
      </div>

      {task && (
        <div className="mission-checkin-section">
          <div className="checkin-header">
            <h3>🎯 COMPLETE TASK {task.order}</h3>
            <p>Scan the special mission barcode at this location</p>
          </div>

          <div className="reward-display">
            <span className="reward-label">Earn</span>
            <span className="reward-amount">+{task.reward} FUN</span>
          </div>

          {!scanning ? (
            <div>
              {/* DEMO MODE BUTTON */}
              <button className="scan-button demo-mode" onClick={handleDemoScan}>
                ✅ COMPLETE TASK (DEMO)
              </button>
              
              {/* REAL SCAN BUTTON */}
              <button className="scan-button-secondary" onClick={startScanning}>
                📱 SCAN BARCODE (REAL)
              </button>
              
              <p className="helper-text">
                💡 Click "Complete Task" for demo, or "Scan Barcode" to use camera
              </p>
            </div>
          ) : (
            <div className="scanner-container">
              <div id="qr-reader" style={{ width: '100%' }}></div>
              <button
                className="cancel-scan-button"
                onClick={stopScanning}
              >
                Cancel Scanning
              </button>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <button className="action-btn outline">
          🗺️ GET DIRECTIONS
        </button>
        <button className="action-btn outline">
          📞 CALL LOCATION
        </button>
      </div>
    </div>
  );
}

export default LocationDetailPage;
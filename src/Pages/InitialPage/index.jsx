import styles from './styles.module.css';
import FreshStart from '../../assets/images/FreshStart.png';
import OpenScan from '../../assets/images/OpenScan.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetMission } from '../../services/api';

function InitialPage() {
  const [backImage, setBackImage] = useState(false);
  const [resetting, setResetting] = useState(false);
  const navigate = useNavigate();

  const MISSION_ID = "m1";

  const handleCheckIn = async () => {
    if (resetting) {
      console.log("⚠️ Reset already in progress");
      return;
    }

    try {
      setResetting(true);
      console.log("🔄 Starting mission reset...");
      console.log("📡 Mission ID:", MISSION_ID);
      
      // Call backend to reset the mission
      const response = await resetMission(MISSION_ID);
      
      console.log("✅ Reset response received:", response);
      console.log("✅ Response data:", response.data);
      console.log("✅ Response status:", response.status);
      
      // Check if response is successful
      if (response.status === 200 && response.data.success) {
        console.log("✅ Mission reset successful!");
        
        const currentDate = new Date().toISOString();
        
        // Navigate to mission page with new check-in flag
        navigate('/mission-page', {
          state: {
            checkinDate: currentDate,
            isNewCheckIn: true
          }
        });
      } else {
        throw new Error("Reset failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Full error object:", error);
      console.error("❌ Error response:", error.response);
      console.error("❌ Error data:", error.response?.data);
      console.error("❌ Error status:", error.response?.status);
      console.error("❌ Error message:", error.message);
      
      // More specific error message
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert(`チェックイン中にエラーが発生しました\n\nDetails: ${errorMsg}\n\nCheck browser console for more info`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className={styles.initial_page}>
        <img 
          src={backImage ? OpenScan : FreshStart} 
          className={styles.initial_page_img}
        />
        <button 
          className={styles.initial_page_open_scan_button} 
          onClick={() => setBackImage((val) => 1 - val)}
          style={{zIndex: !backImage * 3}}
          disabled={resetting}
        />
        <button 
          className={styles.initial_page_fun_button}
          onClick={() => navigate('/fun')}
          style={{zIndex: !backImage * 3}}
          disabled={resetting}
        />
        <button 
          className={styles.initial_page_click_scan_button}
          onClick={handleCheckIn}
          style={{zIndex: backImage * 3}}
          disabled={resetting}
        />
        <button 
          className={styles.initial_page_close_scan_button}
          onClick={() => setBackImage((val) => 1 - val)}
          style={{zIndex: backImage * 3}}
          disabled={resetting}
        />
    </div>
  );
}

export default InitialPage;
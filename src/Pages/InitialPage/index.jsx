// src/pages/InitialPage/InitialPage.jsx
import styles from './styles.module.css';
import FreshStart from '../../assets/images/FreshStart.png';
import OpenScan from '../../assets/images/OpenScan.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetMission } from '../../services/api';
import MissionSelector from '../../components/MissionSelector/MissionSelector';

function InitialPage() {
  const [backImage, setBackImage] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showMissionSelector, setShowMissionSelector] = useState(false);
  const navigate = useNavigate();

  const MISSION_ID = 'm1';

  const handleCheckIn = async () => {
    if (resetting) {
      console.log('⚠️ Reset already in progress');
      return;
    }

    try {
      setResetting(true);
      console.log('🔄 Starting mission reset...');
      console.log('📡 Mission ID:', MISSION_ID);

      const response = await resetMission(MISSION_ID);

      console.log('✅ Reset response received:', response);

      if (response.status === 200 && response.data.success) {
        console.log('✅ Mission reset successful!');

        // 🧹 Clear locked mission info for a *new* check-in
        localStorage.removeItem('activeMissionId');
        localStorage.removeItem('missionLocked');

        // Show FreshStart in background
        setBackImage(false);
        // Open MissionSelector to choose a new mission
        setShowMissionSelector(true);
      } else {
        throw new Error('Reset failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Full error object:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
      alert(
        `チェックイン中にエラーが発生しました\n\nDetails: ${errorMsg}\n\nCheck browser console for more info`
      );
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className={styles.initial_page}>
      <img
        src={backImage ? OpenScan : FreshStart}
        className={styles.initial_page_img}
        alt="Initial page"
      />

      <button
        className={styles.initial_page_open_scan_button}
        onClick={() => setBackImage((val) => 1 - val)}
        style={{ zIndex: !backImage * 3 }}
        disabled={resetting}
      />
      <button
        className={styles.initial_page_fun_button}
        onClick={() => navigate('/fun')}
        style={{ zIndex: !backImage * 3 }}
        disabled={resetting}
      />
      <button
        className={styles.initial_page_click_scan_button}
        onClick={handleCheckIn}
        style={{ zIndex: backImage * 3 }}
        disabled={resetting}
      />
      <button
        className={styles.initial_page_close_scan_button}
        onClick={() => setBackImage((val) => 1 - val)}
        style={{ zIndex: backImage * 3 }}
        disabled={resetting}
      />

      {/* Mission Selector Dialog */}
      <MissionSelector
        isOpen={showMissionSelector}
        onClose={() => {
          setShowMissionSelector(false);
          setBackImage(false);
          navigate('/'); // if InitialPage is '/', this keeps you on this screen
        }}
      />
    </div>
  );
}

export default InitialPage;

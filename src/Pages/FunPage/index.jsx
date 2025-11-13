// src/pages/FunPage/FunPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Goal, Trophy } from 'lucide-react';

import styles from './styles.module.css';
import FunScreen from '../../assets/images/FunScreen.png';
import MissionSelector from '../../components/MissionSelector/MissionSelector';

function FunPage() {
  const navigate = useNavigate();
  const [isMissionSelectorOpen, setIsMissionSelectorOpen] = useState(false);

  // Load current mission info from localStorage (set by MissionPage)
  const activeMissionId = localStorage.getItem('activeMissionId');
  const isMissionLocked = localStorage.getItem('missionLocked') === '1';

  const handleMissionsClick = () => {
    // If mission is locked and already selected, navigate directly to mission page
    if (isMissionLocked && activeMissionId) {
      console.log('🔒 Mission locked, navigating to active mission:', activeMissionId);
      navigate('/mission-page', {
        state: {
          selectedMissionId: activeMissionId
        }
      });
    } else {
      // Otherwise, show mission selector
      setIsMissionSelectorOpen(true);
    }
  };

  return (
    <div className={styles.fun_page}>
      <img
        src={FunScreen}
        className={styles.fun_page_img}
        alt="Fun screen"
      />

      {/* Home / initial button */}
      <button
        className={styles.fun_page_initial_button}
        onClick={() => navigate('/')}
      />

      {/* Missions button → navigate directly to active mission or open selector */}
      <button
        className={styles.fun_page_missions_button}
        onClick={handleMissionsClick}
      >
        <Goal color="red" />
      </button>

      {/* Achievements button */}
      <button
        className={styles.fun_page_achievements_button}
        onClick={() => navigate('/achievements')}
      >
        <Trophy color="gold" />
      </button>

      {/* Mission selector modal - only shows when mission is NOT locked */}
      <MissionSelector
        isOpen={isMissionSelectorOpen}
        onClose={() => setIsMissionSelectorOpen(false)}
        activeMissionId={activeMissionId}
        isMissionLocked={isMissionLocked}
        // normal selection flow; MissionSelector will navigate to /mission-page
      />
    </div>
  );
}

export default FunPage;
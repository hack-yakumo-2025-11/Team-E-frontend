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

      {/* Missions button → open MissionSelector modal */}
      <button
        className={styles.fun_page_missions_button}
        onClick={() => setIsMissionSelectorOpen(true)}
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

      {/* Mission selector modal */}
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

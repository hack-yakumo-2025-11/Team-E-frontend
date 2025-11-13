// src/components/MissionSelector/MissionSelector.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMissions, selectMission } from '../../services/api';
import styles from './styles.module.css';

function MissionSelector({
  isOpen,
  onClose,
  onSelectMission,
  isSwapMode = false,
  activeMissionId = null,   // currently selected mission ID
  isMissionLocked = false,  // whether mission choice should be locked
}) {
  const navigate = useNavigate();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMissions();
    }
  }, [isOpen]);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const response = await getMissions();
      setMissions(response.data.missions);
    } catch (error) {
      console.error('❌ Error fetching missions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMission = async (missionId) => {
    if (selecting) return;

    const isActive = activeMissionId && missionId === activeMissionId;
    const isDisabled =
      isMissionLocked && !isActive && !isSwapMode;

    if (isDisabled) {
      console.log('🔒 Mission choice locked until new check-in');
      return;
    }

    // Swap mode: just send mission ID back to parent
    if (isSwapMode && onSelectMission) {
      onSelectMission(missionId);
      onClose?.();
      return;
    }

    // Normal flow: select in backend and go to mission page
    try {
      setSelecting(true);
      console.log('🎯 Selecting mission:', missionId);

      const response = await selectMission(missionId);

      if (response.data.success) {
        console.log('✅ Mission selected successfully');
        navigate('/mission-page', {
          state: {
            selectedMissionId: missionId,
            isNewMission: true,
          },
        });
      }
    } catch (error) {
      console.error('❌ Error selecting mission:', error);
      alert('ミッション選択中にエラーが発生しました');
    } finally {
      setSelecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.mission_selector_overlay}
      onClick={onClose}
    >
      <div
        className={styles.mission_selector_dialog}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.mission_selector_header}>
          <div className={styles.mission_header_text}>
            <h2>🎯 ミッションを選択</h2>
            <p>あなたのスタイルに合ったミッションを選んでください</p>
          </div>
        </div>

        {loading ? (
          <div className={styles.mission_selector_loading}>
            <p>ミッションを読み込み中...</p>
          </div>
        ) : (
          <div className={styles.mission_cards_container}>
            {missions.map((mission) => {
              const isActive =
                activeMissionId && mission.id === activeMissionId;
              const isDisabled =
                isMissionLocked && !isActive && !isSwapMode;

              return (
                <div
                  key={mission.id}
                  className={[
                    styles.mission_card,
                    isDisabled ? styles.mission_card_disabled : null
                  ]}
                  onClick={() => {
                    if (isDisabled) return;
                    handleSelectMission(mission.id);
                  }}
                  style={{
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                  }}
                >
                  <div className={styles.mission_card_icon}>{mission.icon}</div>
                  <h3 className={styles.mission_card_title}>
                    {mission.title}
                    {isActive && (
                      <span className={styles.mission_active_tag}>（選択中）</span>
                    )}
                  </h3>
                  <div className={styles.mission_card_duration}>
                    ⏱️ {mission.duration}
                  </div>
                  <p className={styles.mission_card_description}>
                    {mission.description}
                  </p>
                  <div className={styles.mission_card_stats}>
                    <div className={styles.mission_stat}>
                      <span className={styles.stat_icon}>📍</span>
                      <span className={styles.stat_value}>
                        {mission.tasks?.length ?? 0} タスク
                      </span>
                    </div>
                    <div className={styles.mission_stat}>
                      <span className={styles.stat_icon}>🎁</span>
                      <span className={styles.stat_value}>
                        {mission.totalReward} FUN
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.mission_select_button}
                    disabled={selecting || isDisabled}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMission(mission.id);
                    }}
                  >
                    {isDisabled
                      ? '次のチェックインまで選べません'
                      : selecting
                      ? '選択中...'
                      : 'このミッションを選ぶ'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.mission_selector_footer}>
          <button
            className={styles.mission_cancel_button}
            onClick={onClose}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}

export default MissionSelector;

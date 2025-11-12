import styles from './styles.module.css';
import FreshStart from '../../assets/images/FreshStart.png';
import OpenScan from '../../assets/images/OpenScan.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitialPage() {
  const [backImage, setBackImage] = useState(false);
  const navigate = useNavigate();


  const handleCheckIn = () => {
    console.log("New check-in detected - resetting mission tasks");
    
    const currentDate = new Date().toISOString();

    localStorage.removeItem("completedTasks");
    
  
    localStorage.setItem("lastCheckinDate", new Date().toDateString());
    
    console.log("Mission reset complete - navigating to mission page");

    navigate('/mission-page', {
      state: {
        checkinDate: currentDate,
        isNewCheckIn: true
      }
    });
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
        />
        <button 
          className={styles.initial_page_fun_button}
          onClick={() => navigate('/fun')}
          style={{zIndex: !backImage * 3}}
        />
        <button 
          className={styles.initial_page_click_scan_button}
          onClick={handleCheckIn}
          style={{zIndex: backImage * 3}}
        />
        <button 
          className={styles.initial_page_close_scan_button}
          onClick={() => setBackImage((val) => 1 - val)}
          style={{zIndex: backImage * 3}}
        />
    </div>
  );
}

export default InitialPage;
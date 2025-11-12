import styles from './styles.module.css';
import FreshStart from '../../assets/images/FreshStart.png';
import OpenScan from '../../assets/images/OpenScan.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function InitialPage() {
  const [backImage, setBackImage] = useState(false);
  const navigate = useNavigate();

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
          onClick={() => console.log('-')}
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
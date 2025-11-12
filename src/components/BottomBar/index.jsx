import styles from './styles.module.css';
import bottomBarImage from '../../assets/images/bottom_bar.png';
import { useNavigate } from 'react-router-dom';

function BottomBar() {
  const navigate = useNavigate();

  return (
    <div className={styles.bottom_bar}>
      <img src={bottomBarImage} alt="Bottom Bar" />
      <button 
        className={styles.bottom_bar_initial_button}
        onClick={() => navigate('/')}
      />
      <button 
        className={styles.bottom_bar_achievements_button}
        onClick={() => navigate('/fun')}
      />
    </div>
  );
}

export default BottomBar;

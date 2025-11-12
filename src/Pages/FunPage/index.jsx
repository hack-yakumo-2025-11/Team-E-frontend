import styles from './styles.module.css';
import FunScreen from '../../assets/images/FunScreen.png';
import { useNavigate } from 'react-router-dom';
import { Goal, Trophy } from 'lucide-react';

function FunPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.fun_page}>
        <img 
          src={FunScreen} 
          className={styles.fun_page_img}
        />
        <button 
          className={styles.fun_page_initial_button}
          onClick={() => navigate('/')}
        />
        <button 
          className={styles.fun_page_missions_button}
          onClick={() => navigate('/missions/')}
        >
          <Goal color='red'/>
        </button>
        <button 
          className={styles.fun_page_achievements_button}
          onClick={() => navigate('/achievements')}
        >
          <Trophy color='gold'/>
        </button>
    </div>
  );
}

export default FunPage;
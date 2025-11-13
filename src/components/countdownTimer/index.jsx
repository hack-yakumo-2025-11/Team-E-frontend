import { useState, useEffect } from 'react';
import styles from './styles.module.css';

function CountdownTimer({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft('期限切れ');
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [expiryTime]);

  return (
    <div className={styles.countdown_timer}>
      <div className={styles.timer_icon}>⏰</div>
      <div className={styles.timer_text}>
        <div className={styles.timer_label}>残り時間</div>
        <div className={styles.timer_value}>{timeLeft}</div>
      </div>
    </div>
  );
}

export default CountdownTimer;
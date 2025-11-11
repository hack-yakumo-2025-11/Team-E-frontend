import { useState, useEffect } from 'react';
import './CountdownTimer.css';

function CountdownTimer({ expiryTime }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiryTime).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft('EXPIRED');
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
    <div className="countdown-timer">
      <div className="timer-icon">⏰</div>
      <div className="timer-text">
        <div className="timer-label">TIME LEFT</div>
        <div className="timer-value">{timeLeft}</div>
      </div>
    </div>
  );
}

export default CountdownTimer;

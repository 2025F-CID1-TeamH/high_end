import React, { useEffect, useState } from 'react';

const HighResTimer = ({ startTime, endTime, isRunning }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime);
      }, 100);
    } else {
      if (startTime > 0) {
        setElapsed(endTime - startTime);
      } else {
        setElapsed(0);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime, endTime]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)));

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-display">
      {formatTime(elapsed)}
    </div>
  );
};

export default HighResTimer;

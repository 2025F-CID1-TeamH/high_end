import React, { useEffect, useState, useRef } from 'react';

const HighResTimer = ({ startTime, endTime, isRunning }) => {
  const [elapsed, setElapsed] = useState(0);
  const requestRef = useRef();

  useEffect(() => {
    if (isRunning) {
      const animate = () => {
        setElapsed(Date.now() - startTime);
        requestRef.current = requestAnimationFrame(animate);
      };
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      // When not running
      if (startTime > 0 && endTime >= startTime) {
        setElapsed(endTime - startTime);
      } else {
        setElapsed(0);
      }
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning, startTime, endTime]);

  const formatTime = (ms) => {
    if (ms < 0) ms = 0;
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms / 1000) % 60);
    const milliseconds = Math.floor(ms % 1000);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  let timerClass = 'timer-display';
  if (!isRunning) {
    // 아예 시작도 안 헀을때
    if (elapsed === 0) {
      timerClass += ' disabled';
    } else {
      // isRunning만 아니고 측정을 했을때
      timerClass += ' completed';
    }
  } else {
    timerClass += ' active';
  }

  return (
    <div className={timerClass}>
      {formatTime(elapsed)}
    </div>
  );
};

export default HighResTimer;

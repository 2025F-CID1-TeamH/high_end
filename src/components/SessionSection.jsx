import React from 'react';
import { useSession } from '../mqtt/hooks/useSession';
import '../styles/SessionSection.css';
import HighResTimer from './session_section/HighResTimer';
import SessionInfo from './session_section/SessionInfo';

const SessionSection = () => {
  const { isRunning, startTime, endTime, curSession, startSession, stopSession } = useSession();

  return (
    <div className="session-section">
      <div className="session-header">
        <h2>📊 세션 모니터링</h2>
        <div className="session-controls">
          <HighResTimer startTime={startTime} endTime={endTime} isRunning={isRunning} />
          {!isRunning ? (
            <button className="btn-start" onClick={startSession}>
              Start Session
            </button>
          ) : (
            <button className="btn-stop" onClick={stopSession}>
              Stop Session
            </button>
          )}
        </div>
      </div>

      <SessionInfo session={curSession} />
    </div>
  );
};

export default SessionSection;

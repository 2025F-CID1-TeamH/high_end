import { useState, useRef } from "react";
import { useMqttStateContext } from "../MqttStateContext";

export function useSession() {
  const { session } = useMqttStateContext();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const prvSessionRef = useRef(session);

  const { curTotal, curEnter, curExit, curHigh, curMedium, curLow } = session;
  const curSession = {
    total: curTotal - prvSessionRef.current.total,
    enter: curEnter - prvSessionRef.current.enter,
    exit: curExit - prvSessionRef.current.exit,
    high: curHigh - prvSessionRef.current.high,
    medium: curMedium - prvSessionRef.current.medium,
    low: curLow - prvSessionRef.current.low
  }

  const startSession = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setEndTime(Date.now());
    prvSessionRef.current = { ...session };
  }
  const stopSession = () => {
    setIsRunning(false);
    setEndTime(Date.now());
  }

  return {
    isRunning,
    startTime,
    endTime,
    curSession,
    startSession,
    stopSession,
    elapsedTime,
    count,
  };
}

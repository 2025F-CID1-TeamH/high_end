import { useState, useRef } from "react";
import { useMqttStateContext } from "../MqttStateContext";

export function useSession() {
  const { session } = useMqttStateContext();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const prvSessionRef = useRef(session);

  const { total, enter, exit, high, medium, low } = session;
  const curSession = {
    total: total - prvSessionRef.current.total,
    enter: enter - prvSessionRef.current.enter,
    exit: exit - prvSessionRef.current.exit,
    high: high - prvSessionRef.current.high,
    medium: medium - prvSessionRef.current.medium,
    low: low - prvSessionRef.current.low
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
    stopSession
  };
}

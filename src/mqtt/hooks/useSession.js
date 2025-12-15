import { useState, useRef, useEffect } from "react";
import { useMqttStateContext } from "../MqttStateContext";

export function useSession() {
  const { session } = useMqttStateContext();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const prvSessionRef = useRef(session);
  const minLatencyRef = useRef(Infinity);
  const maxLatencyRef = useRef(-Infinity);

  useEffect(() => {
    if (isRunning) {
      const latency = session.lastLatency;
      if (latency !== undefined) {
        if (latency < minLatencyRef.current) minLatencyRef.current = latency;
        if (latency > maxLatencyRef.current) maxLatencyRef.current = latency;
      }
    }
  }, [session, isRunning]);

  const { total, enter, exit, high, medium, low, latencySum } = session;

  const deltaTotal = total - prvSessionRef.current.total;
  const deltaLatencySum = latencySum - prvSessionRef.current.latencySum;
  const avgLatency = deltaTotal > 0 ? deltaLatencySum / deltaTotal : 0;

  const curSession = {
    total: total - prvSessionRef.current.total,
    enter: enter - prvSessionRef.current.enter,
    exit: exit - prvSessionRef.current.exit,
    high: high - prvSessionRef.current.high,
    medium: medium - prvSessionRef.current.medium,
    low: low - prvSessionRef.current.low,
    latency: {
      min: minLatencyRef.current === Infinity ? 0 : minLatencyRef.current,
      max: maxLatencyRef.current === -Infinity ? 0 : maxLatencyRef.current,
      avg: avgLatency
    }
  }

  const startSession = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setEndTime(Date.now());

    prvSessionRef.current = { ...session };
    minLatencyRef.current = Infinity;
    maxLatencyRef.current = -Infinity;
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

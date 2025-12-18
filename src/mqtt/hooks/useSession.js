import { useState, useRef, useEffect } from "react";
import { useMqttStateContext } from "../MqttStateContext";

export function useSession() {
  const { session } = useMqttStateContext();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const prvSessionRef = useRef(session);
  const [minLatency, setMinLatency] = useState(Infinity);
  const [maxLatency, setMaxLatency] = useState(-Infinity);
  const [minBaselineLatency, setMinBaselineLatency] = useState(Infinity);
  const [maxBaselineLatency, setMaxBaselineLatency] = useState(-Infinity);

  useEffect(() => {
    if (isRunning) {
      const latency = session.lastLatency;
      if (latency !== undefined) {
        setMinLatency(prev => Math.min(prev, latency));
        setMaxLatency(prev => Math.max(prev, latency));
      }

      const baselineLatency = session.baseline.lastLatency;
      if (baselineLatency !== undefined) {
        setMinBaselineLatency(prev => Math.min(prev, baselineLatency));
        setMaxBaselineLatency(prev => Math.max(prev, baselineLatency));
      }
    }
  }, [session.lastLatency, session.baseline.lastLatency, isRunning]);

  const { total, type, latencySum, baseline } = session;

  const deltaTotal = total - prvSessionRef.current.total;
  const deltaLatencySum = latencySum - prvSessionRef.current.latencySum;
  const avgLatency = deltaTotal > 0 ? deltaLatencySum / deltaTotal : 0;

  const baselineTotal = baseline.total - prvSessionRef.current.baseline.total;
  const baselineLatencySum = baseline.latencySum - prvSessionRef.current.baseline.latencySum;
  const avgBaselineLatency = baselineTotal > 0 ? baselineLatencySum / baselineTotal : 0;

  const curSession = {
    total: total - prvSessionRef.current.total,
    enter: type.enter - prvSessionRef.current.type.enter,
    exit: type.exit - prvSessionRef.current.type.exit,
    high: type.high - prvSessionRef.current.type.high,
    medium: type.medium - prvSessionRef.current.type.medium,
    low: type.low - prvSessionRef.current.type.low,
    latency: {
      min: minLatency === Infinity ? 0 : minLatency,
      max: maxLatency === -Infinity ? 0 : maxLatency,
      avg: avgLatency
    },
    baseline_total: baselineTotal,
    baseline_latency: {
      min: minBaselineLatency === Infinity ? 0 : minBaselineLatency,
      max: maxBaselineLatency === -Infinity ? 0 : maxBaselineLatency,
      avg: avgBaselineLatency
    }
  }

  const startSession = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setEndTime(Date.now());

    prvSessionRef.current = { ...session };
    setMinLatency(Infinity);
    setMaxLatency(-Infinity);
    setMinBaselineLatency(Infinity);
    setMaxBaselineLatency(-Infinity);
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

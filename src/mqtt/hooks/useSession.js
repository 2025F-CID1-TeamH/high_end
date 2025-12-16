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
  const minBaselineLatencyRef = useRef(Infinity);
  const maxBaselineLatencyRef = useRef(-Infinity);

  useEffect(() => {
    if (isRunning) {
      const latency = session.lastLatency;
      if (latency !== undefined) {
        if (latency < minLatencyRef.current) minLatencyRef.current = latency;
        if (latency > maxLatencyRef.current) maxLatencyRef.current = latency;
      }

      const baselineLatency = session.baseline.lastLatency;
      if (baselineLatency !== undefined) {
        if (baselineLatency < minBaselineLatencyRef.current) minBaselineLatencyRef.current = baselineLatency;
        if (baselineLatency > maxBaselineLatencyRef.current) maxBaselineLatencyRef.current = baselineLatency;
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
      min: minLatencyRef.current === Infinity ? 0 : minLatencyRef.current,
      max: maxLatencyRef.current === -Infinity ? 0 : maxLatencyRef.current,
      avg: avgLatency
    },
    baseline_total: baselineTotal,
    baseline_latency: {
      min: minBaselineLatencyRef.current === Infinity ? 0 : minBaselineLatencyRef.current,
      max: maxBaselineLatencyRef.current === -Infinity ? 0 : maxBaselineLatencyRef.current,
      avg: avgBaselineLatency
    }
  }

  const startSession = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setEndTime(Date.now());

    prvSessionRef.current = { ...session };
    minLatencyRef.current = Infinity;
    maxLatencyRef.current = -Infinity;

    minBaselineLatencyRef.current = Infinity;
    maxBaselineLatencyRef.current = -Infinity;
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

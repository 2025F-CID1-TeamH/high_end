import { useEffect, useRef, useState } from "react";
import { useMqttStateContext } from "../MqttStateContext";

const WINDOW_MS = 30 * 1000; // 30s

export function useCameraFrame() {
  const { cameraFrame } = useMqttStateContext();
  const prvFramesRef = useRef([]);
  const [deviceFps, setDeviceFps] = useState(0);
  const [receiveFps, setReceiveFps] = useState(0);

  const { timestamp, receivedAt } = cameraFrame;

  useEffect(() => {
    const arr = prvFramesRef.current;

    while (arr.length > 0
      && timestamp - arr[0].timestamp > WINDOW_MS
      && receivedAt - arr[0].receivedAt > WINDOW_MS) {
      arr.shift();
    }

    arr.push({ timestamp, receivedAt });

    const timestampDiff = Math.max(1, arr[arr.length - 1].timestamp - arr[0].timestamp);
    setDeviceFps((arr.length - 1) * 1000 / timestampDiff);

    const receiveDiff = Math.max(1, arr[arr.length - 1].receivedAt - arr[0].receivedAt);
    setReceiveFps((arr.length - 1) * 1000 / receiveDiff);
  }, [timestamp, receivedAt]);

  return {
    ...cameraFrame,
    deviceFps,
    receiveFps
  };
}

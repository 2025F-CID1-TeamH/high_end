import { useMqttStateContext } from "../MqttStateContext";

export function useCameraFrame() {
  const { cameraFrame } = useMqttStateContext();
  return cameraFrame;
}

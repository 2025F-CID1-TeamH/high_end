import { useMqttStateContext } from "../MqttStateContext";

export function useStat() {
  const { stat } = useMqttStateContext();
  return stat;
}

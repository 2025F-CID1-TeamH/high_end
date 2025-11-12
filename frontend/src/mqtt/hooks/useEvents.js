import { useMqttStateContext } from "../MqttStateContext";

export function useEvents() {
  const { events } = useMqttStateContext();
  return events.events.toArray();
}

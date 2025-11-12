import { useMqttStateContext } from "../MqttStateContext";

export function useTracks() {
  const { tracks } = useMqttStateContext();
  return {
    "count": Object.keys(tracks.tracks).length,
    "tracks": tracks.tracks
  }
}

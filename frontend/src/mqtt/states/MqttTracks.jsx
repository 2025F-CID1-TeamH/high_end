export const initialTracks = {
  "tracks": {}
};

export function tracksReducer(state, msg) {
  if (msg.topic === "topst/topst/ai") {
    if (!msg.isJson) {
      console.log("[MqttStat] Received non-JSON message on topic 'topst/topst/ai'");
      return state;
    }

    let newTracks = { ...state.tracks };

    const eventType = msg.json.payload.type;
    const trackId = msg.json.payload.track_id;

    if (eventType === "enter") {
      newTracks[trackId] = {
        "entered_at": msg.json.ts,
        "status": "inside"
      }
    }
    else if (eventType === "exit") {
      if (trackId in newTracks) {
        delete newTracks[trackId];
      }
    }

    return {
      "tracks": newTracks
    }
  }
  else return state;
}

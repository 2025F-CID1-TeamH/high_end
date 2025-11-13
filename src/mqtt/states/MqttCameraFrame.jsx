export const initialCameraFrame = {
  "timestamp": 0,
  "format": "jpg",
  "width": 0,
  "height": 0,
  "frame": ""
};

export function cameraFrameReducer(state, msg) {
  if (msg.topic === "topst/topst/camera") {
    if (!msg.isJson) {
      console.error("[MqttCameraFrame] Received non-JSON message on topic 'topst/topst/camera'");
      return state;
    }

    return {
      "timestamp": msg.json.ts,
      "format": msg.json.payload.format,
      "width": msg.json.payload.width,
      "height": msg.json.payload.height,
      "frame": msg.json.payload.data
    }
  }
  else return state;
}

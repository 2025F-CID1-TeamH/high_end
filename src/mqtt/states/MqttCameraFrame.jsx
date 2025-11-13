export const initialCameraFrame = {
  "timestamp": 0,
  "receivedAt": 0,
  "image": {
    "format": "jpg",
    "width": 0,
    "height": 0,
    "data_b64": "" // base64
  }
};

export function cameraFrameReducer(state, msg) {
  if (msg.topic === "topst/topst/camera") {
    if (!msg.isJson) {
      console.error("[MqttCameraFrame] Received non-JSON message on topic 'topst/topst/camera'");
      return state;
    }

    return {
      "timestamp": msg.json.ts,
      "receivedAt": Date.now(),
      "image": {
        "format": msg.json.payload.format,
        "width": msg.json.payload.width,
        "height": msg.json.payload.height,
        "data_b64": msg.json.payload.data
      }
    }
  }
  else return state;
}

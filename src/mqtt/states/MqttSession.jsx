
export const initialSession = {
  "total": 0,
  "type": {
    "enter": 0,
    "exit": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "latencySum": 0,
  "lastLatency": 0,
  "baseline": {
    "total": 0,
    "latencySum": 0,
    "lastLatency": 0
  }
};

export function sessionReducer(state, msg) {
  if (msg.topic === "topst/topst/ai") {
    if (!msg.isJson) {
      console.error("[MqttSession] Received non-JSON message on topic 'topst/topst/ai'");
      return state;
    }

    let total = state.total;
    let enter = state.type.enter;
    let exit = state.type.exit;
    let high = state.type.high;
    let medium = state.type.medium;
    let low = state.type.low;
    let latencySum = state.latencySum;

    total += 1;

    const eventType = msg.json.payload.type;
    const confidence = msg.json.payload.priority;
    const lastLatency = Date.now() - msg.json.ts;
    latencySum += lastLatency;

    switch (eventType) {
      case "enter":
        enter += 1;
        break;
      case "exit":
        exit += 1;
        break;
      default:
        break;
    }

    switch (confidence) {
      case "high":
        high += 1;
        break;
      case "medium":
        medium += 1;
        break;
      case "low":
        low += 1;
        break;
      default:
        break;
    }

    return {
      ...state,
      total,
      type: {
        enter,
        exit,
        high,
        medium,
        low
      },
      latencySum,
      lastLatency
    }
  }
  else if (msg.topic === "topst/topst/motion") {
    if (!msg.isJson) {
      console.error("[MqttSession] Received non-JSON message on topic 'topst/topst/motion'");
      return state;
    }

    let total = state.baseline.total;
    let latencySum = state.baseline.latencySum;

    total += 1;
    const lastLatency = Date.now() - msg.json.ts;
    latencySum += lastLatency;

    return {
      ...state,
      baseline: {
        total,
        latencySum,
        lastLatency
      }
    }
  }
  else return state;
}

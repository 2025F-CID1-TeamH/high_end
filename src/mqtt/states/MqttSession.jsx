
export const initialSession = {
  "total": 0,
  "enter": 0,
  "exit": 0,
  "high": 0,
  "medium": 0,
  "low": 0,
  "latencySum": 0,
  "lastLatency": 0
};

export function sessionReducer(state, msg) {
  if (msg.topic === "topst/topst/ai") {
    if (!msg.isJson) {
      console.error("[MqttSession] Received non-JSON message on topic 'topst/topst/ai'");
      return state;
    }

    let total = state.total;
    let enter = state.enter;
    let exit = state.exit;
    let high = state.high;
    let medium = state.medium;
    let low = state.low;
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
      total,
      enter,
      exit,
      high,
      medium,
      low,
      latencySum,
      lastLatency
    }
  }
  else return state;
}

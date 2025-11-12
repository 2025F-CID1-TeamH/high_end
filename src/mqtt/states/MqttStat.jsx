export const initialStat = {
  "total_events": 0,
  "enter_count": 0,
  "exit_count": 0,
  "current_people": 0
};

export function statReducer(state, msg) {
  if (msg.topic === "topst/topst/ai") {
    if (!msg.isJson) {
      console.log("[MqttStat] Received non-JSON message on topic 'topst/topst/ai'");
      return state;
    }

    let total_events = state.total_events;
    let enter_count = state.enter_count;
    let exit_count = state.exit_count;
    let current_people = state.current_people;

    const eventType = msg.json.payload.type;
    if (eventType === "enter") {
      total_events += 1;
      enter_count += 1;
      current_people += 1;
    }
    else if (eventType === "exit") {
      total_events += 1;
      exit_count += 1;
      current_people = Math.max(0, current_people - 1);
    }

    return {
      total_events,
      enter_count,
      exit_count,
      current_people
    }
  }
  else return state;
}

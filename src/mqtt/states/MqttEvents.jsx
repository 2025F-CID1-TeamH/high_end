import Deque from "double-ended-queue";


const MAX_EVENTS = 50;
export const initialEvents = {
  "count": 0,
  "events": new Deque() /*{
    "type": "enter" or "exit"
    "device": sent device,
    "track_id": 0,
    "timestamp": 0,
    "seq": 0,
    "priority": "high" or "medium" or "low"
  } */
};


export function eventsReducer(state, msg) {
  if (msg.topic === "topst/topst/ai") {
    if (!msg.isJson) {
      console.error("[MqttEvents] Received non-JSON message on topic 'topst/topst/ai'");
      return state;
    }

    let event = {
      "type": msg.json.payload.type, // "enter" or "exit"
      "device": msg.json.device,
      "track_id": msg.json.payload.track_id,
      "timestamp": msg.json.ts,
      "seq": msg.json.seq,
      "priority": msg.json.payload.priority
    }

    const eventType = msg.json.payload.type;
    if (eventType === "enter") {
      event.image = msg.json.payload.image;
    }

    const newCount = Math.min(state.count + 1, MAX_EVENTS);
    const newEvents = new Deque(state.events.toArray());

    newEvents.unshift(event); // push_left
    if (state.count === MAX_EVENTS) {
      newEvents.pop(); // pop_right
    }

    return {
      "count": newCount,
      "events": newEvents
    }
  }
  else return state;
}

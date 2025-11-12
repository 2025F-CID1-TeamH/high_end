import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import { useMqttContext } from "./MqttContext";
import { initialStat, statReducer } from "./states/MqttStat";
import { eventsReducer, initialEvents } from "./states/MqttEvents";

const MqttStateContext = createContext(null);

const initialState = {
  events: initialEvents,
  stat: initialStat
};

function stateReducer(state, msg) {
  return {
    events: eventsReducer(state.events, msg),
    stat: statReducer(state.stat, msg)
  };
}

export function MqttStateProvider({ children }) {
  const { messages } = useMqttContext();

  const [state, dispatch] = useReducer(stateReducer, initialState);
  const lastProcessedIndex = useRef(0);

  // 메시지에 parsed 필드 추가
  useEffect(() => {
    if (lastProcessedIndex.current >= messages.length) return;

    for (let i = lastProcessedIndex.current; i < messages.length; i++) {
      const msg = messages[i];
      dispatch(msg);
    }

    lastProcessedIndex.current = messages.length;
  }, [messages]);

  return (
    <MqttStateContext.Provider value={state}>
      {children}
    </MqttStateContext.Provider>
  );
}

export function useMqttStateContext() {
  const ctx = useContext(MqttStateContext);
  if (!ctx) throw new Error("useMqttStateContext must be used within a MqttStateProvider");
  return ctx;
}

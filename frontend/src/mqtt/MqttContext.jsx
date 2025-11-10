import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import mqtt from "mqtt";

const MqttContext = createContext(null);

// const MAX_MESSAGES = 1000;

export function MqttProvider({ url, options, children }) {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const c = mqtt.connect(url, {
      reconnectPeriod: 1500,
      connectTimeout: 10_000,
      ...options,
    });

    setClient(c);

    const onConnect = () => setIsConnected(true);
    const onClose = () => setIsConnected(false);
    const onError = (err) => console.error("[MQTT] error:", err);

    const onMessage = (topic, payload) => {
      let json = {};
      let isJson = true;

      try {
        const text = new TextDecoder("utf-8", { fatal: true }).decode(payload); // fatal: true -> parse error 발생
        json = JSON.parse(text);
      } catch {
        json = {};
        isJson = false;
      }

      const msg = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        topic,
        timestamp: Date.now(),
        raw: payload,
        json,
        isJson,
      };

      setMessages(prev => {
        const next = [...prev, msg];
        return next; // return next.length > MAX_MESSAGES ? next.slice(next.length - MAX_MESSAGES) : next;
      });
    };

    c.on("connect", onConnect);
    c.on("close", onClose);
    c.on("error", onError);
    c.on("message", onMessage);

    return () => {
      c.removeListener("connect", onConnect);
      c.removeListener("close", onClose);
      c.removeListener("error", onError);
      c.removeListener("message", onMessage);
      try { c.end(true); } catch { }
      setClient(null);
      setIsConnected(false);
      setMessages([]);
    };
  }, [url, options]);

  const value = useMemo(() => ({
    client,
    isConnected,
    messages,
  }), [client, isConnected, messages]);

  return (
    <MqttContext.Provider value={value}>
      {children}
    </MqttContext.Provider>
  );
};

export function useMqttContext() {
  const ctx = useContext(MqttContext);
  if (!ctx) throw new Error("useMqttContext must be used within MqttProvider");
  return ctx;
};

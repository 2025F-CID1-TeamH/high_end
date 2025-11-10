import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MqttProvider } from './mqtt/MqttContext';

const mqtt_host = process.env.REACT_APP_MQTT_HOST || 'localhost';
const mqtt_port = process.env.REACT_APP_MQTT_PORT || '9001';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MqttProvider
      url={`ws://${mqtt_host}:${mqtt_port}`}
    >
      <App />
    </MqttProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

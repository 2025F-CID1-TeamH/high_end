import React from 'react';
import '../styles/CameraSection.css';

import { useCameraFrame } from '../mqtt/hooks/useCameraFrame';
import { useMqttContext } from '../mqtt/MqttContext';

export default function CameraSection() {
    const { isConnected } = useMqttContext();
    const { format, frame } = useCameraFrame();

    return (
        <div className="camera-section">
            <div className="camera-header">
                <h2>📹 실시간 카메라</h2>
                <div className={`camera-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? '🟢 연결됨' : '🔴 연결 끊김'}
                </div>
            </div>

            <div className="camera-stream-container">
                <img
                    src={`data:image/${format || 'jpeg'};base64,${frame}`}
                    alt="Live Camera Stream"
                    className="camera-stream"
                />
            </div>

            <div className="camera-info">
                {isConnected
                    ? '✅ 카메라로부터 실시간 영상 수신 중'
                    : '⏳ 카메라 연결 대기 중...'}
            </div>
        </div>
    );
}

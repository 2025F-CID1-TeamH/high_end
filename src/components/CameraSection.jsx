import React, { useMemo } from 'react';
import '../styles/CameraSection.css';

import { useCameraFrame } from '../mqtt/hooks/useCameraFrame';
import { useMqttContext } from '../mqtt/MqttContext';

export default function CameraSection() {
    const { isConnected } = useMqttContext();
    const { timestamp, receivedAt, image, deviceFps, receiveFps } = useCameraFrame();

    const { deltaLabel, deltaClass } = useMemo(() => {
        const diff = receivedAt - timestamp;
        const sign = diff >= 0 ? '+' : '-';
        const absMs = Math.abs(diff);
        const mm = Math.floor(absMs / 60000);
        const ss = Math.floor((absMs % 60000) / 1000);
        const pad = (n) => String(n).padStart(2, '0');
        return {
            deltaLabel: `(${sign}${pad(mm)}:${pad(ss)})`,
            deltaClass: diff >= 0 ? 'positive' : 'negative'
        };
    }, [timestamp, receivedAt]);

    return (
        <div className="camera-section">
            <div className="camera-header">
                <h2>📹 실시간 카메라</h2>
                <div className={`camera-status ${isConnected ? 'connected' : 'disconnected'}`}>
                    {isConnected ? '🟢 연결됨' : '🔴 연결 끊김'}
                </div>
            </div>

            <div className="camera-meta">
                <div className="camera-meta-item">
                    <span className="label">📅 타임스탬프</span>
                    <span className="camera-timestamp">{new Date(timestamp).toLocaleString('ko-KR')}</span>
                    <span className={`camera-delta ${deltaClass}`}>{deltaLabel}</span>
                </div>
                <div className="camera-meta-item">
                    <span className="label">🎞️ Device FPS: </span>
                    <span className="camera-fps">{Number.isFinite(deviceFps) ? deviceFps.toFixed(2) : '0.0'}</span>
                    <span className="label">🎞️ Receive FPS: </span>
                    <span className="camera-fps">{Number.isFinite(receiveFps) ? receiveFps.toFixed(2) : '0.0'}</span>
                </div>
            </div>

            <div className="camera-stream-container">
                <img
                    src={`data:image/${image.format || 'jpeg'};base64,${image.data_b64}`}
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

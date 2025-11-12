import React from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const cameraConnected = false;

export default function CameraSection() {
    return (
        <div className="camera-section">
            <div className="camera-header">
                <h2>📹 실시간 카메라</h2>
                <div className={`camera-status ${cameraConnected ? 'connected' : 'disconnected'}`}>
                    {cameraConnected ? '🟢 연결됨' : '🔴 연결 끊김'}
                </div>
            </div>

            <div className="camera-stream-container">
                <img
                    src={`${API_URL}/api/camera/stream`}
                    alt="Live Camera Stream"
                    className="camera-stream"
                />
            </div>

            <div className="camera-info">
                {cameraConnected
                    ? '✅ 카메라로부터 실시간 영상 수신 중'
                    : '⏳ 카메라 연결 대기 중...'}
            </div>
        </div>
    );
}

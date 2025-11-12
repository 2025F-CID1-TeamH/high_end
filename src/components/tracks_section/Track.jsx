import React from 'react';

export default function Track({ trackId, data }) {
    return (
        <div key={trackId} className="track-card">
            <div className="track-id">Track ID: {trackId}</div>
            <div className="track-time">
                입장 시간: {new Date(data.entered_at).toLocaleTimeString('ko-KR')}
            </div>
            <div className="track-status">
                <span className="status-badge inside">내부</span>
            </div>
        </div>
    );
}
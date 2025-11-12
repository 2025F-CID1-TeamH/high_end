import React from 'react';

export default function Event({ event }) {
    const getEventIcon = (type) => {
        switch (type) {
            case 'enter':
                return '🚶 입장';
            case 'exit':
                return '🚶‍♂️ 퇴장';
            default:
                return '❓ 알 수 없음';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return '#e74c3c';
            case 'medium':
                return '#f39c12';
            case 'low':
                return '#27ae60';
            default:
                return '#95a5a6';
        }
    };

    return (
        <div
            className={`event-card ${event.type}`}
            style={{ borderLeftColor: getPriorityColor(event.priority) }}
        >
            <div className="event-header">
                <span className="event-type">{getEventIcon(event.type)}</span>
                <span
                    className="event-priority"
                    style={{
                        backgroundColor: getPriorityColor(event.priority) + '20',
                        color: getPriorityColor(event.priority),
                    }}
                >
                    {`PRIORITY: ${event.priority?.toUpperCase() || 'UNKNOWN'}`}
                </span>
            </div>

            <div className="event-details">
                <div className="event-info">
                    <span className="track-id-badge">ID: {event.track_id}</span>
                    <span className="device-badge">{event.device}</span>
                    <span className="seq-badge">SEQ: {event.seq}</span>
                </div>

                {event.image && (
                    <div className="event-image">
                        <img
                            src={`data:image/${event.image.format || 'jpeg'};base64,${event.image.data_b64}`}
                            alt={`Track ${event.track_id}`}
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="image-info">
                            {event.image.width}×{event.image.height}
                        </div>
                    </div>
                )}
            </div>

            <div className="event-time">
                {new Date(event.timestamp).toLocaleString('ko-KR')}
            </div>
        </div>
    );
}
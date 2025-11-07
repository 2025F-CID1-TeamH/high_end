import React from 'react';

import Event from './events_section/Event';

export default function EventsSection({ events, onRefresh }) {
    return (
        <div className="events-section">
            <div className="events-header">
                <h2>📋 최근 이벤트</h2>
                <button onClick={onRefresh} className="refresh-btn">
                    🔄 새로고침
                </button>
            </div>

            <div className="events-list">
                {events.length === 0 ? (
                    <div className="empty-state">
                        <p>📭 이벤트가 없습니다</p>
                    </div>
                ) : (
                    events.map((event, index) => <Event event={event} key={index} />)
                )}
            </div>
        </div>
    );
}

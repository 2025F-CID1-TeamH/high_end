import React from 'react';

import Event from './events_section/Event';
import { useEvents } from '../mqtt/hooks/useEvents';

export default function EventsSection() {
    const events = useEvents();

    return (
        <div className="events-section">
            <div className="events-header">
                <h2>📋 최근 이벤트</h2>
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

import React, { useState } from 'react';
import '../styles/EventsSection.css';

import Event from './events_section/Event';
import { useEvents } from '../mqtt/hooks/useEvents';

export default function EventsSection() {
    const events = useEvents();
    const [filters, setFilters] = useState({
        high: true,
        medium: true,
        low: false
    });

    const handleFilterChange = (priority) => {
        setFilters(prev => ({
            ...prev,
            [priority]: !prev[priority]
        }));
    };

    const filteredEvents = events.filter(event => {
        const priority = event.priority ? event.priority.toLowerCase() : 'low';
        return filters[priority];
    });

    return (
        <div className="events-section">
            <div className="events-header">
                <h2>📋 최근 이벤트</h2>
                <div className="priority-filters">
                    <label className={`filter-label high ${filters.high ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={filters.high}
                            onChange={() => handleFilterChange('high')}
                        />
                        High
                    </label>
                    <label className={`filter-label medium ${filters.medium ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={filters.medium}
                            onChange={() => handleFilterChange('medium')}
                        />
                        Medium
                    </label>
                    <label className={`filter-label low ${filters.low ? 'active' : ''}`}>
                        <input
                            type="checkbox"
                            checked={filters.low}
                            onChange={() => handleFilterChange('low')}
                        />
                        Low
                    </label>
                </div>
            </div>

            <div className="events-list">
                {filteredEvents.length === 0 ? (
                    <div className="empty-state">
                        <p>📭 이벤트가 없습니다</p>
                    </div>
                ) : (
                    filteredEvents.map((event, index) => <Event event={event} key={index} />)
                )}
            </div>
        </div>
    );
}

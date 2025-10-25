import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState(null);
    const [stats, setStats] = useState(null);
    const [tracks, setTracks] = useState(null);

    // 데이터 로드
    const loadData = async () => {
        try {
            const [eventsRes, statusRes, statsRes, tracksRes] = await Promise.all([
                axios.get(`${API_URL}/api/events`),
                axios.get(`${API_URL}/api/status`),
                axios.get(`${API_URL}/api/stats`),
                axios.get(`${API_URL}/api/tracks`)
            ]);

            setEvents(eventsRes.data);
            setStatus(statusRes.data);
            setStats(statsRes.data);
            setTracks(tracksRes.data);
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
    };

    // 3초마다 자동 새로고침
    useEffect(() => {
        loadData();
        const interval = setInterval(loadData, 3000);
        return () => clearInterval(interval);
    }, []);

    // 타입별 아이콘
    const getEventIcon = (type) => {
        switch (type) {
            case 'enter': return '🚶 입장';
            case 'exit': return '🚶‍♂️ 퇴장';
            default: return '❓ 알 수 없음';
        }
    };

    // 심각도별 색상
    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return '#e74c3c';
            case 'medium': return '#f39c12';
            case 'low': return '#27ae60';
            default: return '#95a5a6';
        }
    };

    return (
        <div className="App">
            <header className="header">
                <h1>🏠 방범 카메라 모니터링</h1>
                <p>실시간 출입 관리 시스템</p>
            </header>

            <div className="container">
                {/* 상태 카드 */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📡</div>
                        <div className="stat-content">
                            <h3>TOPST 연결</h3>
                            <p className={status?.mqtt_connected ? 'status-ok' : 'status-error'}>
                                {status?.mqtt_connected ? '✅ 연결됨' : '❌ 연결 끊김'}
                            </p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>현재 방문 인원</h3>
                            <p className="stat-number highlight">{stats?.current_people || 0}명</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>전체 이벤트</h3>
                            <p className="stat-number">{stats?.total_events || 0}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🚪</div>
                        <div className="stat-content">
                            <h3>입장 / 퇴장</h3>
                            <p className="stat-detail">
                                <span className="enter-count">{stats?.enter_count || 0}</span>
                                {' / '}
                                <span className="exit-count">{stats?.exit_count || 0}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* 현재 추적 중인 사람들 */}
                {tracks && tracks.count > 0 && (
                    <div className="tracks-section">
                        <h2>🎯 현재 추적 중 ({tracks.count}명)</h2>
                        <div className="tracks-list">
                            {Object.entries(tracks.tracks).map(([trackId, data]) => (
                                <div key={trackId} className="track-card">
                                    <div className="track-id">Track ID: {trackId}</div>
                                    <div className="track-time">
                                        입장 시간: {new Date(data.entered_at).toLocaleTimeString('ko-KR')}
                                    </div>
                                    <div className="track-status">
                                        <span className="status-badge inside">내부</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 이벤트 목록 */}
                <div className="events-section">
                    <div className="events-header">
                        <h2>📋 최근 이벤트</h2>
                        <button onClick={loadData} className="refresh-btn">
                            🔄 새로고침
                        </button>
                    </div>

                    <div className="events-list">
                        {events.length === 0 ? (
                            <div className="empty-state">
                                <p>📭 이벤트가 없습니다</p>
                            </div>
                        ) : (
                            events.map((event, index) => (
                                <div
                                    key={index}
                                    className={`event-card ${event.type}`}
                                    style={{ borderLeftColor: getSeverityColor(event.severity) }}
                                >
                                    <div className="event-header">
                                        <span className="event-type">
                                            {getEventIcon(event.type)}
                                        </span>
                                        <span
                                            className="event-severity"
                                            style={{
                                                backgroundColor: getSeverityColor(event.severity) + '20',
                                                color: getSeverityColor(event.severity)
                                            }}
                                        >
                                            {event.severity?.toUpperCase() || 'UNKNOWN'}
                                        </span>
                                    </div>

                                    <div className="event-details">
                                        <div className="event-info">
                                            <span className="track-id-badge">
                                                ID: {event.track_id}
                                            </span>
                                            <span className="device-badge">
                                                {event.device}
                                            </span>
                                            <span className="seq-badge">
                                                SEQ: {event.seq}
                                            </span>
                                        </div>

                                        {/* 입장 이벤트면 이미지 표시 */}
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
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
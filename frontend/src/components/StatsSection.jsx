import React from 'react';

export default function StatsSection({ status, stats }) {
    return (
        <div className="stats-section">
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
    );
}

import React from 'react';
import { useStat } from '../mqtt/hooks/useStat';
import { useMqttContext } from '../mqtt/MqttContext';

export default function StatsSection() {
    const { isConnected } = useMqttContext();
    const stat = useStat();

    return (
        <div className="stats-section">
            <div className="stat-card">
                <div className="stat-icon">📡</div>
                <div className="stat-content">
                    <h3>TOPST 연결</h3>
                    <p className={isConnected ? 'status-ok' : 'status-error'}>
                        {isConnected ? '✅ 연결됨' : '❌ 연결 끊김'}
                    </p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                    <h3>현재 방문 인원</h3>
                    <p className="stat-number highlight">{stat.current_people}명</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                    <h3>전체 이벤트</h3>
                    <p className="stat-number">{stat.total_events}</p>
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-icon">🚪</div>
                <div className="stat-content">
                    <h3>입장 / 퇴장</h3>
                    <p className="stat-detail">
                        <span className="enter-count">{stat.enter_count}</span>
                        {' / '}
                        <span className="exit-count">{stat.exit_count}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import CameraSection from './components/CameraSection';
import StatsSection from './components/StatsSection';
import TracksSection from './components/TracksSection';
import EventsSection from './components/EventsSection';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
    const [events, setEvents] = useState([]);
    const [tracks, setTracks] = useState(null);
    // const [cameraConnected, setCameraConnected] = useState(false);
    const cameraConnected = false;


    // 데이터 로드
    const loadData = async () => {
        try {
            const [eventsRes, tracksRes] = await Promise.all([
                axios.get(`${API_URL}/api/events`),
                axios.get(`${API_URL}/api/tracks`)
            ]);

            setEvents(eventsRes.data);
            setTracks(tracksRes.data);

            // 카메라 연결 상태 업데이트
            // setCameraConnected(statusRes.data.camera_connected || false);
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

    return (
        <div className="App">
            <header className="header">
                <h1>🏠 방범 카메라 모니터링</h1>
                <p>실시간 출입 관리 시스템</p>
            </header>

            <div className="container">
                <CameraSection API_URL={API_URL} cameraConnected={cameraConnected} />
                <StatsSection />
                <TracksSection tracks={tracks} />
                <EventsSection events={events} onRefresh={loadData} />
            </div>
        </div>
    );
}

export default App;
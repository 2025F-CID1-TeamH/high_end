import React from 'react';
import './styles/App.css';

import CameraSection from './components/CameraSection';
import StatsSection from './components/StatsSection';
import TracksSection from './components/TracksSection';
import EventsSection from './components/EventsSection';
import UploadPhotoSection from './components/UploadPhotoSection';
import SessionSection from './components/SessionSection';

function App() {
    return (
        <div className="App">
            <header className="header">
                <h1>🏠 방범 카메라 모니터링</h1>
                <p>실시간 출입 관리 시스템</p>
            </header>

            <div className="container">
                <UploadPhotoSection />
                <StatsSection />
                <TracksSection />
                <div className="events-camera-layout">
                    <EventsSection />
                    <CameraSection />
                </div>
                <SessionSection />
            </div>
        </div>
    );
}

export default App;
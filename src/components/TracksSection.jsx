import React from 'react';
import Track from './tracks_section/Track';
import { useTracks } from '../mqtt/hooks/useTracks';

export default function TracksSection() {
    const tracks = useTracks();

    if (!tracks || tracks.count === 0) return null;

    return (
        <div className="tracks-section">
            <h2>🎯 현재 추적 중 ({tracks.count}명)</h2>
            <div className="tracks-list">
                {Object.entries(tracks.tracks).map(([trackId, data]) => <Track trackId={trackId} data={data} key={trackId} />)}
            </div>
        </div>
    );
};

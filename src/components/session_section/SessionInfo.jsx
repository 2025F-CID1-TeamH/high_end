import React from 'react';

const SessionInfo = ({ session }) => {
  return (
    <div className="session-stats-grid">
      <div className="session-card total">
        <h3>Total Events</h3>
        <div className="value">{session.total}</div>
      </div>

      <div className="session-card group">
        <h3>Latency (ms)</h3>
        <div className="sub-stats">
          <div className="sub-stat">
            <span className="label">Min</span>
            <span className="val">{session.latency.min.toFixed(0)}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Max</span>
            <span className="val">{session.latency.max.toFixed(0)}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Avg</span>
            <span className="val">{session.latency.avg.toFixed(1)}</span>
          </div>
        </div>
      </div>


      <div className="session-card group">
        <h3>Movement</h3>
        <div className="sub-stats">
          <div className="sub-stat">
            <span className="label">Enter</span>
            <span className="val">{session.enter}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Exit</span>
            <span className="val">{session.exit}</span>
          </div>
        </div>
      </div>

      <div className="session-card group">
        <h3>Confidence</h3>
        <div className="sub-stats">
          <div className="sub-stat">
            <span className="label">High</span>
            <span className="val">{session.high}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Mid</span>
            <span className="val">{session.medium}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Low</span>
            <span className="val">{session.low}</span>
          </div>
        </div>
      </div>
      <div className="session-card total">
        <h3>Baseline Total</h3>
        <div className="value">{session.baseline_total}</div>
      </div>

      <div className="session-card group">
        <h3>Baseline Latency (ms)</h3>
        <div className="sub-stats">
          <div className="sub-stat">
            <span className="label">Min</span>
            <span className="val">{session.baseline_latency.min.toFixed(0)}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Max</span>
            <span className="val">{session.baseline_latency.max.toFixed(0)}</span>
          </div>
          <div className="sub-stat">
            <span className="label">Avg</span>
            <span className="val">{session.baseline_latency.avg.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;

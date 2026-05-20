import { useState } from "react";
import { conferenceConfig } from "../conferenceConfig";

export default function DirectPage() {
  const [retryCount, setRetryCount] = useState(0);
  const [isLive] = useState(true);

  return (
    <div className="page-shell direct-page">
      <div className="section-card">
        <div className="section-header">
          <div>
            <span>Live</span>
            <h1>Conference stream</h1>
          </div>
        </div>
        <div className="labeled-pill">{isLive ? "LIVE" : "OFFLINE"}</div>
        <p className="stream-status">
          Watch the main stage and hybrid broadcast for {conferenceConfig.name}.
        </p>
        <button
          className="secondary-button"
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Refresh stream
        </button>
      </div>

      <div className="section-card">
        <div className="stream-card">
          <h3>Stream player</h3>
          <div
            style={{
              background: "#111",
              height: "320px",
              borderRadius: "24px",
              display: "grid",
              placeItems: "center",
              color: "#fff",
            }}
          >
            Video stream placeholder
          </div>
          <p style={{ marginTop: "18px", color: "var(--text-muted)" }}>
            Live stream URL: {conferenceConfig.streamUrl}
          </p>
          {retryCount > 0 && (
            <p style={{ color: "var(--accent-dark)", fontWeight: 600 }}>
              Retry attempts: {retryCount}
            </p>
          )}
        </div>
      </div>

      <div className="section-card stream-card">
        <h4>Stream details</h4>
        <ul
          style={{
            paddingLeft: "1.2rem",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}
        >
          <li>Status: {isLive ? "Live" : "Offline"}</li>
          <li>Quality: HLS / Adaptive</li>
          <li>Source: Official ElMoultaqa stream</li>
        </ul>
      </div>
    </div>
  );
}

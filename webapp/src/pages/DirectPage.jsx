import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "../style/DirectPage.css";
import { submitStreamQuestion } from "../services/localService";
import { useAuth } from "../context/AuthContext";
import { useConferenceConfig } from "../context/ConferenceContext";

const ENV_STREAM_URL = import.meta.env.VITE_STREAM_URL || "";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Given any YouTube URL variant, return the raw video ID — or null.
 *
 * Supports:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/live/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 */
function extractYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");

    if (host === "youtu.be") {
      return u.pathname.slice(1).split("?")[0] || null;
    }

    if (host === "youtube.com") {
      // /live/ID  or  /embed/ID
      const pathMatch = u.pathname.match(/\/(live|embed)\/([a-zA-Z0-9_-]{11})/);
      if (pathMatch) return pathMatch[2];

      // ?v=ID
      const v = u.searchParams.get("v");
      if (v) return v;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function YouTubePlayer({ videoId }) {
  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="stream-player yt-wrapper">
      <iframe
        key={videoId}
        src={embedUrl}
        title="Live stream"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="yt-iframe"
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          border: "none",
          borderRadius: 8,
          background: "#000",
        }}
      />
    </div>
  );
}

function HlsPlayer({ streamUrl, onLive, onError, retryKey }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    let hls;
    let mounted = true;

    onError("");
    onLive(false);

    if (Hls.isSupported()) {
      hls = new Hls({
        manifestLoadingRetryDelay: 4000,
        fragLoadingRetryDelay: 4000,
        maxRetry: 5,
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (!mounted) return;
        onError(`Stream error: ${data.type} — ${data.details}`);
        if (data.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        }
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!mounted) return;
        onLive(true);
        video.play().catch(() => {});
      });

      hls.attachMedia(video);
      hls.loadSource(streamUrl);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl;
      video.addEventListener("loadedmetadata", () => {
        if (!mounted) return;
        onLive(true);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        if (!mounted) return;
        onError("Failed to load the stream.");
      });
    } else {
      onError("Your browser does not support HLS playback.");
    }

    return () => {
      mounted = false;
      if (hls) hls.destroy();
      if (video) { video.pause(); video.src = ""; }
    };
  }, [streamUrl, retryKey]);

  return (
    <div className="stream-player">
      <video ref={videoRef} controls playsInline className="video-element" />
    </div>
  );
}

function NoStreamPlaceholder() {
  return (
    <div
      className="stream-player"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "16 / 9",
        background: "rgba(0,0,0,0.35)",
        borderRadius: 8,
        gap: 12,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      <span style={{ fontSize: "3rem" }}>📡</span>
      <p style={{ margin: 0, fontSize: "0.95rem" }}>
        Stream not configured yet — check back closer to the event.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function DirectPage() {
  const { user } = useAuth();
  const config = useConferenceConfig();

  const [streamUrl, setStreamUrl] = useState(null);
  const [youtubeId, setYoutubeId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [hlsError, setHlsError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [question, setQuestion] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");
  const [questions, setQuestions] = useState([]);

  // Resolve stream URL: DB → env var → nothing
  useEffect(() => {
    const url =
      config?.stream_url ||
      config?.settings?.stream_url ||
      ENV_STREAM_URL ||
      null;

    setStreamUrl(url);
    setYoutubeId(extractYouTubeId(url));
  }, [config]);

  async function handleQuestionSubmit(e) {
    e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    const submitted = await submitStreamQuestion({
      author: user?.displayName || "Attendee",
      clerkUserId: user?.uid || null,
      message: trimmed,
    });

    setQuestion("");
    setQuestionStatus("Question sent to the organizers ✓");
    if (submitted) setQuestions((prev) => [submitted, ...prev]);
    setTimeout(() => setQuestionStatus(""), 3000);
  }

  const isYouTube = Boolean(youtubeId);
  const hasStream = Boolean(streamUrl);

  return (
    <div className="page-shell direct-page">
      {/* Header */}
      <div className="panel-title">
        <span>Live</span>
        <h1>Conference stream</h1>
      </div>

      {/* Live / Offline badge — only shown for HLS streams */}
      {!isYouTube && hasStream && (
        <div className="stream-summary">
          <div className={`stream-pill ${isLive ? "live" : "offline"}`}>
            {isLive ? "● LIVE" : "○ OFFLINE"}
          </div>
          <p className="stream-status">
            {isLive ? "Stream is live" : "Waiting for stream…"}
          </p>
          <button
            className="refresh-button"
            onClick={() => setRetryKey((k) => k + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {/* Player */}
      {isYouTube ? (
        <YouTubePlayer videoId={youtubeId} />
      ) : hasStream ? (
        <>
          <HlsPlayer
            streamUrl={streamUrl}
            onLive={setIsLive}
            onError={setHlsError}
            retryKey={retryKey}
          />
          {hlsError && <div className="stream-error">{hlsError}</div>}
        </>
      ) : (
        <NoStreamPlaceholder />
      )}

      {/* Info cards */}
      <div className="stream-details">
        <div className="stream-card">
          <h3>Conference broadcast</h3>
          <p>
            Official {config?.brand || "ElMoultaqa"} live stream from the main
            conference hall.
          </p>
        </div>
        <div className="stream-card">
          <h3>Stream info</h3>
          <ul>
            {isYouTube ? (
              <>
                <li>Platform: YouTube Live</li>
                <li>Quality: Auto (up to 1080p)</li>
                <li>Source: YouTube CDN</li>
              </>
            ) : (
              <>
                <li>Status: {isLive ? "Live" : "Offline"}</li>
                <li>Quality: 720p HD</li>
                <li>Source: HLS stream</li>
                <li>Retry attempts: {retryKey}</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Q&A box */}
      <div className="stream-card" style={{ marginTop: 16 }}>
        <h3>Ask a question</h3>
        <form onSubmit={handleQuestionSubmit}>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question for the presenter…"
            rows={3}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <button className="refresh-button" type="submit">
            Send question
          </button>
          {questionStatus && (
            <p style={{ marginTop: 10, color: "#0d7e52" }}>{questionStatus}</p>
          )}
        </form>

        {questions.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h4
              style={{
                marginBottom: 8,
                opacity: 0.6,
                fontSize: "0.8rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              Your submitted questions
            </h4>
            {questions.map((q, i) => (
              <div
                key={q.id || i}
                style={{
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 6,
                  marginBottom: 6,
                  fontSize: "0.9rem",
                  borderLeft: "3px solid rgba(13,126,82,0.7)",
                }}
              >
                <span style={{ opacity: 0.5, fontSize: "0.75rem" }}>
                  {q.author}
                </span>
                <p style={{ margin: "2px 0 0" }}>{q.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

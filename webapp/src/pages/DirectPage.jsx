import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import "../style/DirectPage.css";
import { submitStreamQuestion } from "../services/localService";

const STREAM_URL = "http://4.233.144.150/live/index.m3u8";

export default function DirectPage() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Connecting to stream...");
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [question, setQuestion] = useState("");
  const [questionStatus, setQuestionStatus] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let hls;
    let mounted = true;

    async function startStream() {
      setStatus("Connecting to live stream...");
      setError("");
      setIsLive(false);

      if (Hls.isSupported()) {
        hls = new Hls({
          manifestLoadingRetryDelay: 4000,
          fragLoadingRetryDelay: 4000,
          maxRetry: 5,
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (!mounted) return;
          const { type, details, fatal } = data;
          setError(`Stream error: ${type} — ${details}`);
          if (fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          if (!mounted) return;
          setStatus("Live stream ready");
          setIsLive(true);
          video.play().catch(() => {});
        });

        hls.attachMedia(video);
        hls.loadSource(STREAM_URL);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = STREAM_URL;
        video.addEventListener("loadedmetadata", () => {
          if (!mounted) return;
          setStatus("Live stream ready");
          setIsLive(true);
          video.play().catch(() => {});
        });
        video.addEventListener("error", () => {
          if (!mounted) return;
          setError("Failed to load the stream directly.");
        });
      } else {
        setError("Your browser does not support HLS playback.");
      }
    }

    startStream();

    return () => {
      mounted = false;
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.src = "";
      }
    };
  }, [retryKey]);

  async function handleQuestionSubmit(event) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;

    await submitStreamQuestion({ author: "Web User", message: trimmed });
    setQuestion("");
    setQuestionStatus("Question sent to admins.");
    setTimeout(() => setQuestionStatus(""), 2500);
  }

  return (
    <div className="page-shell direct-page">
      <div className="panel-title">
        <span>Live</span>
        <h1>Conference stream</h1>
      </div>

      <div className="stream-summary">
        <div className={`stream-pill ${isLive ? "live" : "offline"}`}>
          {isLive ? "LIVE" : "OFFLINE"}
        </div>
        <p className="stream-status">{status}</p>
        <button
          className="refresh-button"
          onClick={() => setRetryKey((key) => key + 1)}
        >
          Refresh stream
        </button>
      </div>

      <div className="stream-player">
        <video
          ref={videoRef}
          controls
          playsInline
          className="video-element"
          poster=""
        />
        {error && <div className="stream-error">{error}</div>}
      </div>

      <div className="stream-details">
        <div className="stream-card">
          <h3>Conference broadcast</h3>
          <p>Official ElMoultaqa live stream from the main conference hall.</p>
        </div>
        <div className="stream-card">
          <h3>Video info</h3>
          <ul>
            <li>Status: {isLive ? "Live" : "Offline"}</li>
            <li>Quality: 720p HD</li>
            <li>Source: HLS stream</li>
            <li>Retry attempts: {retryKey}</li>
          </ul>
        </div>
      </div>

      <div className="stream-card" style={{ marginTop: 16 }}>
        <h3>Ask a question</h3>
        <form onSubmit={handleQuestionSubmit}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Type your question for the presenter..."
            rows={3}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <button className="refresh-button" type="submit">
            Send question
          </button>
          {questionStatus && <p style={{ marginTop: 10 }}>{questionStatus}</p>}
        </form>
      </div>
    </div>
  );
}

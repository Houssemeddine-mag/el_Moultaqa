import { useState, useEffect, useRef, useCallback } from "react";
import {
  fetchStreams,
  fetchStreamQuestions,
  fetchAllPrograms,
  submitStreamQuestion,
} from "../services/localService";
import { useAuth } from "../context/AuthContext";
import "../style/LivePage.css";

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = p.exec(url);
    if (m?.[1]) return m[1];
  }
  return null;
}

function formatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function LivePage() {
  const { user } = useAuth();
  const [streams, setStreams] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("stream");
  const [questions, setQuestions] = useState([]);
  const [qText, setQText] = useState("");
  const [qSending, setQSending] = useState(false);
  const [qSent, setQSent] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, p] = await Promise.all([
          fetchStreams(),
          fetchAllPrograms(),
        ]);
        setStreams(s || []);
        setPrograms(p || []);
      } catch (e) {
        console.error("[LivePage] load error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    (async () => {
      const qs = await fetchStreamQuestions(selected.id);
      setQuestions(qs || []);
    })();
  }, [selected]);

  const linkedSession = useCallback(() => {
    if (!selected || programs.length === 0) return null;
    for (const session of programs) {
      if (session.streamId === selected.id) {
        const now = new Date();
        const nowMin = now.getHours() * 60 + now.getMinutes();
        let activePres = null;
        for (const conf of session.conferences || []) {
          if (!conf.start || !conf.end) continue;
          const sp = conf.start.split(":").map(Number);
          const ep = conf.end.split(":").map(Number);
          if (sp.length < 2 || ep.length < 2) continue;
          const startMin = sp[0] * 60 + sp[1];
          const endMin = ep[0] * 60 + ep[1];
          if (nowMin >= startMin && nowMin <= endMin) {
            activePres = conf.title;
            break;
          }
        }
        return { sessionTitle: session.title, presentationTitle: activePres };
      }
    }
    return null;
  }, [selected, programs]);

  const linked = linkedSession();

  async function handleSendQuestion(e) {
    e?.preventDefault();
    const trimmed = qText.trim();
    if (!trimmed) return;
    setQSending(true);
    setQSent(false);
    try {
      await submitStreamQuestion({
        author: user?.displayName || "Attendee",
        clerkUserId: user?.uid || null,
        message: trimmed,
        streamId: selected?.id || null,
        sessionTitle: linked?.sessionTitle || null,
        presentationTitle: linked?.presentationTitle || null,
      });
      const qs = await fetchStreamQuestions(selected?.id);
      setQuestions(qs || []);
      setQText("");
      setQSent(true);
      setTimeout(() => setQSent(false), 2000);
    } catch (e) {
      console.error("[LivePage] send question error:", e);
    } finally {
      setQSending(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell live-page">
        <div className="status-panel">Loading streams…</div>
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="page-shell live-page">
        <div className="page-header">
          <h1>Live Streams</h1>
          <p>No live streams available right now. Check back later.</p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="page-shell live-page">
        <div className="page-header">
          <h1>Live Streams</h1>
          <p>Select a stream to watch and ask questions.</p>
        </div>
        <div className="streams-grid">
          {streams.map((s) => {
            const session = programs.find((p) => p.streamId === s.id);
            return (
              <button
                key={s.id}
                className="stream-card"
                onClick={() => setSelected(s)}
              >
                <div className="stream-card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="stream-card-body">
                  <div className="stream-card-title-row">
                    <h3>{s.name}</h3>
                    <span className="live-badge">
                      <span className="live-dot" />
                      Live
                    </span>
                  </div>
                  {session && (
                    <p className="stream-card-session">{session.title}</p>
                  )}
                  <p className="stream-card-url">{s.url}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const videoId = extractVideoId(selected.url);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`
    : null;

  return (
    <div className="page-shell live-page">
      <div className="live-player-shell">
        <button className="back-to-streams" onClick={() => setSelected(null)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All streams
        </button>
        <div className="player-container">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={selected.name}
              className="youtube-player"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <div className="player-placeholder">
              <p>Invalid stream URL</p>
              <p className="stream-url-display">{selected.url}</p>
            </div>
          )}
        </div>
      </div>

      <div className="live-tabs">
        <button
          className={`live-tab ${tab === "stream" ? "active" : ""}`}
          onClick={() => setTab("stream")}
        >
          Stream
        </button>
        <button
          className={`live-tab ${tab === "questions" ? "active" : ""}`}
          onClick={() => setTab("questions")}
        >
          Questions{questions.length > 0 ? ` (${questions.length})` : ""}
        </button>
      </div>

      {tab === "stream" && (
        <div className="stream-info-panel">
          <div className="stream-info-header">
            <h2>{selected.name}</h2>
            <span className="live-badge large">
              <span className="live-dot" />
              Live
            </span>
          </div>
          {linked && (
            <p className="stream-info-session">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {linked.sessionTitle}
              {linked.presentationTitle && (
                <> &mdash; <strong>{linked.presentationTitle}</strong></>
              )}
            </p>
          )}
          <div className="stream-info-url">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <a href={selected.url} target="_blank" rel="noopener noreferrer">
              {selected.url}
            </a>
          </div>
        </div>
      )}

      {tab === "questions" && (
        <div className="questions-panel">
          <div className="questions-list">
            {questions.length === 0 ? (
              <div className="questions-empty">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <h3>No questions yet</h3>
                <p>Ask the first question below!</p>
              </div>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="question-card">
                  <div className="question-card-top">
                    <span className="question-author">{q.author}</span>
                    <span className="question-time">
                      {formatTime(q.createdAt)}
                    </span>
                  </div>
                  <p className="question-message">{q.message}</p>
                  {q.isAnswered && q.answer && (
                    <div className="question-answer">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {q.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <form className="questions-input-bar" onSubmit={handleSendQuestion}>
            <input
              ref={inputRef}
              type="text"
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder={`Ask a question about ${selected.name}…`}
              disabled={qSending}
            />
            <button
              type="submit"
              className="send-button"
              disabled={qSending || !qText.trim()}
            >
              {qSending ? (
                <span className="sending-spinner" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
          {qSent && <p className="question-sent-toast">Question sent!</p>}
        </div>
      )}
    </div>
  );
}

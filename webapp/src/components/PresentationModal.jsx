import { useEffect, useMemo, useState } from "react";
import {
  fetchPresentationFeedback,
  submitPresentationFeedback,
} from "../services/localService";

function formatDateTime(value) {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

function maskEmail(email) {
  if (!email || typeof email !== "string") return "Attendee";
  const [local, domain] = email.split("@");
  if (!domain) return "Attendee";
  const shown = local.slice(0, 2) || "*";
  return `${shown}***@${domain}`;
}

export default function PresentationModal({
  presentation,
  sessionTitle,
  sessionDate,
  userEmail,
  onClose,
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [feedbackError, setFeedbackError] = useState("");

  const presentationKey = presentation?.id || "";

  useEffect(() => {
    let active = true;
    async function load() {
      if (!presentationKey) {
        setLoadingFeedback(false);
        return;
      }
      try {
        setLoadingFeedback(true);
        setFeedbackError("");
        const list = await fetchPresentationFeedback(presentationKey);
        if (active) setFeedback(list);
      } catch (err) {
        console.error("[PresentationModal] failed to load feedback:", err);
        if (active) setFeedbackError("Could not load ratings. Please retry.");
      } finally {
        if (active) setLoadingFeedback(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [presentationKey]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { average, count } = useMemo(() => {
    const rated = feedback.filter((f) => f.rating > 0);
    if (rated.length === 0) return { average: 0, count: 0 };
    const sum = rated.reduce((acc, f) => acc + f.rating, 0);
    return { average: sum / rated.length, count: rated.length };
  }, [feedback]);

  const comments = useMemo(
    () => feedback.filter((f) => f.comment && f.comment.trim()),
    [feedback]
  );

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitOk("");
    if (!rating) {
      setSubmitError("Please select a star rating first.");
      return;
    }
    try {
      setSubmitting(true);
      const saved = await submitPresentationFeedback({
        presentationKey,
        rating,
        comment,
        userEmail,
      });
      setFeedback((prev) => [saved, ...prev]);
      setSubmitOk("Thanks! Your rating was saved.");
      setRating(0);
      setComment("");
    } catch (err) {
      console.error("[PresentationModal] submit failed:", err);
      const msg = err?.message || "";
      setSubmitError(
        msg.includes("not authenticated")
          ? "Your session expired. Please sign in again."
          : msg.includes("not registered")
            ? "Your account is not registered for this conference."
            : msg || "Could not save your rating. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const timeLabel =
    presentation?.time ||
    [presentation?.start, presentation?.end].filter(Boolean).join(" - ") ||
    "";

  return (
    <div
      className="presentation-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={presentation?.title || "Presentation details"}
    >
      <div
        className="presentation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="presentation-modal-close"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>

        <span className="presentation-modal-eyebrow">Presentation</span>
        <h2 className="presentation-modal-title">
          {presentation?.title || "Untitled presentation"}
        </h2>
        {presentation?.presenter ? (
          <p className="presentation-modal-presenter">
            {presentation.presenter}
            {presentation?.affiliation ? ` · ${presentation.affiliation}` : ""}
          </p>
        ) : null}

        <div className="presentation-modal-meta">
          {sessionTitle ? <span>Session: {sessionTitle}</span> : null}
          {sessionDate ? <span>Date: {sessionDate}</span> : null}
          {timeLabel ? <span>Time: {timeLabel}</span> : null}
          {presentation?.room ? <span>Room: {presentation.room}</span> : null}
        </div>

        {presentation?.resume || presentation?.description ? (
          <p className="presentation-modal-resume">
            {presentation.resume || presentation.description}
          </p>
        ) : null}

        <div className="presentation-modal-rating-summary">
          {count > 0 ? (
            <>
              <span className="presentation-modal-stars-static">
                {"★".repeat(Math.round(average))}
                {"☆".repeat(5 - Math.round(average))}
              </span>
              <span>
                {average.toFixed(1)} out of 5 · {count} rating
                {count === 1 ? "" : "s"}
              </span>
            </>
          ) : (
            <span>No ratings yet — be the first!</span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="presentation-modal-form">
          <h3>Rate this presentation</h3>
          <div
            className="presentation-modal-star-row"
            role="radiogroup"
            aria-label="Rate out of 5 stars"
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  className={`presentation-modal-star ${active ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                  ★
                </button>
              );
            })}
          </div>
          <textarea
            className="presentation-modal-textarea"
            placeholder="Leave a comment (optional)…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            maxLength={1000}
          />
          {submitError ? (
            <p className="presentation-modal-error">{submitError}</p>
          ) : null}
          {submitOk ? (
            <p className="presentation-modal-success">{submitOk}</p>
          ) : null}
          <button
            type="submit"
            className="presentation-modal-submit"
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Submit rating"}
          </button>
        </form>

        <div className="presentation-modal-comments">
          <h3>Comments ({comments.length})</h3>
          {loadingFeedback ? (
            <p className="presentation-modal-muted">Loading feedback…</p>
          ) : feedbackError ? (
            <p className="presentation-modal-error">{feedbackError}</p>
          ) : comments.length === 0 ? (
            <p className="presentation-modal-muted">No comments yet.</p>
          ) : (
            <ul>
              {comments.map((f) => (
                <li key={f.id} className="presentation-modal-comment">
                  <div className="presentation-modal-comment-head">
                    <strong>{maskEmail(f.userEmail)}</strong>
                    {f.rating > 0 ? (
                      <span className="presentation-modal-comment-stars">
                        {"★".repeat(f.rating)}{"☆".repeat(5 - f.rating)}
                      </span>
                    ) : null}
                    {f.createdAt ? (
                      <span className="presentation-modal-muted">
                        {formatDateTime(f.createdAt)}
                      </span>
                    ) : null}
                  </div>
                  <p>{f.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

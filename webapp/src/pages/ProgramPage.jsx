import { useCallback, useEffect, useMemo, useState } from "react";
import "../style/ProgramPage.css";
import { fetchAllPrograms, isServiceReady, subscribePrograms } from "../services/localService";
import { useAuth } from "../context/AuthContext.jsx";
import PresentationModal from "../components/PresentationModal.jsx";

function formatTabLabel(date) {
  try {
    const parsed = new Date(date);
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${weekdays[parsed.getDay()]} ${parsed.getDate()}/${parsed.getMonth() + 1}`;
  } catch (error) {
    return date;
  }
}

function formatTime(start, end) {
  if (!start) return "TBD";
  return end ? `${start} - ${end}` : start;
}

function formatConferenceTime(conference) {
  if (conference?.time) return conference.time;
  if (conference?.start || conference?.end) {
    const start = conference.start || "";
    const end = conference.end ? ` - ${conference.end}` : "";
    return `${start}${end}`.trim() || null;
  }
  return null;
}

function getProgramEndTime(program) {
  try {
    const dateString = program.date || "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;

    if (program.end) {
      const [hour, minute] = program.end.split(":").map(Number);
      if (!Number.isNaN(hour) && !Number.isNaN(minute)) {
        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hour,
          minute,
        );
      }
    }

    return date;
  } catch {
    return null;
  }
}

function getProgramStatus(program) {
  const endTime = getProgramEndTime(program);
  if (!endTime) return "Scheduled";

  const now = new Date();
  if (now > endTime) return "Finished";

  const diff = endTime.getTime() - now.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (hours > 0) {
    return `Ends in ${hours}h ${remaining}m`;
  }
  if (remaining > 0) {
    return `Ends in ${remaining}m`;
  }
  return "Ending soon";
}

function groupProgramsByDate(programs) {
  return programs.reduce((grouped, program) => {
    const date = program.date || "TBA";
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(program);
    return grouped;
  }, {});
}

function getProgramDateTime(program, which) {
  try {
    if (!program.date) return null;
    const t = which === "end" ? program.end : program.start;
    if (!t) return null;
    const d = new Date(`${program.date}T${t}:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function isLiveNow(program) {
  const start = getProgramDateTime(program, "start");
  const end = getProgramDateTime(program, "end");
  if (!start || !end) return false;
  const now = new Date();
  return now >= start && now <= end;
}

function isToday(dateStr) {
  try {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    return dateStr === today;
  } catch {
    return false;
  }
}

function formatDayPill(date) {
  try {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return {
      weekday: weekdays[parsed.getDay()],
      dayNum: parsed.getDate(),
      month: months[parsed.getMonth()],
    };
  } catch {
    return null;
  }
}

function formatDateRange(dates) {
  if (dates.length === 0) return "";
  if (dates.length === 1) {
    try {
      return new Date(dates[0]).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dates[0];
    }
  }
  try {
    const first = new Date(dates[0]).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    const last = new Date(dates[dates.length - 1]).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${first} – ${last}`;
  } catch {
    return `${dates[0]} – ${dates[dates.length - 1]}`;
  }
}

function getImageSrc(base64String) {
  if (!base64String) return null;
  if (base64String.startsWith("data:")) return base64String;
  return `data:image/jpeg;base64,${base64String}`;
}

export default function ProgramPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const { user } = useAuth();

  const applyPrograms = useCallback((allPrograms) => {
    setPrograms(allPrograms);
    setLoading(false);
    setError("");
    if (allPrograms.length > 0) {
      const uniqueDates = [...new Set(allPrograms.map((p) => p.date))].sort();
      setSelectedDate((current) => {
        if (current && uniqueDates.includes(current)) return current;
        return uniqueDates[0] || "";
      });
    }
  }, []);

  useEffect(() => {
    let active = true;
    let unsubscribe = null;
    let initTimer = null;
    let attempts = 0;

    async function loadMainPrograms() {
      // ConferenceProvider initializes Supabase async — wait briefly instead of failing.
      while (active && !isServiceReady() && attempts < 40) {
        attempts += 1;
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!active) return;
      if (!isServiceReady()) {
        setError("Connecting to conference data… still initializing. Please wait or retry.");
        setLoading(false);
        return;
      }
      try {
        const allPrograms = await fetchAllPrograms();
        if (!active) return;
        applyPrograms(allPrograms);
      } catch (err) {
        console.error("[ProgramPage] initial load failed:", err);
        if (!active) return;
        const msg = err?.message || "";
        if (msg.includes("Supabase not initialized")) {
          setError("Connecting to conference data… please retry in a moment.");
        } else if (msg.includes("not authenticated")) {
          setError("Your session expired or is missing. Please sign out and sign in again, then retry.");
        } else if (msg.includes("not a registered user")) {
          setError("Your account is not registered for this conference. Please use your registration link, then retry.");
        } else {
          setError("Unable to load program. Please check your connection and retry.");
        }
        setLoading(false);
      }
    }

    loadMainPrograms();

    // Defer subscription until service is ready so we don't report a
    // spurious "realtime failed" during the init race.
    const waitForService = setInterval(() => {
      if (!active) {
        clearInterval(waitForService);
        return;
      }
      if (isServiceReady()) {
        clearInterval(waitForService);
        unsubscribe = subscribePrograms(
          (updatedPrograms) => {
            if (!active) return;
            applyPrograms(updatedPrograms);
          },
          (err) => {
            console.error("[ProgramPage] program refresh failed:", err);
            if (!active) return;
            const msg = err?.message || "";
            const friendly = msg.includes("not authenticated")
              ? "Your session expired or is missing. Please sign out and sign in again, then retry."
              : msg.includes("not a registered user")
                ? "Your account is not registered for this conference. Please use your registration link, then retry."
                : "Unable to load program. Please check your connection and retry.";
            // Only surface errors once we already have data; otherwise the
            // initial loader owns the error state. Never claim "realtime failed"
            // when it's just a transient fetch error.
            setPrograms((current) => {
              if (current.length === 0) {
                setError(friendly);
                setLoading(false);
              }
              return current;
            });
          },
        );
      }
    }, 300);

    initTimer = waitForService;

    return () => {
      active = false;
      if (initTimer) clearInterval(initTimer);
      if (unsubscribe) unsubscribe();
    };
  }, [applyPrograms, retryKey]);

  const programsByDate = useMemo(() => {
    const grouped = groupProgramsByDate(programs);
    const sortedGroups = Object.keys(grouped)
      .sort()
      .reduce((acc, date) => {
        const items = grouped[date].slice().sort((a, b) => {
          return (a.start || "").localeCompare(b.start || "");
        });
        acc[date] = items;
        return acc;
      }, {});
    return sortedGroups;
  }, [programs]);

  const dates = Object.keys(programsByDate);
  const selectedPrograms = selectedDate
    ? programsByDate[selectedDate] || []
    : [];

  const [expandedProgramId, setExpandedProgramId] = useState(null);
  const [query, setQuery] = useState("");

  const totalPresentations = programs.reduce(
    (sum, program) => sum + (program.conferences?.length || 0),
    0,
  );
  const keynoteCount = programs.filter(
    (program) => program.keynote?.name,
  ).length;

  const liveSession = useMemo(() => {
    return (
      selectedPrograms.find((p) => isLiveNow(p)) ||
      programs.find((p) => isLiveNow(p)) ||
      null
    );
  }, [selectedPrograms, programs]);

  const visiblePrograms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return selectedPrograms;
    return selectedPrograms.filter((program) => {
      const haystack = [
        program.title,
        program.room,
        program.keynote?.name,
        ...(program.chairs || []),
        ...(program.conferences || []).flatMap((c) => [
          c.title,
          c.presenter,
          c.affiliation,
          c.room,
        ]),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [selectedPrograms, query]);

  const finishedCount = useMemo(
    () => selectedPrograms.filter((p) => getProgramStatus(p) === "Finished").length,
    [selectedPrograms]
  );

  const toggleProgramExpansion = (programId, hasPresentations) => {
    if (!hasPresentations) return;
    setExpandedProgramId((current) =>
      current === programId ? null : programId,
    );
  };

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  return (
    <div className="page-shell program-page">
      <header className="program-hero">
        <div className="program-hero-copy">
          <span className="program-eyebrow">Program</span>
          <h1>Conference schedule</h1>
          {programs.length > 0 ? (
            <>
              <p className="program-hero-dates">{formatDateRange(dates)}</p>
              <div className="program-hero-stats">
                <span><strong>{programs.length}</strong> sessions</span>
                <span className="program-hero-dot" aria-hidden="true">·</span>
                <span><strong>{totalPresentations}</strong> presentations</span>
                <span className="program-hero-dot" aria-hidden="true">·</span>
                <span><strong>{keynoteCount}</strong> keynotes</span>
              </div>
            </>
          ) : null}
        </div>
        {liveSession ? (
          <div className="program-live-banner" role="status">
            <span className="program-live-dot" aria-hidden="true" />
            <div>
              <strong>Live now</strong>
              <p>{liveSession.title}{liveSession.end ? ` · ends ${liveSession.end}` : ""}</p>
            </div>
          </div>
        ) : null}
        {error && programs.length > 0 ? (
          <button
            type="button"
            onClick={handleRetry}
            className="program-retry-ghost"
          >
            Retry
          </button>
        ) : null}
      </header>

      {error && programs.length > 0 ? (
        <div className="program-empty-state" style={{ padding: "16px 20px", gap: 8 }}>
          <p style={{ margin: 0, opacity: 0.8 }}>Refresh failed: {error}</p>
        </div>
      ) : null}

      {loading && programs.length === 0 ? (
        <div className="program-center">
          <div className="program-spinner" />
          <p>Loading program...</p>
          <p style={{ opacity: 0.65, fontSize: "0.9rem" }}>Connecting to conference data…</p>
        </div>
      ) : error && programs.length === 0 ? (
        <div className="program-empty-state">
          <div className="program-empty-icon">⚠️</div>
          <h2>Unable to load program</h2>
          <p>{error}</p>
          <p>Admin edits go live automatically — no need to hard-reload.</p>
          <button
            type="button"
            onClick={handleRetry}
            style={{ marginTop: 8, padding: "12px 22px", borderRadius: 12, border: "none", background: "var(--accent-dark)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      ) : programs.length === 0 ? (
        <div className="program-empty-state">
          <div className="program-empty-icon">📅</div>
          <h2>No program available</h2>
          <p>The program will be published soon by the organizers.</p>
          <p>This page will update automatically.</p>
        </div>
      ) : (
        <>
          <div className="program-daybar">
            <div className="program-tabs" role="tablist" aria-label="Conference days">
              {dates.map((date) => {
                const pill = formatDayPill(date);
                const count = programsByDate[date].length;
                const today = isToday(date);
                return (
                  <button
                    key={date}
                    role="tab"
                    aria-selected={date === selectedDate}
                    className={date === selectedDate ? "program-tab active" : "program-tab"}
                    onClick={() => {
                      setSelectedDate(date);
                      setExpandedProgramId(null);
                    }}
                  >
                    {pill ? (
                      <>
                        <small>{pill.weekday}{today ? " · Today" : ""}</small>
                        <span>{pill.dayNum} {pill.month}</span>
                        <em>{count} session{count > 1 ? "s" : ""}</em>
                      </>
                    ) : (
                      <>
                        <small>Day</small>
                        <span>{formatTabLabel(date)}</span>
                        <em>{count} session{count > 1 ? "s" : ""}</em>
                      </>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="program-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search sessions, speakers, rooms…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search sessions"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  ✕
                </button>
              ) : null}
            </div>
          </div>

          <p className="program-day-progress">
            {finishedCount} of {selectedPrograms.length} sessions finished
            {query.trim() ? ` · ${visiblePrograms.length} matching “${query.trim()}”` : ""}
          </p>

          {visiblePrograms.length === 0 ? (
            <div className="program-empty-state">
              <div className="program-empty-icon">🔍</div>
              <h2>No matches</h2>
              <p>Nothing on this day matches “{query.trim()}”. Try another keyword or day.</p>
            </div>
          ) : (
          <div className="program-timeline">
            {visiblePrograms.map((program) => {
              const hasPresentations = program.conferences?.length > 0;
              const isExpanded = expandedProgramId === program.id;
              const live = isLiveNow(program);
              const status = getProgramStatus(program);

              return (
                <div key={program.id} className="program-timeline-row">
                  <div className="program-timeline-rail" aria-hidden="true">
                    <span className={`program-timeline-dot ${live ? "live" : status === "Finished" ? "done" : ""}`} />
                  </div>
                  <article
                    className={`program-card ${hasPresentations ? "clickable" : ""} ${live ? "is-live" : ""}`}
                    onClick={() =>
                      toggleProgramExpansion(program.id, hasPresentations)
                    }
                  >
                  <div className="program-card-header">
                    <div className="program-time-pill">
                      {formatTime(program.start, program.end)}
                    </div>
                    <div className="program-chip-row">
                      {live ? (
                        <span className="program-status live">● Live now</span>
                      ) : (
                        <span
                          className={`program-status ${status === "Finished" ? "finished" : program.end ? "ongoing" : "scheduled"}`}
                        >
                          {status}
                        </span>
                      )}
                      {program.keynote?.name ? (
                        <span className="program-keynote-chip">★ Keynote</span>
                      ) : null}
                    </div>
                  </div>

                  {program.room ? (
                    <div className="program-room-chip">📍 {program.room}</div>
                  ) : null}

                  <div className="program-title-row">
                    <h2>{program.title}</h2>
                    {hasPresentations ? (
                      <span className="program-touch-icon" aria-hidden="true">
                        {isExpanded ? "▾" : "▸"}
                      </span>
                    ) : null}
                  </div>

                  {program.keynote?.name ? (
                    <div className="program-keynote-row">
                      <div className="program-keynote-avatar">
                        {program.keynote.image ? (
                          <img
                            src={getImageSrc(program.keynote.image)}
                            alt={program.keynote.name}
                          />
                        ) : (
                          <span>👤</span>
                        )}
                      </div>
                      <div>
                        <div className="program-keynote-title">
                          Keynote Speaker: {program.keynote.name}
                        </div>
                        {program.keynote.affiliation ? (
                          <div className="program-keynote-affiliation">
                            {program.keynote.affiliation}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {program.chairs?.length ? (
                    <div className="program-row">
                      <span>Chaired by:</span>
                      <strong>{program.chairs.join(", ")}</strong>
                    </div>
                  ) : null}

                  <div className="program-row">
                    <span>
                      {program.conferences?.length || 0} presentation
                      {(program.conferences?.length || 0) > 1 ? "s" : ""}
                    </span>
                  </div>

                  {hasPresentations && isExpanded ? (
                    <div className="program-conference-list">
                      {program.conferences.map((conference, index) => {
                        const conferenceTime = formatConferenceTime(conference);
                        return (
                          <div
                            key={conference.id || index}
                            className="program-conference-item clickable"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPresentation({
                                conference,
                                sessionTitle: program.title,
                                sessionDate: program.date,
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedPresentation({
                                  conference,
                                  sessionTitle: program.title,
                                  sessionDate: program.date,
                                });
                              }
                            }}
                          >
                            <div className="program-conference-meta">
                              {conferenceTime ? (
                                <span className="program-conference-time">
                                  {conferenceTime}
                                </span>
                              ) : null}
                              {conference.room ? (
                                <span className="program-conference-room">
                                  Room: {conference.room}
                                </span>
                              ) : null}
                            </div>
                            <div className="program-conference-title">
                              {conference.title ||
                                conference.presenter ||
                                `Presentation ${index + 1}`}
                            </div>
                            {conference.presenter ? (
                              <div className="program-conference-presenter">
                                {conference.presenter}
                              </div>
                            ) : null}
                            <span className="program-conference-cta">
                              View details & rate →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                  </article>
                </div>
              );
            })}
          </div>
          )}
        </>
      )}
      {selectedPresentation ? (
        <PresentationModal
          presentation={selectedPresentation.conference}
          sessionTitle={selectedPresentation.sessionTitle}
          sessionDate={selectedPresentation.sessionDate}
          userEmail={user?.email || ""}
          onClose={() => setSelectedPresentation(null)}
        />
      ) : null}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import "../style/ProgramPage.css";
import { fetchAllPrograms, subscribePrograms } from "../services/localService";

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

  useEffect(() => {
    let active = true;

    async function loadMainPrograms() {
      try {
        const allPrograms = await fetchAllPrograms();
        if (!active) return;
        setPrograms(allPrograms);
        setLoading(false);
        setError("");
        if (allPrograms.length > 0) {
          const firstDate = [
            ...new Set(allPrograms.map((program) => program.date)),
          ].sort()[0];
          setSelectedDate(firstDate);
        }
      } catch (err) {
        console.error(err);
        if (!active) return;
        setError("Unable to load program data from the template backend.");
        setLoading(false);
      }
    }

    loadMainPrograms();

    const unsubscribe = subscribePrograms(
      (updatedPrograms) => {
        if (!active) return;
        setPrograms(updatedPrograms);
        setLoading(false);
        setError("");
        const uniqueDates = [
          ...new Set(updatedPrograms.map((program) => program.date)),
        ].sort();
        setSelectedDate((current) => {
          if (current && uniqueDates.includes(current)) return current;
          return uniqueDates[0] || "";
        });
      },
      (err) => {
        console.error(err);
        if (!active) return;
        setError("Real-time connection failed for program data.");
        setLoading(false);
      },
    );

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

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

  const totalPresentations = programs.reduce(
    (sum, program) => sum + (program.conferences?.length || 0),
    0,
  );
  const keynoteCount = programs.filter(
    (program) => program.keynote?.name,
  ).length;

  const toggleProgramExpansion = (programId, hasPresentations) => {
    if (!hasPresentations) return;
    setExpandedProgramId((current) =>
      current === programId ? null : programId,
    );
  };

  return (
    <div className="page-shell program-page">
      <div className="program-topbar">
        <div>
          <h1>Conference schedule</h1>
        </div>
      </div>

      {loading && programs.length === 0 ? (
        <div className="program-center">
          <div className="program-spinner" />
          <p>Loading program...</p>
        </div>
      ) : error && programs.length === 0 ? (
        <div className="program-empty-state">
          <div className="program-empty-icon">⚠️</div>
          <h2>Unable to load program</h2>
          <p>{error}</p>
          <p>Data will update automatically.</p>
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
          <div className="program-overview-grid">
            <div className="program-stat-card">
              <span>Presentations</span>
              <strong>{totalPresentations}</strong>
              <p>All presentations across the program.</p>
            </div>
            <div className="program-stat-card">
              <span>Keynotes</span>
              <strong>{keynoteCount}</strong>
              <p>Featured keynote sessions in the schedule.</p>
            </div>
          </div>

          <div className="program-tabs">
            {dates.map((date) => (
              <button
                key={date}
                className={
                  date === selectedDate ? "program-tab active" : "program-tab"
                }
                onClick={() => setSelectedDate(date)}
              >
                <span>{formatTabLabel(date)}</span>
                <small>
                  {programsByDate[date].length} session
                  {programsByDate[date].length > 1 ? "s" : ""}
                </small>
              </button>
            ))}
          </div>

          <div className="program-list">
            {selectedPrograms.map((program) => {
              const hasPresentations = program.conferences?.length > 0;
              const isExpanded = expandedProgramId === program.id;

              return (
                <article
                  key={program.id}
                  className={`program-card ${hasPresentations ? "clickable" : ""}`}
                  onClick={() =>
                    toggleProgramExpansion(program.id, hasPresentations)
                  }
                >
                  <div className="program-card-header">
                    <div className="program-time-pill">
                      {formatTime(program.start, program.end)}
                    </div>
                    <div className="program-chip-row">
                      <span
                        className={`program-status ${getProgramStatus(program) === "Finished" ? "finished" : program.end ? "ongoing" : "scheduled"}`}
                      >
                        {getProgramStatus(program)}
                      </span>
                      {program.keynote?.name ? (
                        <span className="program-keynote-chip">Keynote</span>
                      ) : null}
                    </div>
                  </div>

                  {program.room ? (
                    <div className="program-room-chip">{program.room}</div>
                  ) : null}

                  <div className="program-title-row">
                    <h2>{program.title}</h2>
                    {hasPresentations ? (
                      <span className="program-touch-icon">👆</span>
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
                            className="program-conference-item"
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
                          </div>
                        );
                      })}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

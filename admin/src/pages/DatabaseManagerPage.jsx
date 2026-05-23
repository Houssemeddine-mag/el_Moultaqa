import { useMemo, useState } from "react";

const initialCollections = {
  notifications: [{ id: "n1", title: "Welcome Alert", message: "App onboarding is live." }],
  programs: [{ id: "p1", title: "Opening Keynote", speaker: "Leila R.", date: "2026-07-12" }],
  ratings: [{ id: "r1", programId: "p1", rating: 5, comment: "Excellent." }],
  presentationAnalytics: [{ id: "a1", programId: "p1", views: 230, downloads: 41 }],
  questions: [{ id: "q1", programId: "p1", question: "Will slides be shared?", status: "Answered" }],
  liveNotifications: [{ id: "l1", title: "Stage Update", body: "Stage 2 starts in 10 minutes." }],
  pushNotifications: [{ id: "push1", title: "Reminder", body: "Session begins in 5 minutes." }],
  users: [{ id: "u1", email: "amira.haddad@example.com", name: "Amira Haddad" }],
  userProfiles: [{ id: "up1", userId: "u1", fullName: "Amira Haddad", organization: "Event Team" }],
};

const DatabaseManagerPage = () => {
  const [collections, setCollections] = useState(initialCollections);
  const [statusMessage, setStatusMessage] = useState("Ready to manage local database views.");
  const [loading, setLoading] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");

  const stats = useMemo(() => {
    return {
      notifications: collections.notifications.length,
      programs: collections.programs.length,
      ratings: collections.ratings.length,
      presentationAnalytics: collections.presentationAnalytics.length,
      questions: collections.questions.length,
      liveNotifications: collections.liveNotifications.length,
      pushNotifications: collections.pushNotifications.length,
      users: collections.users.length,
      userProfiles: collections.userProfiles.length,
    };
  }, [collections]);

  const actionLabels = {
    notifications: "CLEAR_NOTIFICATIONS",
    programs: "CLEAR_PROGRAMS",
    ratings: "CLEAR_RATINGS",
    presentationAnalytics: "CLEAR_ANALYTICS",
    questions: "CLEAR_QUESTIONS",
    liveNotifications: "CLEAR_LIVE_NOTIFICATIONS",
    pushNotifications: "CLEAR_PUSH_NOTIFICATIONS",
    all: "CLEAR_ALL_DATA",
  };

  const clearCollection = (collectionKey) => {
    const expected = actionLabels[collectionKey];
    if (confirmInput !== expected) {
      setStatusMessage(`Type ${expected} to confirm the reset.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCollections((prev) => ({
        ...prev,
        [collectionKey]: [],
      }));
      setStatusMessage(`${collectionKey} cleared locally.`);
      setConfirmInput("");
      setLoading(false);
    }, 300);
  };

  const clearAllCollections = () => {
    if (confirmInput !== actionLabels.all) {
      setStatusMessage(`Type ${actionLabels.all} to confirm full cleanup.`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setCollections({
        ...collections,
        notifications: [],
        programs: [],
        ratings: [],
        presentationAnalytics: [],
        questions: [],
        liveNotifications: [],
        pushNotifications: [],
      });
      setStatusMessage("All non-protected local collections cleared.");
      setConfirmInput("");
      setLoading(false);
    }, 300);
  };

  const refreshStats = () => {
    setLoading(true);
    setTimeout(() => {
      setCollections(initialCollections);
      setStatusMessage("Local collection view refreshed.");
      setLoading(false);
    }, 300);
  };

  const exportToJSON = (data, filename) => {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMessage(`Exported ${filename} locally.`);
  };

  const exportCollection = (collectionKey) => {
    const data = collections[collectionKey] || [];
    if (data.length === 0) {
      setStatusMessage(`No local records available for ${collectionKey}.`);
      return;
    }
    exportToJSON(data, collectionKey);
  };

  return (
    <div className="page-card database-page">
      <div className="page-header">
        <div>
          <h1>Database Manager</h1>
          <p className="subtitle">
            Local collection overview for conference data management.
          </p>
        </div>
      </div>

      <div className="status-banner">
        <span>{statusMessage}</span>
      </div>

      <div className="stats-grid compact">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className={`stat-card ${key.startsWith("user") ? "preserved" : ""}`}>
            <div className="stat-number">{value}</div>
            <div className="stat-label">{key.replace(/([A-Z])/g, " $1")}</div>
            {key.startsWith("user") && <div className="stat-note">Protected</div>}
          </div>
        ))}
      </div>

      <div className="controls-row database-controls">
        <button type="button" className="primary-button" onClick={refreshStats} disabled={loading}>
          Refresh Local View
        </button>
        <input
          type="text"
          value={confirmInput}
          onChange={(event) => setConfirmInput(event.target.value)}
          placeholder="Type confirmation code here"
          className="confirm-input"
        />
      </div>

      <div className="export-grid">
        <div className="export-card">
          <h3>Notifications</h3>
          <p>Export or clear the local notifications collection.</p>
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={() => exportCollection("notifications")}>Export JSON</button>
            <button
              type="button"
              className="danger-button"
              onClick={() => clearCollection("notifications")}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="export-card">
          <h3>Programs</h3>
          <p>Export or clear the local program collection.</p>
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={() => exportCollection("programs")}>Export JSON</button>
            <button type="button" className="danger-button" onClick={() => clearCollection("programs")} disabled={loading}>Clear</button>
          </div>
        </div>
        <div className="export-card">
          <h3>Ratings</h3>
          <p>Export or clear the local ratings collection.</p>
          <div className="button-row">
            <button type="button" className="secondary-button" onClick={() => exportCollection("ratings")}>Export JSON</button>
            <button type="button" className="danger-button" onClick={() => clearCollection("ratings")} disabled={loading}>Clear</button>
          </div>
        </div>
      </div>

      <div className="export-grid">
        <div className="export-card wide-card">
          <h3>Clear All Local Data</h3>
          <p>This action clears all non-protected local collections.</p>
          <button type="button" className="danger-button" onClick={clearAllCollections} disabled={loading}>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagerPage;

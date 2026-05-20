const DatabaseManagerPage = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Database Manager</h1>
          <p>Quick tools for reviewing and syncing event data.</p>
        </div>
      </div>

      <div className="grid-cards">
        <div className="card-block">
          <h3>Firestore</h3>
          <p>Review conference records, presenters, and attendee state.</p>
        </div>
        <div className="card-block">
          <h3>Users</h3>
          <p>Audit login records, profile updates, and rating participation.</p>
        </div>
        <div className="card-block">
          <h3>Content</h3>
          <p>Manage program sessions, presentations, and keynote entries.</p>
        </div>
      </div>
    </div>
  );
};

export default DatabaseManagerPage;

const KeynoteInApp = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Keynote In App</h1>
          <p>
            Configure the keynote experience displayed inside the mobile event
            app.
          </p>
        </div>
      </div>

      <div className="table-card glass-card">
        <h2>Keynote Status</h2>
        <ul className="info-list">
          <li>
            <strong>Current speaker:</strong> Dr. Nabila Y.
          </li>
          <li>
            <strong>Session:</strong> Opening Keynote
          </li>
          <li>
            <strong>Live banner:</strong> Enabled
          </li>
        </ul>
      </div>
    </div>
  );
};

export default KeynoteInApp;

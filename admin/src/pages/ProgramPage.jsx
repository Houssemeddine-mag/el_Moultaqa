const ProgramPage = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Program Schedule</h1>
          <p>Review and manage the event program, sessions, and timings.</p>
        </div>
      </div>

      <div className="table-card glass-card">
        <h2>Upcoming Sessions</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Session</th>
              <th>Presenter</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>09:00</td>
              <td>Opening Ceremony</td>
              <td>Admin Team</td>
              <td>Confirmed</td>
            </tr>
            <tr>
              <td>10:30</td>
              <td>Panel: AI & Innovation</td>
              <td>Trusted Guests</td>
              <td>Live</td>
            </tr>
            <tr>
              <td>13:00</td>
              <td>Workshop: Ratings Flow</td>
              <td>RIF Operations</td>
              <td>Planned</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProgramPage;

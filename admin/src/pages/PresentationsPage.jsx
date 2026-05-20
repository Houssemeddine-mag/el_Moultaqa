const PresentationsPage = () => {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Presentations</h1>
          <p>Monitor speaker submissions, ratings, and presentation details.</p>
        </div>
      </div>

      <div className="table-card glass-card">
        <h2>Active Presentation List</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Presenter</th>
              <th>Track</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Designing Inclusive AI</td>
              <td>Amina B.</td>
              <td>Innovation</td>
              <td>Pending Review</td>
            </tr>
            <tr>
              <td>Rating Systems in Practice</td>
              <td>Karim D.</td>
              <td>Data</td>
              <td>Approved</td>
            </tr>
            <tr>
              <td>Future of Event Experience</td>
              <td>Leila R.</td>
              <td>Strategy</td>
              <td>In Progress</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PresentationsPage;

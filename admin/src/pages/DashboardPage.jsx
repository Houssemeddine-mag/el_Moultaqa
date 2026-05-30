const DashboardPage = () => {
  // Template defaults: no live metrics until conference data is provided
  const metrics = [];
  const topPresenters = [];

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>ElMoultaqa Admin Dashboard</h1>
          <p className="subtitle">
            Template dashboard — metrics will appear after you create or connect
            data for a conference.
          </p>
        </div>
      </div>

      <div className="grid-cards">
        {metrics.length === 0 ? (
          <div className="page-card empty-state">
            <h3>No metrics yet</h3>
            <p className="subtitle">
              Create a conference or connect your data source to populate
              dashboard metrics.
            </p>
          </div>
        ) : (
          metrics.map((metric) => (
            <div className="stat-card" key={metric.title}>
              <h3>{metric.title}</h3>
              <p className="stat-value">{metric.value}</p>
              <p className="stat-subtitle">{metric.description}</p>
            </div>
          ))
        )}
      </div>

      <div className="page-header" style={{ marginTop: "36px" }}>
        <div>
          <h2>Top Rated Presenters</h2>
          <p className="subtitle">
            All-time presenter ranking from the most recent event.
          </p>
        </div>
      </div>

      <div className="table-card">
        {topPresenters.length === 0 ? (
          <div className="empty-state">
            <h3>No top presenters yet</h3>
            <p className="subtitle">
              Presenter rankings will show once you have session ratings.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Presenter</th>
                <th>Rating</th>
                <th>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {topPresenters.map((presenter) => (
                <tr key={presenter.name}>
                  <td>{presenter.name}</td>
                  <td>{presenter.rating}</td>
                  <td>{presenter.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

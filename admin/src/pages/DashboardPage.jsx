const DashboardPage = () => {
  const metrics = [
    {
      title: "Total Users",
      value: "4,820",
      description: "2,430 attendees and 1,890 active participants.",
    },
    {
      title: "Presentations",
      value: "128",
      description: "Review submissions and approval progress.",
    },
    {
      title: "Ratings Collected",
      value: "7,540",
      description: "Live individual ratings across all sessions.",
    },
    {
      title: "Average Score",
      value: "4.7",
      description: "Presenter and presentation satisfaction score.",
    },
  ];

  const topPresenters = [
    { name: "Amira H.", rating: 4.9, total: 18 },
    { name: "Samir B.", rating: 4.8, total: 16 },
    { name: "Noura T.", rating: 4.7, total: 14 },
  ];

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>ElMoultaqa Admin Dashboard</h1>
          <p className="subtitle">
            Live analytics for the ElMoultaqa conference administration.
          </p>
        </div>
        <div className="badge">Live Overview</div>
      </div>

      <div className="grid-cards">
        {metrics.map((metric) => (
          <div className="stat-card" key={metric.title}>
            <h3>{metric.title}</h3>
            <p className="stat-value">{metric.value}</p>
            <p className="stat-subtitle">{metric.description}</p>
          </div>
        ))}
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
      </div>
    </div>
  );
};

export default DashboardPage;

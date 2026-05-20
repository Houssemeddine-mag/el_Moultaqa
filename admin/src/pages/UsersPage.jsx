const UsersPage = () => {
  const users = [
    { name: "Amira Haddad", role: "Event Director", status: "Active" },
    { name: "Yacine Zemmouri", role: "Program Manager", status: "Active" },
    { name: "Meriem Bensalah", role: "Speaker Coordinator", status: "Pending" },
    { name: "Nabil Ouh", role: "Technical Support", status: "Active" },
  ];

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Users</h1>
          <p className="subtitle">
            Manage admin access, presenter accounts, and attendee records.
          </p>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

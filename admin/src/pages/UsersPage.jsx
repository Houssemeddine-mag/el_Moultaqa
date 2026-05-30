import { useMemo, useState } from "react";

// Template: start with empty user list until the conference provides data
const sampleUsers = [];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  const filteredUsers = useMemo(() => {
    return sampleUsers.filter((user) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.university.toLowerCase().includes(query) ||
        user.country.toLowerCase().includes(query) ||
        user.province.toLowerCase().includes(query);

      const matchesRole =
        filterRole === "All" ? true : user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole]);

  const stats = {
    totalUsers: sampleUsers.length,
    completeProfiles: sampleUsers.filter((user) => user.isProfileComplete)
      .length,
    incompleteProfiles: sampleUsers.filter((user) => !user.isProfileComplete)
      .length,
  };

  const roles = ["All"];

  return (
    <div className="page-card users-page">
      <div className="page-header">
        <div>
          <h1>User Accounts</h1>
          <p className="subtitle">
            View and manage registered users and profile completion status.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.completeProfiles}</div>
          <div className="stat-label">Complete Profiles</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.incompleteProfiles}</div>
          <div className="stat-label">Incomplete Profiles</div>
        </div>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users by name, email, university or location"
          />
        </div>
        <div className="filter-box">
          <label htmlFor="role-filter">Filter by role</label>
          <select
            id="role-filter"
            value={filterRole}
            onChange={(event) => setFilterRole(event.target.value)}
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-card users-table-card">
        <table className="data-table users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Level</th>
              <th>Country</th>
              <th>Province</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.displayName}</td>
                <td>{user.email}</td>
                <td>{user.university}</td>
                <td>{user.schoolLevel}</td>
                <td>{user.country}</td>
                <td>{user.province}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`status-chip ${user.isProfileComplete ? "complete" : "incomplete"}`}
                  >
                    {user.isProfileComplete ? "Complete" : "Incomplete"}
                  </span>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-state-row">
                  No users match your current search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;

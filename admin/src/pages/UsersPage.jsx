import { useMemo, useState, useEffect } from "react";
import backend from "../backend.js";

// Fetches real user data from the organization's users table
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Load users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const userData = await backend.getUsers();
        setUsers(userData || []);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. " + (err.message || ""));
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.clerkUserId && user.clerkUserId.toLowerCase().includes(query));

      const matchesRole =
        filterRole === "All" ? true : user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [searchTerm, filterRole, users]);

  const stats = {
    totalUsers: users.length,
    attendees: users.filter((u) => u.role === "attendee").length,
    speakers: users.filter((u) => u.role === "speaker").length,
    moderators: users.filter((u) => u.role === "moderator").length,
    admins: users.filter((u) => u.role === "admin").length,
  };

  const roles = ["All", "attendee", "speaker", "moderator", "admin"];

  return (
    <div className="page-card users-page">
      <div className="page-header">
        <div>
          <h1>User Accounts</h1>
          <p className="subtitle">
            View and manage registered users in this organization.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fee",
            color: "#c33",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.attendees}</div>
          <div className="stat-label">Attendees</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.speakers}</div>
          <div className="stat-label">Speakers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.admins}</div>
          <div className="stat-label">Admins</div>
        </div>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search users by name, email, or ID"
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
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <h3>No users found</h3>
            <p>
              {users.length === 0
                ? "No users have registered yet."
                : "No users match your current search or filter."}
            </p>
          </div>
        ) : (
          <table className="data-table users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.fullName || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "3px",
                        fontSize: "0.85em",
                        backgroundColor:
                          user.role === "admin"
                            ? "#e8f4f8"
                            : user.role === "speaker"
                            ? "#f0e8f4"
                            : user.role === "moderator"
                            ? "#f4f0e8"
                            : "#f0f0f0",
                        color:
                          user.role === "admin"
                            ? "#0066aa"
                            : user.role === "speaker"
                            ? "#663399"
                            : user.role === "moderator"
                            ? "#996633"
                            : "#333",
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(user.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;

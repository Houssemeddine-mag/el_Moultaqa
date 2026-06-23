import { useMemo, useState, useEffect } from "react";
import backend from "../backend.js";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const userData = await backend.getUsers();
        if (active) {
          setUsers(userData || []);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        if (active) {
          setError("Failed to load users: " + (err.message || ""));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchUsers();
    return () => {
      active = false;
    };
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await backend.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Error updating user role:", err);
      alert("Failed to update user role: " + (err.message || "Unknown error"));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        (user.displayName || "").toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        (user.university || "").toLowerCase().includes(query) ||
        (user.country || "").toLowerCase().includes(query) ||
        (user.province || "").toLowerCase().includes(query);

      const matchesRole =
        filterRole === "All" ? true : user.role === filterRole;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const stats = useMemo(() => {
    return {
      totalUsers: users.length,
      completeProfiles: users.filter((user) => user.isProfileComplete).length,
      incompleteProfiles: users.filter((user) => !user.isProfileComplete).length,
    };
  }, [users]);

  const roles = useMemo(() => {
    const unique = ["All", ...new Set(users.map((u) => u.role).filter(Boolean))];
    return unique;
  }, [users]);

  if (loading && users.length === 0) {
    return (
      <div className="page-card users-page">
        <div className="page-header">
          <h1>User Accounts</h1>
        </div>
        <div style={{ padding: "40px", textAlign: "center" }}>
          Loading registered user list...
        </div>
      </div>
    );
  }

  return (
    <div className="page-card users-page">
      <div className="page-header">
        <div>
          <h1>User Accounts</h1>
          <p className="subtitle">
            View and manage registered users, profiles, and administrative roles.
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
            borderRadius: "8px",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          {error}
        </div>
      )}

      <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <div className="stat-card" style={{ padding: "20px", background: "rgba(255, 255, 255, 0.8)", border: "1px solid var(--border)", borderRadius: "16px" }}>
          <div className="stat-value" style={{ fontSize: "2rem", fontWeight: "700" }}>{stats.totalUsers}</div>
          <div className="stat-subtitle">Total Users</div>
        </div>
        <div className="stat-card" style={{ padding: "20px", background: "rgba(255, 255, 255, 0.8)", border: "1px solid var(--border)", borderRadius: "16px" }}>
          <div className="stat-value" style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary)" }}>{stats.completeProfiles}</div>
          <div className="stat-subtitle">Complete Profiles</div>
        </div>
        <div className="stat-card" style={{ padding: "20px", background: "rgba(255, 255, 255, 0.8)", border: "1px solid var(--border)", borderRadius: "16px" }}>
          <div className="stat-value" style={{ fontSize: "2rem", fontWeight: "700", color: "#f59e0b" }}>{stats.incompleteProfiles}</div>
          <div className="stat-subtitle">Incomplete Profiles</div>
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
        {filteredUsers.length === 0 ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
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
                <th>University</th>
                <th>Level</th>
                <th>Location</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.displayName || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>{user.university || "—"}</td>
                  <td>{user.schoolLevel || "—"}</td>
                  <td>
                    {user.province && user.country
                      ? `${user.province}, ${user.country}`
                      : user.country || user.province || "—"}
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid rgba(13, 126, 82, 0.15)",
                        backgroundColor: "#fff",
                        color: "var(--text)",
                        fontWeight: "600",
                        cursor: "pointer",
                        outline: "none"
                      }}
                    >
                      <option value="attendee">attendee</option>
                      <option value="speaker">speaker</option>
                      <option value="moderator">moderator</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td>
                    <span
                      className={`status-chip ${user.isProfileComplete ? "complete" : "incomplete"}`}
                    >
                      {user.isProfileComplete ? "Complete" : "Incomplete"}
                    </span>
                  </td>
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

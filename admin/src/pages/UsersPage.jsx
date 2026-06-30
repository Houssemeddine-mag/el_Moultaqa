import { useMemo, useState, useEffect } from "react";
import backend from "../backend.js";
import ExportButton from "../Components/ExportButton.jsx";

const PIE_COLORS = [
  "#0d7e52", "#1fb69a", "#f59e0b", "#e74c3c", "#3498db",
  "#9b59b6", "#1abc9c", "#e67e22", "#2ecc71", "#f1c40f",
  "#34495e", "#16a085", "#c0392b", "#2980b9", "#8e44ad",
  "#d35400", "#27ae60", "#f39c12", "#7f8c8d", "#2c3e50",
];

function DonutChart({ data, size = 220, thickness = 36 }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "rgba(0,0,0,.04)", color: "var(--text)", opacity: .5, fontSize: ".85rem" }}>
        No data
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - thickness / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const fraction = d.value / total;
    const length = fraction * circumference;
    const seg = { ...d, length, offset, fraction };
    offset += length;
    return seg;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,.06)" strokeWidth={thickness} />
      {segments.map((seg, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={PIE_COLORS[i % PIE_COLORS.length]}
          strokeWidth={thickness}
          strokeDasharray={`${seg.length} ${circumference - seg.length}`}
          strokeDashoffset={-seg.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray .4s ease" }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--text)" fontSize="1.6rem" fontWeight="800">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--text)" fontSize=".75rem" opacity=".6">
        total
      </text>
    </svg>
  );
}

function Legend({ data }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1, minWidth: 180 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: ".85rem" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
          <span style={{ color: "var(--text)", opacity: .85, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.label}</span>
          <span style={{ color: "var(--text)", fontWeight: 700, whiteSpace: "nowrap" }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

const FILTER_OPTIONS = [
  { key: "gender",   label: "Gender" },
  { key: "country",  label: "Country" },
  { key: "province", label: "Wilaya (Province)" },
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [chartFilter, setChartFilter] = useState("gender");

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

  const chartData = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      let key = "";
      if (chartFilter === "gender") {
        key = u.gender ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1) : "Not set";
      } else if (chartFilter === "country") {
        key = u.country || "Not set";
      } else {
        key = u.province || "Not set";
      }
      map[key] = (map[key] || 0) + 1;
    });

    let entries = Object.entries(map).map(([label, value]) => ({ label, value }));
    entries.sort((a, b) => b.value - a.value);

    if (chartFilter === "country" && entries.length > 8) {
      const top = entries.slice(0, 7);
      const other = entries.slice(7).reduce((s, d) => s + d.value, 0);
      top.push({ label: "Other", value: other });
      entries = top;
    }

    return entries;
  }, [users, chartFilter]);

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
        <ExportButton
          data={users.map((u) => ({
            Name: u.displayName,
            Email: u.email,
            Role: u.role,
            University: u.university,
            "School Level": u.schoolLevel,
            Gender: u.gender,
            Country: u.country,
            Province: u.province,
            Phone: u.phone,
            "Profile Complete": u.isProfileComplete ? "Yes" : "No",
            "Created At": u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
          }))}
          filename="users"
        />
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

      {/* User visualization */}
      {users.length > 0 && (
        <div style={{
          background: "rgba(255,255,255,0.7)", border: "1px solid var(--border)",
          borderRadius: 16, padding: "24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: "1.05rem" }}>User Distribution</h3>
            <div style={{ display: "flex", gap: 6, background: "rgba(0,0,0,.04)", borderRadius: 10, padding: 3 }}>
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setChartFilter(opt.key)}
                  style={{
                    padding: "7px 16px", borderRadius: 8, border: "none",
                    background: chartFilter === opt.key ? "var(--surface)" : "transparent",
                    color: "var(--text)", fontWeight: chartFilter === opt.key ? 700 : 500,
                    fontSize: ".82rem", cursor: "pointer",
                    boxShadow: chartFilter === opt.key ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 40, alignItems: "center", flexWrap: "wrap" }}>
            <DonutChart data={chartData} />
            <Legend data={chartData} />
          </div>
        </div>
      )}

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

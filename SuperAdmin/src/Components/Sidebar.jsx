import { NavLink, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { superAdminConfig } from "../adminConfig";
import logo from "@logo";

const BASE = "/system";

const icons = {
  LayoutDashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="9" rx="1" />
      <rect x="14" y="3" width="7" height="5" rx="1" />
      <rect x="14" y="12" width="7" height="9" rx="1" />
      <rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Building2: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18" />
      <path d="M6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2" />
      <path d="M18 12h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
      <path d="M10 7h4" />
      <path d="M10 11h4" />
      <path d="M10 15h4" />
      <path d="M10 19h4" />
    </svg>
  ),
  CreditCard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate(`${BASE}/login`);
    } catch (error) {
      console.error("[Sidebar Logout] Error:", error);
    }
  };

  return (
    <nav className="sa-sidebar">
      <div className="sa-sidebar-header">
        <div className="sa-sidebar-brand">
          <img src={logo} alt="Logo" />
        </div>
        <div className="sa-sidebar-title">Super Admin</div>
      </div>

      <ul className="sa-sidebar-nav">
        {superAdminConfig.navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={`${BASE}${item.path}`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {icons[item.icon]}
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sa-sidebar-footer">
        <button className="sa-sidebar-logout" onClick={handleLogout}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;

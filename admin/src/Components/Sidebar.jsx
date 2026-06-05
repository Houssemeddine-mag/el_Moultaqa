import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { adminConfig } from "../adminConfig";
import logo from "@logo";

const Sidebar = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { orgSlug } = useParams();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate(`/c/${orgSlug}/admin/login`);
    } catch (error) {
      console.error("[Sidebar Logout] Error:", error);
    }
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <img src={logo} alt="Conference logo" />
        </div>
      </div>

      <ul className="sidebar-nav">
        {adminConfig.navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={`/c/${orgSlug}/admin${item.path}`}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="sidebar-logout-wrapper">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;

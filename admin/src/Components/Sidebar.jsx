import { NavLink, useNavigate } from "react-router-dom";
import { adminConfig } from "../adminConfig";
import logo from "@logo";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("rifAdminUser");
    navigate("/login");
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
              to={item.path}
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

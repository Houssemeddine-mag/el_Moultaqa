import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminConfig } from "../adminConfig";

const Topbar = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const [adminUser, setAdminUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userInfo = localStorage.getItem("rifAdminUser");
    if (userInfo) {
      setAdminUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rifAdminUser");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-brand-block">
          <div className="conference-logo">
            {adminConfig.conferenceLogo ? (
              <img src={adminConfig.conferenceLogo} alt="Conference logo" />
            ) : (
              <div className="conference-logo-placeholder">Logo</div>
            )}
          </div>
          <div className="topbar-title">
            {adminConfig.conferenceName || "Conference Name"}
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-datetime">
          <span className="topbar-time">
            {dateTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
          <span className="topbar-date">
            {dateTime.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="topbar-user-section">
          {adminUser && (
            <button
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16,17 21,12 16,7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

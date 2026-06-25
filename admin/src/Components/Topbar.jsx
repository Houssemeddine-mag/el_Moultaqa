import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { adminConfig } from "../adminConfig";
import { getConferenceConfig } from "../sharedConfig";
import defaultLogo from "@logo";

const Topbar = ({ orgDetails, eventLogo }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const [conferenceConfig, setConferenceConfig] = useState(null);
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { orgSlug } = useParams();

  const adminUser = clerkUser
    ? {
        email: clerkUser.primaryEmailAddress?.emailAddress,
      }
    : null;

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const storedConfig = getConferenceConfig();
    if (storedConfig) {
      setConferenceConfig(storedConfig);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate(`/c/${orgSlug}/admin/login`);
    } catch (error) {
      console.error("[Topbar Logout] Error:", error);
    }
  };

  // Use orgDetails name if available, otherwise fall back to conferenceConfig or default
  const displayName = orgDetails?.name || conferenceConfig?.name || adminConfig.conferenceName || "Conference";

  const logoSrc = eventLogo || conferenceConfig?.logo || orgDetails?.logo_url || adminConfig.conferenceLogo || defaultLogo;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-brand-block">
          <div className="conference-logo">
            <img src={logoSrc} alt="Conference logo" />
          </div>
          <div className="topbar-title">
            {displayName}
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
              title={`Logout (${adminUser.email})`}
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

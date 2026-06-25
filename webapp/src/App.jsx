import { useState, useEffect } from "react";
import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
  useParams,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import DirectPage from "./pages/DirectPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useConferenceConfig, ConferenceProvider } from "./context/ConferenceContext.jsx";

import {
  AuthenticateWithRedirectCallback,
  useClerk,
  useAuth as useClerkAuth,
} from "@clerk/clerk-react";
import { useClerkSupabase, resolveOrgSlug } from "@global/supabase";
import elmLogo from "@global/logo.png";
import { checkUserMembership } from "./services/localService";


function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { signOut } = useClerk();
  const supabase = useClerkSupabase();
  const { orgSlug } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    let active = true;

    async function verifyOrgSlug() {
      if (!orgSlug || !supabase) {
        if (active) setIsReady(true);
        return;
      }

      try {
        setOrgError("");
        setNeedsRegistration(false);
        const details = await resolveOrgSlug(supabase, orgSlug);
        if (!active) return;

        if (!details) {
          setOrgError(`Organization "${orgSlug}" not found.`);
          return;
        }

        if (user) {
          const isMember = await checkUserMembership(supabase, details.schema_name, user.uid);
          if (!active) return;
          if (!isMember) {
            setNeedsRegistration(true);
          }
        }
      } catch (err) {
        console.error("[ProtectedRoute] Slug verification failed:", err);
        setOrgError(
          "An error occurred while verifying the organization."
        );
      } finally {
        if (active) setIsReady(true);
      }
    }

    verifyOrgSlug();

    return () => {
      active = false;
    };
  }, [user, orgSlug, supabase]);

  if (loading || !isReady) {
    return (
      <div className="page-shell">
        <div className="status-panel">Checking organization access…</div>
      </div>
    );
  }

  if (!user || needsRegistration) {
    return <Navigate replace to={`/c/${orgSlug}/auth`} state={{ from: location }} />;
  }

  if (orgError) {
    return (
      <div className="page-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#121212", color: "#fff" }}>
        <div className="glass-card" style={{ maxWidth: "450px", padding: "3rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255, 68, 68, 0.2)", background: "rgba(255, 68, 68, 0.02)" }}>
          <div style={{ margin: "0 auto 1.5rem auto", display: "flex", justifyContent: "center", alignItems: "center", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255, 68, 68, 0.15)", color: "#ff4444" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "35px", height: "35px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.03L3.07 19.5a1.125 1.125 0 00.97 1.685h15.91a1.125 1.125 0 00.97-1.685L12 2.695zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Access Denied</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.5", fontSize: "0.95rem" }}>{orgError}</p>
          <button 
            className="secondary-button" 
            style={{ marginTop: "1.5rem", width: "100%", cursor: "pointer", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    );
  }

  return children;
}


function AppLayout() {
  const { orgSlug } = useParams();
  const { user } = useAuth();
  const conferenceConfig = useConferenceConfig();
  const userName = user?.displayName || user?.email?.split("@")[0] || "Profile";
  const userAvatar = user?.photoURL || user?.avatar || user?.photo || null;
  const userInitials = getInitials(
    user?.displayName || user?.email?.split("@")[0] || "User",
  );

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div
            className="brand-mark"
            aria-hidden="true"
            style={{ background: "transparent" }}
          >
            <img
              src={conferenceConfig.logoUrl || elmLogo}
              alt={conferenceConfig.brand}
              className="brand-logo"
            />
          </div>
          <div className="brand-copy">
            <strong>{conferenceConfig.brand}</strong>
            <small>{conferenceConfig.shortName || conferenceConfig.brandInitials}</small>
          </div>
        </div>
        <nav className="topnav">
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to={`/c/${orgSlug}/home`}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to={`/c/${orgSlug}/program`}
          >
            Program
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to={`/c/${orgSlug}/direct`}
          >
            Live
          </NavLink>
          {user ? (
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "topnav-button active topnav-profile"
                  : "topnav-button topnav-profile"
              }
              to={`/c/${orgSlug}/profile`}
              title={userName}
            >
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="topnav-avatar photo"
                />
              ) : (
                <span className="topnav-avatar initials">{userInitials}</span>
              )}
            </NavLink>
          ) : (
            <NavLink
              className={({ isActive }) =>
                isActive ? "topnav-button active" : "topnav-button"
              }
              to={`/c/${orgSlug}/auth`}
              state={{ from: window.location.pathname }}
            >
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="page-footer">
        <span>{conferenceConfig.brand}</span>
        <small>&copy; {new Date().getFullYear()}</small>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ConferenceProvider>
        <Routes>
          <Route
            path="/c/:orgSlug"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="home" />} />
            <Route path="home" element={<HomePage />} />
            <Route path="program" element={<ProgramPage />} />
            <Route path="direct" element={<DirectPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/c/:orgSlug/auth" element={<AuthPage />} />
          <Route path="/c/:orgSlug/auth/sso-callback" element={<AuthenticateWithRedirectCallback />} />
          <Route path="*" element={<div className="page-shell"><div className="status-panel">Page Not Found</div></div>} />
        </Routes>
      </ConferenceProvider>
    </BrowserRouter>
  );
}

export default App;

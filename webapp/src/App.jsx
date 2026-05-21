import {
  NavLink,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { conferenceConfig } from "./conferenceConfig";
import HomePage from "./pages/HomePage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import DirectPage from "./pages/DirectPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="page-shell">
        <div className="status-panel">Checking authentication…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace to="/auth" state={{ from: location }} />;
  }

  return children;
}

function AppShell() {
  const { user } = useAuth();
  const userName = user?.displayName || user?.email?.split("@")[0] || "Profile";
  const userInitials = getInitials(userName);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">{conferenceConfig.brandInitials}</div>
          <div>
            <strong>{conferenceConfig.brand}</strong>
            <small>{conferenceConfig.tagline}</small>
          </div>
        </div>
        <nav className="topnav">
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to="/home"
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to="/program"
          >
            Program
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "topnav-button active" : "topnav-button"
            }
            to="/direct"
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
              to="/profile"
              title={userName}
            >
              <span className="topnav-avatar initials">{userInitials}</span>
            </NavLink>
          ) : (
            <NavLink
              className={({ isActive }) =>
                isActive ? "topnav-button active" : "topnav-button"
              }
              to="/auth"
            >
              Login
            </NavLink>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/program"
            element={
              <ProtectedRoute>
                <ProgramPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/direct"
            element={
              <ProtectedRoute>
                <DirectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate replace to="/home" />} />
        </Routes>
      </main>

      <footer className="page-footer">
        <p>
          {conferenceConfig.brand} — {conferenceConfig.dates} —{" "}
          {conferenceConfig.location}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

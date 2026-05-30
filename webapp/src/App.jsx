import {
  BrowserRouter,
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import DirectPage from "./pages/DirectPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useConferenceConfig } from "./context/ConferenceContext.jsx";
import elmLogo from "@global/logo.png";

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

function App() {
  const { user } = useAuth();
  const conferenceConfig = useConferenceConfig();
  const userName = user?.displayName || user?.email?.split("@")[0] || "Profile";
  const userAvatar = user?.photoURL || user?.avatar || user?.photo || null;
  const userInitials = getInitials(
    user?.displayName || user?.email?.split("@")[0] || "User",
  );

  return (
    <BrowserRouter>
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
              {conferenceConfig.name && <small>{conferenceConfig.name}</small>}
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
            <Route path="/home" element={<HomePage />} />
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
            ElMoultaqa conference web application — template-ready and styled to
            match the ElMoultaqa theme across web and mobile.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;

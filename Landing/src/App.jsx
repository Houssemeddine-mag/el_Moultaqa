import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./styles.css";
import icon from "@icon";
import {
  onAuthStateChanged,
  loginUser,
  registerUser,
  logoutUser,
  signInWithGoogle,
  saveConferenceConfig,
} from "./backend.js";
import HomePage from "./pages/HomePage.jsx";
import ConferenceBuilderPage from "./pages/ConferenceBuilderPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";

const initialConference = {
  name: "",
  shortName: "",
  themeColor: "#0d7e52",
  logo: "",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  collaborators: [""],
  sponsors: [""],
  attendees: [""],
  offer: "starter",
};

function AppRoutes({
  user,
  conference,
  setConference,
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  saveError,
  saving,
  handleAuthSubmit,
  handleGoogleSignIn,
  handleLogout,
  handleFinish,
}) {
  const navigate = useNavigate();

  const onAuthSubmit = async (event) => {
    const success = await handleAuthSubmit(event);
    if (success) {
      navigate("/builder");
    }
  };

  const onGoogleSignIn = async () => {
    const success = await handleGoogleSignIn();
    if (success) {
      navigate("/builder");
    }
  };

  const logoutAndHome = async () => {
    await handleLogout();
    navigate("/");
  };

  return (
    <div className="landing-shell">
      <header className="landing-nav">
        <div className="brand">
          <img className="logo-image" src={icon} alt="El Moultaqa icon" />
          <div>
            <strong className="brand-title">El Moultaqa</strong>
            <span className="brand-subtitle">الملتقى</span>
          </div>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user-email">{user.email}</span>
              <button className="secondary-button" onClick={logoutAndHome}>
                Sign out
              </button>
              <button
                className="landing-cta"
                onClick={() => navigate("/builder")}
              >
                Create your conference
              </button>
            </>
          ) : (
            <button className="landing-cta" onClick={() => navigate("/auth")}>
              Sign in to create
            </button>
          )}
        </div>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              user={user}
              onCreate={() => (user ? navigate("/builder") : navigate("/auth"))}
              onAuth={() => navigate("/auth")}
            />
          }
        />
        <Route
          path="/builder"
          element={
            user ? (
              <ConferenceBuilderPage
                config={conference}
                onChange={setConference}
                onBack={() => navigate("/")}
                onFinish={handleFinish}
                saveError={saveError}
                saving={saving}
              />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={
            <AuthPage
              authMode={authMode}
              authEmail={authEmail}
              authPassword={authPassword}
              authError={authError}
              onEmailChange={setAuthEmail}
              onPasswordChange={setAuthPassword}
              onModeToggle={() =>
                setAuthMode((current) =>
                  current === "register" ? "login" : "register",
                )
              }
              onSubmit={onAuthSubmit}
              onGoogleSignIn={onGoogleSignIn}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="landing-footer">
        <p>ElMoultaqa — conference software for modern events.</p>
      </footer>
    </div>
  );
}

export default function App() {
  const [conference, setConference] = useState(initialConference);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword) {
      setAuthError("Please enter email and password.");
      return false;
    }

    try {
      const userData =
        authMode === "register"
          ? await registerUser(authEmail, authPassword)
          : await loginUser(authEmail, authPassword);
      setUser(userData);
      return true;
    } catch (error) {
      setAuthError(error.message || "Authentication failed. Please try again.");
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    try {
      const userData = await signInWithGoogle();
      setUser(userData);
      return true;
    } catch (error) {
      setAuthError(error.message || "Google authentication failed.");
      return false;
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  const handleFinish = async () => {
    setSaveError("");
    setSaving(true);

    try {
      const conferenceId = await saveConferenceConfig({
        ...conference,
        ownerId: user?.uid,
        ownerEmail: user?.email,
      });
      setConference({ ...conference, id: conferenceId });
      return true;
    } catch (error) {
      setSaveError(error.message || "Unable to save conference configuration.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return (
    <Router>
      <AppRoutes
        user={user}
        conference={conference}
        setConference={setConference}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authEmail={authEmail}
        setAuthEmail={setAuthEmail}
        authPassword={authPassword}
        setAuthPassword={setAuthPassword}
        authError={authError}
        setAuthError={setAuthError}
        saveError={saveError}
        saving={saving}
        handleAuthSubmit={handleAuthSubmit}
        handleGoogleSignIn={handleGoogleSignIn}
        handleLogout={handleLogout}
        handleFinish={handleFinish}
      />
    </Router>
  );
}

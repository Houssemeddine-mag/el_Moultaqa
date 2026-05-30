import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import ScrollToTop from "./Components/ScrollToTop";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import PresentationsPage from "./pages/PresentationsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import DatabaseManagerPage from "./pages/DatabaseManagerPage.jsx";
import KeynoteInApp from "./pages/KeynoteInApp.jsx";
import SponsorsPage from "./pages/SponsorsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import "./styles.css";

const App = () => {
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem("rifAdminUser"));
  const isAppRoute = location.pathname.startsWith("/app");

  return (
    <div className="app-container">
      {isAppRoute && <Sidebar />}
      <div
        className={`content-wrapper ${isAppRoute ? "shell-content" : "auth-content"}`}
      >
        {isAppRoute && <Topbar />}
        {isAppRoute && <ScrollToTop />}

        <main className={`main-content ${isAppRoute ? "" : "auth-page-main"}`}>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to={isAuthenticated ? "/app/dashboard" : "/login"}
                  replace
                />
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/app/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route path="/app">
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route
                path="dashboard"
                element={
                  isAuthenticated ? (
                    <DashboardPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="program"
                element={
                  isAuthenticated ? (
                    <ProgramPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="presentations"
                element={
                  isAuthenticated ? (
                    <PresentationsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="users"
                element={
                  isAuthenticated ? (
                    <UsersPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="database"
                element={
                  isAuthenticated ? (
                    <DatabaseManagerPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="keynote-in-app"
                element={
                  isAuthenticated ? (
                    <KeynoteInApp />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="sponsors"
                element={
                  isAuthenticated ? (
                    <SponsorsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="settings"
                element={
                  isAuthenticated ? (
                    <SettingsPage />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Route>
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;

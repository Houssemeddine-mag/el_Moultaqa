import { Navigate, Route, Routes, Outlet, useParams } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import ScrollToTop from "./Components/ScrollToTop";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProgramPage from "./pages/ProgramPage.jsx";
import PresentationsPage from "./pages/PresentationsPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import EventManagerPage from "./pages/EventManagerPage.jsx";
import DatabaseManagerPage from "./pages/DatabaseManagerPage.jsx";
import KeynoteInApp from "./pages/KeynoteInApp.jsx";
import SponsorsPage from "./pages/SponsorsPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import { useAuth, useClerk, useOrganizationList, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useClerkSupabase, resolveOrgSlug } from "@global/supabase";
import { useState, useEffect } from "react";
import backend from "./backend.js";
import "./styles.css";

function AdminLayout() {
  const { orgSlug } = useParams();
  const { isLoaded, userId, orgId } = useAuth();
  const { setActive, signOut } = useClerk();
  const supabase = useClerkSupabase();
  const [orgDetails, setOrgDetails] = useState(null);
  const [loadingOrg, setLoadingOrg] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [orgError, setOrgError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let pollInterval = null;
    let pollAttempts = 0;
    const maxPollAttempts = 10; // Poll for 30 seconds total

    // Returns true if details were resolved (no polling needed),
    // false if still pending, or null on error/abort.
    async function checkDetails() {
      if (!orgSlug || !supabase) return null;

      try {
        console.log(`[AdminLayout] Resolving org slug: ${orgSlug} (attempt ${pollAttempts + 1}/${maxPollAttempts})`);
        const details = await resolveOrgSlug(supabase, orgSlug);
        if (!active) return null;

        if (details) {
          if (pollInterval) clearInterval(pollInterval);
          setOrgError("");
          setStatusMessage("");

          // Verify tenant membership
          if (orgId !== details.clerk_org_id) {
            console.log(`[AdminLayout] Auto-switching active organization context to: ${details.clerk_org_id}`);
            try {
              await setActive({ organization: details.clerk_org_id });
              return true; // resolved — will re-run via orgId dep change
            } catch (setActiveError) {
              console.warn(`[AdminLayout] Access denied: User is not a member of organization clerk_org_id (${details.clerk_org_id})`, setActiveError);
              setOrgError(
                "You are not currently a member of this Clerk organization. " +
                "Ensure your Clerk account belongs to the organization or that you are using the correct org-specific admin URL."
              );
              setLoadingOrg(false);
              return true; // resolved (with error) — no polling needed
            }
          }

          setOrgDetails(details);
          backend.initializeService(supabase, details.schema_name);

          // Apply theme color styling if configured
          if (details.themeColor || details.settings?.themeColor) {
            const color = details.themeColor || details.settings?.themeColor;
            document.documentElement.style.setProperty("--accent", color);
            document.documentElement.style.setProperty("--brand-primary", color);
          }
          setLoadingOrg(false);
          return true; // resolved
        } else {
          pollAttempts++;
          if (pollAttempts >= maxPollAttempts) {
            if (pollInterval) clearInterval(pollInterval);
            console.warn("[AdminLayout] Org details not found for slug:", orgSlug);
            setOrgError(
              "This organization has not yet been provisioned in Supabase. " +
              "Please wait a moment and try again, or verify the Clerk webhook configuration."
            );
            setStatusMessage("");
            setLoadingOrg(false);
            return true; // resolved (with error) — no polling needed
          } else {
            setStatusMessage("This organization is still provisioning. Waiting for database initialization...");
            return false; // not yet resolved — polling should continue
          }
        }
      } catch (e) {
        console.error("[AdminLayout] Verification error:", e);
        if (pollInterval) clearInterval(pollInterval);
        setOrgError("An unexpected error occurred during database verification.");
        setStatusMessage("");
        setLoadingOrg(false);
        return null; // error — no polling
      }
    }

    setLoadingOrg(true);
    setUnauthorized(false);
    setOrgError("");
    setStatusMessage("Verifying administrator credentials...");
    setOrgDetails(null);

    // Initial check — use the return value to decide whether to poll
    checkDetails().then((resolved) => {
      if (active && resolved === false) {
        // Details not found yet and no error — start polling
        pollInterval = setInterval(() => {
          checkDetails();
        }, 3000);
      }
    });

    return () => {
      active = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [orgSlug, supabase, orgId, setActive, retryCount]);

  if (!isLoaded || (loadingOrg && !orgError)) {
    return (
      <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem", marginBottom: "1rem" }}>
            {statusMessage || "Verifying administrator credentials..."}
          </div>
          <div style={{ margin: "0 auto", border: "4px solid rgba(255,255,255,0.1)", width: "36px", height: "36px", borderRadius: "50%", borderLeftColor: "var(--accent, #0d7e52)", animation: "spin 1s linear infinite" }}></div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Navigate to={`/c/${orgSlug}/admin/login`} replace />;
  }

  if (unauthorized || !orgDetails || orgError) {
    return (
      <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "2rem" }}>
        <div className="glass-card" style={{ maxWidth: "500px", padding: "3rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255, 68, 68, 0.2)", background: "rgba(255, 68, 68, 0.02)" }}>
          <div style={{ margin: "0 auto 1.5rem auto", display: "flex", justifyContent: "center", alignItems: "center", width: "70px", height: "70px", borderRadius: "50%", background: "rgba(255, 68, 68, 0.15)", color: "#ff4444" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "35px", height: "35px" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.03L3.07 19.5a1.125 1.125 0 00.97 1.685h15.91a1.125 1.125 0 00.97-1.685L12 2.695zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Access Denied</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.5", fontSize: "0.95rem" }}>
            {orgError || (
              <>You do not have administrative permissions for the organization <strong>{orgSlug}</strong>. Please ensure you are logged into the correct active organization in your Clerk session.</>
            )}
          </p>
          <button 
            className="landing-cta" 
            style={{ marginTop: "1.5rem", width: "100%", background: "var(--accent, #0d7e52)", border: "none", cursor: "pointer" }}
            onClick={() => setRetryCount(prev => prev + 1)}
          >
            Retry Verification
          </button>
          <button 
            className="secondary-button" 
            style={{ marginTop: "0.75rem", width: "100%", cursor: "pointer", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
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

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-wrapper shell-content">
        <Topbar orgDetails={orgDetails} />
        <ScrollToTop />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const AdminIndexRedirect = () => {
  const { orgSlug } = useParams();
  return <Navigate to={`/c/${orgSlug}/admin/app/dashboard`} replace />;
};

const AdminHomeRedirect = () => {
  const { userMemberships, isLoaded } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  if (!isLoaded) {
    return (
      <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>Loading your organizations...</div>
      </div>
    );
  }

  if (userMemberships.data && userMemberships.data.length > 0) {
    const firstOrg = userMemberships.data[0].organization;
    const slug = firstOrg.slug || `org-${firstOrg.id}`;
    return <Navigate to={`/c/${slug}/admin/app/dashboard`} replace />;
  }

  // No organizations found — show error page instead of hardcoded demo fallback
  return (
    <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", padding: "2rem" }}>
      <div className="glass-card" style={{ maxWidth: "500px", padding: "3rem", borderRadius: "16px", textAlign: "center" }}>
        <h2 style={{ color: "#fff", marginBottom: "1rem" }}>No Organizations Found</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.5", fontSize: "0.95rem" }}>
          Your account is not a member of any organization. Please ask your administrator to invite you, or create a new organization from the landing page.
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const { isLoaded, userId } = useAuth();
  const isAuthenticated = isLoaded ? Boolean(userId) : false;

  if (!isLoaded) {
    return (
      <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.2rem" }}>Checking authentication...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/c/:orgSlug/admin">
        <Route index element={<AdminIndexRedirect />} />
        <Route
          path="login"
          element={
            isAuthenticated ? (
              <AdminIndexRedirect />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route path="sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="app" element={<AdminLayout />}>
          <Route index element={<AdminIndexRedirect />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventManagerPage />} />
          <Route path="program" element={<ProgramPage />} />
          <Route path="presentations" element={<PresentationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="database" element={<DatabaseManagerPage />} />
          <Route path="keynote-in-app" element={<KeynoteInApp />} />
          <Route path="sponsors" element={<SponsorsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="/" element={<AdminHomeRedirect />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;

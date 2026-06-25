import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth, useClerk, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useClerkSupabase } from "@global/supabase";
import Sidebar from "./Components/Sidebar.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import OrganizationsPage from "./pages/OrganizationsPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";

const BASE = "/system";

function ProtectedLayout() {
  const { isLoaded, userId } = useAuth();
  const { signOut } = useClerk();
  const supabase = useClerkSupabase();
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    async function check() {
      if (!userId || !supabase) {
        setCheckingAdmin(false);
        setIsAdmin(false);
        return;
      }
      try {
        const { data, error } = await supabase.rpc("is_super_admin");
        if (error) {
          console.error("[SuperAdmin] RPC error:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (e) {
        console.error("[SuperAdmin] check error:", e);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    }
    check();
  }, [userId, supabase]);

  useEffect(() => {
    if (!checkingAdmin && !isAdmin && userId && !signedOut) {
      setSignedOut(true);
      signOut().catch(() => {});
    }
  }, [checkingAdmin, isAdmin, userId, signedOut]);

  if (!isLoaded || checkingAdmin) {
    return (
      <div className="sa-loading-shell">
        <div className="sa-loading-container">
          <div className="sa-loading-spinner" />
          <div className="sa-loading-message">
            {!userId ? "Checking authentication..." : "Verifying super admin access..."}
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return <Navigate to={`${BASE}/login`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="sa-access-denied">
        <div className="sa-access-card">
          <div className="sa-access-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v3.75m0-10.03L3.07 19.5a1.125 1.125 0 00.97 1.685h15.91a1.125 1.125 0 00.97-1.685L12 2.695zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h2>Access Denied</h2>
          <p>Your email is not registered for super administrator access. Only authorized platform administrators can access this panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-app-container">
      <Sidebar />
      <div className="sa-content">
        <main className="sa-main">
          <Routes>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="organizations" element={<OrganizationsPage />} />
            <Route path="plans" element={<PlansPage />} />
            <Route path="*" element={<Navigate to={`${BASE}/dashboard`} replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isLoaded, userId } = useAuth();
  const { signOut } = useClerk();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      setReady(true);
    }
  }, [isLoaded]);

  if (!ready) {
    return (
      <div className="sa-loading-shell">
        <div className="sa-loading-container">
          <div className="sa-loading-spinner" />
          <div className="sa-loading-message">Preparing login...</div>
        </div>
      </div>
    );
  }


  return (
    <Routes>
      <Route path={`${BASE}/login`} element={<LoginPage />} />
      <Route path={`${BASE}/sso-callback`} element={<AuthenticateWithRedirectCallback redirectUrl={`${BASE}/dashboard`} />} />
      <Route path={`${BASE}/*`} element={<ProtectedLayout />} />
      <Route path="*" element={<Navigate to={`${BASE}/login`} replace />} />
    </Routes>
  );
}

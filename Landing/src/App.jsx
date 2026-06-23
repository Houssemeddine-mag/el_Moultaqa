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
import { useUser, useSignIn, useSignUp, useClerk, useOrganizationList, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { saveConferenceConfig } from "./backend.js";
import { useClerkSupabase, resolveOrgSlug, createClerkSupabaseClient } from "@global/supabase";
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
  handleReset,
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
                onReset={handleReset}
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
        <Route path="/auth/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="landing-footer">
        <p>ElMoultaqa — conference software for modern events.</p>
      </footer>
    </div>
  );
}

export default function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const clerk = useClerk();
  const { signOut, setActive } = clerk;
  const supabase = useClerkSupabase();

  const authLoading = !isLoaded;

  const [conference, setConference] = useState(initialConference);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  // Map Clerk user to the user shape expected by the rest of the application
  const user = clerkUser
    ? {
        email: clerkUser.primaryEmailAddress?.emailAddress,
        uid: clerkUser.id,
      }
    : null;

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthError("");

    if (!authEmail || !authPassword) {
      setAuthError("Please enter email and password.");
      return false;
    }

    if (!signInLoaded || !signUpLoaded) {
      setAuthError("Authentication is still loading. Please wait.");
      return false;
    }

    try {
      if (authMode === "register") {
        const result = await signUp.create({
          emailAddress: authEmail,
          password: authPassword,
        });
        if (result.status === "complete") {
          return true;
        } else {
          setAuthError("Sign up created! Verification might be required. Check your email.");
          return false;
        }
      } else {
        const result = await signIn.create({
          identifier: authEmail,
          password: authPassword,
        });
        if (result.status === "complete") {
          return true;
        } else {
          setAuthError("Additional verification step required.");
          return false;
        }
      }
    } catch (error) {
      console.error("[Landing Auth]", error);
      const clerkMessage =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "Authentication failed. Please try again.";
      setAuthError(clerkMessage);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError("");
    if (!signInLoaded) return false;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + "/auth/sso-callback",
        redirectUrlComplete: "/builder",
      });
      return true;
    } catch (error) {
      console.error("[Landing Google Auth]", error);
      setAuthError(error.message || "Google authentication failed.");
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await clerk.signOut();
    } catch (error) {
      console.error("[Landing Logout]", error);
    }
  };

  async function waitForOrgProvisioning(supabaseClient, orgSlug, timeoutMs = 15000, intervalMs = 1000) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const details = await resolveOrgSlug(supabaseClient, orgSlug);
      if (details) {
        return details;
      }
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    return null;
  }

  const handleFinish = async () => {
    setSaveError("");
    setSaving(true);

    try {
      const rawSlug = conference.shortName || conference.name || "";
      const slug = rawSlug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "")
        .replace(/\-\-+/g, "-")
        .replace(/^-+/, "")
        .replace(/-+$/, "") || `conf-${Date.now()}`;


      console.log("[Landing App] Launching conference, creating Clerk organization:", conference.name, slug);
      const org = await clerk.createOrganization({
        name: conference.name,
        slug: slug,
      });

      await setActive({ organization: org.id });

      // Give Clerk a brief moment to update its active session state
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Debug: Decode and print the Clerk JWT to see the active claims
      try {
        const token = await clerk.session.getToken({ template: "supabase", skipCache: true });
        if (token) {
          const payload = JSON.parse(atob(token.split(".")[1]));
          console.log("[DEBUG JWT] Decoded Supabase JWT payload:", JSON.stringify(payload, null, 2));
        } else {
          console.warn("[DEBUG JWT] Token is null or empty!");
        }
      } catch (err) {
        console.error("[DEBUG JWT] Failed to fetch/decode token:", err);
      }

      // Create a fresh Supabase client using the latest Clerk session token, bypassing the cache
      console.log("[Landing App] Initializing fresh Supabase client with latest organization context...");
      const freshSupabase = createClerkSupabaseClient(() => 
        clerk.session.getToken({ template: "supabase", skipCache: true })
      );

      // First, try waiting for the webhook with a short timeout (4 seconds)
      console.log("[Landing App] Waiting for webhook to provision tenant schema...");
      let resolveResult = await waitForOrgProvisioning(freshSupabase, slug, 4000, 1000);

      if (!resolveResult) {
        console.log("[Landing App] Webhook provisioning pending or failed. Executing fallback client-side provisioning RPC...");
        
        const { data: fallbackData, error: fallbackError } = await freshSupabase.rpc("provision_org_if_needed", {
          p_clerk_org_id: org.id,
          p_name: conference.name,
          p_slug: slug,
          p_owner_clerk_id: clerkUser?.id,
        });

        if (fallbackError) {
          console.error("[Landing App] Fallback provisioning RPC failed:", fallbackError);
          // If RPC fails, try waiting a bit longer in case the webhook is just slow
          console.log("[Landing App] Retrying webhook polling...");
          resolveResult = await waitForOrgProvisioning(freshSupabase, slug, 6000, 1000);
          if (!resolveResult) {
            throw new Error(
              "Fallback provisioning failed: " + fallbackError.message + 
              ". Additionally, webhook provisioning did not complete. Please check the webhook configuration."
            );
          }
        } else {
          console.log("[Landing App] Fallback provisioning RPC completed successfully:", fallbackData);
          // Verify we can resolve the slug now
          resolveResult = await resolveOrgSlug(freshSupabase, slug);
          if (!resolveResult) {
            throw new Error("Unable to resolve organization slug after fallback provisioning.");
          }
        }
      } else {
        console.log("[Landing App] Webhook successfully provisioned the tenant schema.");
      }

      // Save registration mode and code via RPC (non-fatal — admin can update later in Settings)
      const regMode = conference.registrationMode || "public";
      const regCode = conference.registrationCode || null;
      console.log(`[Landing App] Saving registration settings via RPC: mode=${regMode}, code=${regCode}`);
      try {
        const { error: regError } = await freshSupabase.rpc("update_registration_settings", {
          p_slug: slug,
          p_registration_mode: regMode,
          p_registration_code: regCode,
        });
        if (regError) {
          console.warn("[Landing App] Registration settings not saved (non-fatal):", regError.message);
        }
      } catch (regEx) {
        console.warn("[Landing App] Registration settings call failed (non-fatal):", regEx);
      }

      const conferenceId = await saveConferenceConfig(freshSupabase, {
        ...conference,
        ownerId: clerkUser?.id,
        ownerEmail: clerkUser?.primaryEmailAddress?.emailAddress,
        clerkOrgId: org.id,
        slug: slug,
      });


      setConference({ ...conference, id: conferenceId, slug: slug });
      return true;
    } catch (error) {
      console.error("[Landing App] Launch error:", error);
      const clerkMessage =
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        "Unable to create organization. The short name might already be taken.";
      setSaveError(clerkMessage);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConference(initialConference);
  };

  if (authLoading) {
    return (
      <div className="landing-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading authentication...</div>
      </div>
    );
  }

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
        handleReset={handleReset}
      />
    </Router>
  );
}

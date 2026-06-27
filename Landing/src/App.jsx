import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./styles.css";
import logo from "@logo";
import icon from "@icon";
import { useUser, useSignIn, useSignUp, useClerk, useOrganizationList, AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { saveConferenceConfig } from "./backend.js";
import { useClerkSupabase, resolveOrgSlug, createClerkSupabaseClient } from "@global/supabase";
import HomePage from "./pages/HomePage.jsx";
import ConferenceBuilderPage from "./pages/ConferenceBuilderPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DocumentationPage from "./pages/DocumentationPage.jsx";
import LegalPage from "./pages/LegalPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import OrgButton from "./components/OrgButton.jsx";

const initialConference = {
  name: "",
  shortName: "",
  themeColor: "#0d7e52",
  logo: "",
  startDate: "2026-12-12",
  endDate: "2026-12-14",
  registrationMode: "public",
  registrationCode: "",
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
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
        <a href="/" className="brand" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <img className="logo-image" src={icon} alt="El Moultaqa icon" />
          <div>
            <strong className="brand-title">El Moultaqa</strong>
            <span className="brand-subtitle">الملتقى</span>
          </div>
        </a>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user-email">{user.email}</span>
              <OrgButton />
              <button className="secondary-button" onClick={logoutAndHome}>
                Sign out
              </button>
              <button
                className="landing-cta"
                onClick={() => navigate("/builder")}
              >
                Create Conference
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
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/auth/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo-wrap">
            <img className="footer-logo" src={logo} alt="El Moultaqa" />
          </div>
          <div className="footer-links">
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>Home</a></li>
                <li><a href="/docs" onClick={(e) => { e.preventDefault(); navigate("/docs"); }}>Documentation</a></li>
                <li><a href="/about#about" onClick={(e) => { e.preventDefault(); navigate("/about#about"); }}>About us</a></li>
                <li><a href="/about#contact" onClick={(e) => { e.preventDefault(); navigate("/about#contact"); }}>Contact</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h3>Legal</h3>
              <ul>
                <li><a href="/legal#privacy" onClick={(e) => { e.preventDefault(); navigate("/legal#privacy"); }}>Privacy Policy</a></li>
                <li><a href="/legal#terms" onClick={(e) => { e.preventDefault(); navigate("/legal#terms"); }}>Terms of Service</a></li>
                <li><a href="/legal#cookies" onClick={(e) => { e.preventDefault(); navigate("/legal#cookies"); }}>Cookie Policy</a></li>
                <li><a href="/legal#disclaimer" onClick={(e) => { e.preventDefault(); navigate("/legal#disclaimer"); }}>Disclaimer</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-social">
            <a href="#twitter" title="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75-2.25 7-5 7-5s-1 1.5-3 2.5Z"></path></svg>
            </a>
            <a href="#linkedin" title="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a href="#instagram" title="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><circle cx="17.5" cy="6.5" r="1.5"></circle></svg>
            </a>
            <a href="#github" title="GitHub">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
            </a>
          </div>
          <p>© 2026 ElMoultaqa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement("link");
    link.rel = "icon";
    link.href = icon;
    document.head.appendChild(link);
  }, []);

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

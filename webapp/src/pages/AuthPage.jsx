// ============================================================================
// AuthPage — Clerk-backed authentication (custom UI)
// ============================================================================
// Uses Clerk's useSignIn() and useSignUp() hooks to handle auth flows
// while keeping your existing UI completely intact.
// Adds registration gate for multi-tenancy.
// ============================================================================

import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSignIn, useSignUp, useClerk } from "@clerk/clerk-react";
import "../style/AuthPage.css";
import { useAuth } from "../context/AuthContext.jsx";
import { useConferenceConfig } from "../context/ConferenceContext.jsx";
import { useClerkSupabase, resolveOrgSlug } from "@global/supabase";
import { getOrgPublicInfo, registerAttendee, checkUserMembership } from "../services/localService";

export default function AuthPage() {
  const { user } = useAuth();
  const { signIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();
  const { signOut } = useClerk();
  const supabase = useClerkSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const { orgSlug } = useParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Gated registration states
  const [registrationStep, setRegistrationStep] = useState("auth"); // 'auth' | 'checking' | 'code_required' | 'registering' | 'done'
  const [registrationCode, setRegistrationCode] = useState("");
  const [orgPublicInfo, setOrgPublicInfo] = useState(null);
  const [orgSchemaName, setOrgSchemaName] = useState(null);

  const getOrgSlugFromPath = (path) => {
    if (!path) return null;
    const match = path.match(/^\/c\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const redirectTo = location.state?.from?.pathname || `/c/${orgSlug || "demo"}/profile`;

  // Check registration status when user is authenticated
  useEffect(() => {
    if (!user || !supabase || !orgSlug) {
      setRegistrationStep("auth");
      return;
    }

    let isSubscribed = true;

    async function checkRegistration() {
      setRegistrationStep("checking");
      setError("");
      try {
        const publicInfo = await getOrgPublicInfo(supabase, orgSlug);
        const orgDetails = await resolveOrgSlug(supabase, orgSlug);
        if (!orgDetails) {
          throw new Error(`Conference '${orgSlug}' not found.`);
        }
        if (!isSubscribed) return;

        setOrgPublicInfo(publicInfo);
        setOrgSchemaName(orgDetails.schema_name);

        const isMember = await checkUserMembership(supabase, orgDetails.schema_name, user.uid);
        if (!isSubscribed) return;

        if (isMember) {
          setRegistrationStep("done");
          navigate(redirectTo, { replace: true });
        } else {
          if (publicInfo.registration_mode === "public") {
            setRegistrationStep("registering");
            await registerAttendee(
              supabase,
              orgSlug,
              user.uid,
              user.email,
              user.displayName || user.email.split("@")[0],
              null
            );
            if (!isSubscribed) return;
            setRegistrationStep("done");
            navigate(redirectTo, { replace: true });
          } else {
            setRegistrationStep("code_required");
          }
        }
      } catch (err) {
        console.error("Registration check failed:", err);
        if (isSubscribed) {
          setError(err.message || "An error occurred checking registration status.");
          setRegistrationStep("auth");
        }
      }
    }

    checkRegistration();

    return () => {
      isSubscribed = false;
    };
  }, [user, supabase, orgSlug, navigate, redirectTo]);

  // ---------------------------------------------------------------------------
  // Email/Password: Sign In or Create Account
  // ---------------------------------------------------------------------------
  async function handleEmailAction() {
    setError("");
    setInfoMessage("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!signInLoaded || !signUpLoaded) {
      setError("Authentication is still loading. Please wait.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingAccount) {
        // --- Sign Up ---
        const result = await signUp.create({
          emailAddress: email,
          password: password,
        });

        if (result.status === "complete") {
          // Will be caught by user useEffect
        } else {
          // May need email verification — check Clerk dashboard settings
          setInfoMessage(
            "Account created! Please check your email to verify your address."
          );
        }
      } else {
        // --- Sign In ---
        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === "complete") {
          // Will be caught by user useEffect
        } else {
          // Multi-factor or other verification step required
          setInfoMessage("Please complete the verification step.");
        }
      }
    } catch (err) {
      console.error("[AuthPage]", err);
      const clerkMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Authentication failed.";
      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Social: Google OAuth
  // ---------------------------------------------------------------------------
  async function handleGoogleSignIn() {
    setError("");
    setInfoMessage("");

    if (!signInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + `/c/${orgSlug || "demo"}/auth/sso-callback`,
        redirectUrlComplete: redirectTo,
      });
    } catch (err) {
      console.error("[AuthPage] Google sign-in error:", err);
      setError("Google sign-in failed. Please try again.");
    }
  }

  // ---------------------------------------------------------------------------
  // Social: GitHub OAuth
  // ---------------------------------------------------------------------------
  async function handleGithubSignIn() {
    setError("");
    setInfoMessage("");

    if (!signInLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_github",
        redirectUrl: window.location.origin + `/c/${orgSlug || "demo"}/auth/sso-callback`,
        redirectUrlComplete: redirectTo,
      });
    } catch (err) {
      console.error("[AuthPage] GitHub sign-in error:", err);
      setError("GitHub sign-in failed. Please try again.");
    }
  }

  // ---------------------------------------------------------------------------
  // Password Reset
  // ---------------------------------------------------------------------------
  async function handlePasswordReset() {
    setError("");
    setInfoMessage("");

    if (!email) {
      setError("Enter your email address to reset your password.");
      return;
    }

    if (!signInLoaded) return;

    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      setInfoMessage("Password reset link sent to your email.");
    } catch (err) {
      console.error("[AuthPage] Password reset error:", err);
      const clerkMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Password reset failed.";
      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Sign Out
  // ---------------------------------------------------------------------------
  async function handleSignOut() {
    setError("");
    try {
      await signOut();
      setRegistrationStep("auth");
    } catch (err) {
      console.error("[AuthPage] Sign out error:", err);
      setError("Sign out failed. Please try again.");
    }
  }

  // ---------------------------------------------------------------------------
  // Gated Access Join
  // ---------------------------------------------------------------------------
  async function handleJoinWithCode() {
    setError("");
    if (!registrationCode.trim()) {
      setError("Please enter the registration code.");
      return;
    }

    setLoading(true);
    try {
      await registerAttendee(
        supabase,
        orgSlug,
        user.uid,
        user.email,
        user.displayName || user.email.split("@")[0],
        registrationCode.trim()
      );
      setRegistrationStep("done");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error("[AuthPage] registerAttendee failed:", err);
      setError(err.message || "Invalid registration code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Derived display values
  // ---------------------------------------------------------------------------
  const conferenceConfig = useConferenceConfig();
  const displayName =
    user?.displayName || user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "guest@elmoultaqa.com";

  let statusText = "Sign in with your email and password or use a social provider.";
  if (user) {
    if (registrationStep === "checking") {
      statusText = "Checking your registration status...";
    } else if (registrationStep === "registering") {
      statusText = "Registering you for this conference...";
    } else if (registrationStep === "code_required") {
      statusText = "Registration code required.";
    } else {
      statusText = "Signed in and ready to access your conference data.";
    }
  }

  const profileFields = [
    { label: "Email", value: userEmail },
    { label: "Name", value: displayName },
  ];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="page-shell auth-page">
      <div className="auth-grid">
        <section className="auth-copy-panel">
          <div className="auth-copy-logo">
            <div className="auth-copy-mark" aria-hidden="true">
              <span>{conferenceConfig.brandInitials}</span>
            </div>
          </div>
          <span>ElMoultaqa login</span>
          <h1>Sign in to your conference account</h1>
          <p>
            Use your email and password or a social sign-in button to access
            your conference profile, program, and live features.
          </p>
          <div className="auth-features">
            <div>
              <strong>Shared backend</strong>
              <p>
                Your user profile is synced across web and mobile via Supabase.
              </p>
            </div>
            <div>
              <strong>Secure sign-in</strong>
              <p>
                Authentication is managed by Clerk with enterprise-grade
                security and session management.
              </p>
            </div>
            <div>
              <strong>Live profile sync</strong>
              <p>
                Any updates in the mobile app are reflected here when you sign
                in with the same account.
              </p>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <div className="auth-status-row">
              <div>
                <span>Status</span>
                <h2>{statusText}</h2>
              </div>
              <div className={`auth-pill ${user ? "online" : "offline"}`}>
                {user ? "Signed in" : "Signed out"}
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}
            {infoMessage && <div className="auth-info">{infoMessage}</div>}

            {registrationStep === "checking" || registrationStep === "registering" ? (
              <div className="auth-checking-state" style={{ padding: "2rem 0", textAlign: "center" }}>
                <div className="spinner" style={{ margin: "0 auto 1rem", border: "4px solid #f3f3f3", borderTop: "4px solid #0d7e52", borderRadius: "50%", width: "40px", height: "40px", animation: "spin 1s linear infinite" }}></div>
                <p>{registrationStep === "checking" ? "Checking details..." : "Registering..."}</p>
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </div>
            ) : registrationStep === "code_required" ? (
              <>
                <div className="auth-form">
                  <div style={{ marginBottom: "1.5rem", fontSize: "0.95rem", color: "#666" }}>
                    This conference is private and requires a registration code to join. Please enter it below.
                  </div>
                  <label>
                    Registration Code
                    <input
                      type="text"
                      value={registrationCode}
                      onChange={(event) => setRegistrationCode(event.target.value)}
                      placeholder="e.g. XK7-M9Q"
                      className="auth-input"
                      style={{ textTransform: "uppercase" }}
                    />
                  </label>
                </div>
                <div className="auth-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleJoinWithCode}
                    disabled={loading}
                  >
                    Join Conference
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : !user ? (
              <>
                <div className="auth-form">
                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="your@email.com"
                      className="auth-input"
                    />
                  </label>
                  <label>
                    Password
                    <div className="auth-password-wrapper">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className="auth-input"
                      />
                      <button
                        type="button"
                        className="auth-toggle-password"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </label>
                </div>

                <div className="auth-actions">
                  <button
                    className="primary-button"
                    type="button"
                    onClick={handleEmailAction}
                    disabled={loading}
                  >
                    {isCreatingAccount ? "Create account" : "Sign in"}
                  </button>
                </div>

                <div className="auth-link-row">
                  <button
                    type="button"
                    className={
                      isCreatingAccount
                        ? "auth-link-button active"
                        : "auth-link-button"
                    }
                    onClick={() => setIsCreatingAccount(true)}
                  >
                    Create account
                  </button>
                  <button
                    type="button"
                    className={
                      !isCreatingAccount
                        ? "auth-link-button active"
                        : "auth-link-button"
                    }
                    onClick={() => setIsCreatingAccount(false)}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className="auth-link-button"
                    onClick={handlePasswordReset}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="auth-social-label">
                  <span>Or sign in with</span>
                </div>
                <div className="auth-social-buttons">
                  <button
                    type="button"
                    className="social-button google"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    Continue with Google
                  </button>
                  <button
                    type="button"
                    className="social-button github"
                    onClick={handleGithubSignIn}
                    disabled={loading}
                  >
                    Continue with GitHub
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-actions">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </div>
            )}

            {user && (
              <div className="auth-profile-grid">
                {profileFields.map((field) => (
                  <div key={field.label}>
                    <span>{field.label}</span>
                    <p>{field.value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="auth-meta">
              <div>
                <span>Display name</span>
                <p>{displayName}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

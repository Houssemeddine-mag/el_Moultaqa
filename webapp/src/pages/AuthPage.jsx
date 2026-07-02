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

  const [registrationStep, setRegistrationStep] = useState("auth");
  const [registrationCode, setRegistrationCode] = useState("");

  const redirectTo = location.state?.from?.pathname || `/c/${orgSlug || "demo"}/profile`;

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
        if (orgDetails.blocked) {
          throw new Error("This conference has been suspended.");
        }
        if (!isSubscribed) return;

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

    return () => { isSubscribed = false; };
  }, [user, supabase, orgSlug, navigate, redirectTo]);

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
        const result = await signUp.create({
          emailAddress: email,
          password: password,
        });
        if (result.status !== "complete") {
          setInfoMessage("Account created! Please check your email to verify your address.");
        }
      } else {
        const result = await signIn.create({
          identifier: email,
          password: password,
        });
        if (result.status !== "complete") {
          setInfoMessage("Please complete the verification step.");
        }
      }
    } catch (err) {
      console.error("[AuthPage]", err);
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

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
      setError(
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Password reset failed."
      );
    } finally {
      setLoading(false);
    }
  }

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

  const conferenceConfig = useConferenceConfig();
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Guest";
  const userEmail = user?.email || "";

  const conferenceName = conferenceConfig.brand || "Conference";
  const conferenceInitials = conferenceConfig.brandInitials || "CO";

  let statusText = `Sign in to access ${conferenceName}`;
  if (user) {
    if (registrationStep === "checking") statusText = "Checking your registration...";
    else if (registrationStep === "registering") statusText = "Registering you...";
    else if (registrationStep === "code_required") statusText = "Registration code required";
    else statusText = "Signed in and ready";
  }

  return (
    <div className="page-shell auth-page">
      <div className="auth-container">
        <div className="auth-brand">
          {conferenceConfig.logoUrl ? (
            <img src={conferenceConfig.logoUrl} alt="" className="auth-brand-logo" />
          ) : (
            <div className="auth-brand-fallback">
              <span>{conferenceInitials}</span>
            </div>
          )}
          <div className="auth-brand-divider" />
          <h1>{conferenceName}</h1>
          <p>{user ? "Manage your profile and access conference features." : "Sign in to access your schedule, live sessions, and more."}</p>
        </div>

        <div className="auth-form-panel">
          <div className="auth-status">
            <div>
              <div className="auth-status-text">Status</div>
              <h2>{statusText}</h2>
            </div>
            <div className={`auth-pill ${user ? "online" : "offline"}`}>
              {user ? "Signed in" : "Signed out"}
            </div>
          </div>

          {error && <div className="auth-error">{error}</div>}
          {infoMessage && <div className="auth-success">{infoMessage}</div>}

          {(registrationStep === "checking" || registrationStep === "registering") && (
            <div className="auth-spinner">
              <div className="auth-spinner-ring" />
              <p>{registrationStep === "checking" ? "Checking details..." : "Registering..."}</p>
            </div>
          )}

          {registrationStep === "code_required" && (
            <>
              <div className="auth-code-section">
                <p>This conference is private. Enter the registration code you received to join.</p>
              </div>
              <div className="auth-form">
                <label>
                  Registration Code
                  <input
                    type="text"
                    value={registrationCode}
                    onChange={(e) => setRegistrationCode(e.target.value)}
                    placeholder="e.g. XK7-M9Q"
                    className="auth-input"
                    style={{ textTransform: "uppercase" }}
                  />
                </label>
              </div>
              <div className="auth-actions" style={{ marginTop: 8 }}>
                <button className="primary-button" type="button" onClick={handleJoinWithCode} disabled={loading}>
                  Join Conference
                </button>
                <button className="secondary-button" type="button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            </>
          )}

          {!user && registrationStep === "auth" && (
            <>
              <div className="auth-form">
                <label>
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="auth-input"
                    />
                    <button
                      type="button"
                      className="auth-toggle-password"
                      onClick={() => setShowPassword((v) => !v)}
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

              <div className="auth-links">
                <button
                  type="button"
                  className={`auth-link-btn ${isCreatingAccount ? "active" : ""}`}
                  onClick={() => setIsCreatingAccount(true)}
                >
                  Create account
                </button>
                <button
                  type="button"
                  className={`auth-link-btn ${!isCreatingAccount ? "active" : ""}`}
                  onClick={() => setIsCreatingAccount(false)}
                >
                  Sign In
                </button>
                <button type="button" className="auth-link-btn" onClick={handlePasswordReset}>
                  Forgot Password?
                </button>
              </div>

              <div className="auth-divider">or continue with</div>

              <div className="auth-social">
                <button type="button" className="social-btn" onClick={handleGoogleSignIn} disabled={loading}>
                  <svg className="social-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>
                <button type="button" className="social-btn" onClick={handleGithubSignIn} disabled={loading}>
                  <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>
            </>
          )}

          {user && (
            <>
              <div className="auth-actions" style={{ marginBottom: 8 }}>
                <button className="secondary-button" type="button" onClick={handleSignOut}>
                  Sign out
                </button>
              </div>
              <div className="auth-profile">
                <div>
                  <span>Email</span>
                  <p>{userEmail}</p>
                </div>
                <div>
                  <span>Name</span>
                  <p>{displayName}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

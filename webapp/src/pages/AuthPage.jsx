import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/AuthPage.css";
import {
  createUserWithEmailAndPasswordAuth,
  fetchUserProfile,
  sendPasswordResetEmailAuth,
  signInWithEmailPassword,
  signInWithGithubPopup,
  signInWithGooglePopup,
  signOutUser,
  subscribeAuthState,
} from "../services/localService";
import { useConferenceConfig } from "../context/ConferenceContext.jsx";

export default function AuthPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/profile";

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (currentUser) => {
      setError("");
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        try {
          const profileDoc = await fetchUserProfile(currentUser.uid);
          setProfile(profileDoc);
        } catch (err) {
          console.error(err);
          setError("Unable to load template profile data.");
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [redirectTo]);

  async function handleGoogleSignIn() {
    setError("");
    setInfoMessage("");
    setLoading(true);
    try {
      await signInWithGooglePopup();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleGithubSignIn() {
    setError("");
    setInfoMessage("");
    setLoading(true);
    try {
      await signInWithGithubPopup();
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError("GitHub sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  async function handleEmailAction() {
    setError("");
    setInfoMessage("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPasswordAuth(email, password);
      } else {
        await signInWithEmailPassword(email, password);
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      const message = err?.code || err?.message || "Authentication failed.";
      setError(
        typeof message === "string" ? message : "Authentication failed.",
      );
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setError("");
    setInfoMessage("");

    if (!email) {
      setError("Enter your email address to reset your password.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmailAuth(email);
      setInfoMessage("Password reset link sent to your email.");
    } catch (err) {
      console.error(err);
      const message = err?.code || err?.message || "Password reset failed.";
      setError(
        typeof message === "string" ? message : "Password reset failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    setError("");
    try {
      await signOutUser();
      setProfile(null);
      setUser(null);
    } catch (err) {
      console.error(err);
      setError("Sign out failed. Please try again.");
    }
  }

  const conferenceConfig = useConferenceConfig();
  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Guest";
  const userEmail = profile?.email || user?.email || "guest@elmoultaqa.com";
  const university =
    profile?.university || profile?.school || "No university set";
  const statusText = user
    ? profile
      ? "Signed in and ready to access your conference data."
      : "Signed in; your profile record was not found in the template store."
    : "Use the template credentials a@a.a / aaaaaa to continue.";

  const profileFields = [
    { label: "University", value: university },
    { label: "Email", value: userEmail },
    { label: "Role", value: profile?.schoolLevel || "Not set" },
    { label: "Country", value: profile?.country || "Not set" },
  ];

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
            Use the template email/password or a social sign-in button to access
            the same attendee profile and program data as the mobile
            application.
          </p>
          <div className="auth-features">
            <div>
              <strong>Shared backend</strong>
              <p>
                Your user profile is stored in the local template backend and is
                visible across web and mobile.
              </p>
            </div>
            <div>
              <strong>Secure sign-in</strong>
              <p>
                Authentication uses the template auth adapter with the same
                component flow.
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
          {/* cooperation logos removed — ElMoultaqa brand used site-wide */}
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

            {!user ? (
              <>
                <div className="auth-form">
                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="a@a.a"
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
                        placeholder="aaaaaa"
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

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { useClerkSupabase, resolveOrgSlug } from "@global/supabase";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isLoaded, setActive } = useSignIn();
  const supabase = useClerkSupabase();
  const navigate = useNavigate();
  const { orgSlug } = useParams();

  const handleGoogleSignIn = async () => {
    setError("");
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + `/c/${orgSlug}/admin/sso-callback`,
        redirectUrlComplete: `/c/${orgSlug}/admin/app/dashboard`,
      });
    } catch (err) {
      console.error("[Admin Google Login] Error:", err);
      setError("Google authentication failed. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter a valid email and password.");
      return;
    }

    if (!isLoaded) {
      setError("Authentication is still loading. Please wait.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        password: password.trim(),
      });

      if (result.status === "complete") {
        const details = await resolveOrgSlug(supabase, orgSlug);
        if (details) {
          await setActive({
            organization: details.clerk_org_id,
            session: result.createdSessionId,
          });
        } else {
          console.warn("[Admin Login] Unable to resolve org slug, continuing with session only.");
          await setActive({ session: result.createdSessionId });
        }

        navigate(`/c/${orgSlug}/admin/app/dashboard`);
      } else {
        console.warn("[Admin Login] Incomplete flow status:", result.status);
        setError("Sign-in incomplete. Please complete additional verification steps.");
      }
    } catch (err) {
      console.error("[Admin Login] Error:", err);
      const clerkMessage =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Authentication failed. Please verify your credentials.";
      setError(clerkMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel glass-card">
        <div className="login-header">
          <div className="login-badge">ElMoultaqa Admin</div>
          <h1>Sign in to the ElMoultaqa Dashboard</h1>
          <p>
            Manage conference content, presenters, attendees, and in-app keynote
            data.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elmoultaqa.com"
              disabled={loading}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>
          
          <div className="auth-social-label" style={{ margin: "1.5rem 0 1rem 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>Or sign in with</span>
          </div>

          <button
            type="button"
            className="social-button google"
            style={{ 
              width: "100%", 
              padding: "0.75rem", 
              borderRadius: "8px", 
              background: "#fff", 
              color: "#000", 
              border: "none", 
              cursor: "pointer", 
              fontWeight: "bold", 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              marginBottom: "1rem"
            }}
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </button>

          <p className="login-note">
            Authentication is powered by Clerk. Enter your organization admin credentials or sign in with Google.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

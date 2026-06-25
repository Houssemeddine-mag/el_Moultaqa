import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { useClerkSupabase } from "@global/supabase";

const BASE = "/system";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isLoaded, setActive } = useSignIn();
  const { signOut } = useClerk();
  const supabase = useClerkSupabase();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
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
        await setActive({ session: result.createdSessionId });

        const { data: authorized, error: rpcErr } = await supabase.rpc("is_super_admin");
        if (rpcErr || !authorized) {
          await signOut();
          setError("Access denied. This panel is restricted to authorized platform administrators only.");
          setLoading(false);
          return;
        }

        navigate(`${BASE}/dashboard`);
      } else {
        setError("Sign-in incomplete. Please complete additional verification steps.");
      }
    } catch (err) {
      const msg =
        err?.errors?.[0]?.longMessage ||
        err?.errors?.[0]?.message ||
        err?.message ||
        "Authentication failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: window.location.origin + `${BASE}/sso-callback`,
        redirectUrlComplete: `${BASE}/dashboard`,
      });
    } catch (err) {
      console.error("[SuperAdmin Google Login] Error:", err);
      setError("Google authentication failed.");
    }
  };

  return (
    <div className="sa-login-page">
      <div className="sa-login-card">
        <div className="sa-login-header">
          <h1>Platform Admin</h1>
          <p>Authorized administrators only.</p>
        </div>

        <form className="sa-login-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@elmoultaqa.com"
              disabled={loading}
              autoFocus
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

          {error && <p className="sa-login-error">{error}</p>}

          <button className="sa-btn sa-btn-primary sa-btn-block" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Continue"}
          </button>

          <div className="sa-login-divider">
            <span>Or sign in with</span>
          </div>

          <button
            type="button"
            className="sa-btn sa-btn-google"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}

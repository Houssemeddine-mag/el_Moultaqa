import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { conferenceConfig } from "../conferenceConfig";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/home";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }
    setLoading(true);
    try {
      if (isCreatingAccount) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell auth-layout">
      <section className="auth-copy-panel">
        <span>ElMoultaqa login</span>
        <h1>{conferenceConfig.name}</h1>
        <p>{conferenceConfig.description}</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" disabled>
            {conferenceConfig.dates}
          </button>
          <button className="secondary-button" type="button" disabled>
            {conferenceConfig.location}
          </button>
        </div>
      </section>

      <section className="auth-card">
        <div className="section-header">
          <div>
            <span>{isCreatingAccount ? "Create account" : "Sign in"}</span>
            <h3>
              {isCreatingAccount ? "Register for ElMoultaqa" : "Welcome back"}
            </h3>
          </div>
          <div className={`auth-pill ${loading ? "offline" : "online"}`}>
            {loading
              ? "Loading"
              : isCreatingAccount
                ? "New account"
                : "Returning user"}
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              className="auth-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>
          <label>
            Password
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
            />
          </label>
          {error && <div className="auth-error">{error}</div>}
          <div className="auth-actions">
            <button className="primary-button" type="submit" disabled={loading}>
              {isCreatingAccount ? "Create account" : "Sign in"}
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => setIsCreatingAccount((current) => !current)}
            >
              {isCreatingAccount
                ? "Have an account? Sign in"
                : "Create a new account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminConfig } from "../adminConfig";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter a valid email and password.");
      return;
    }

    localStorage.setItem(
      "rifAdminUser",
      JSON.stringify({ email: email.trim().toLowerCase() }),
    );
    navigate("/app/dashboard");
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
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button className="login-submit" type="submit">
            Continue
          </button>
          <p className="login-note">
            Use any text credentials for now — authentication is stored locally.
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

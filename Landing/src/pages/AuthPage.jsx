export default function AuthPage({
  authMode,
  authEmail,
  authPassword,
  authError,
  onEmailChange,
  onPasswordChange,
  onModeToggle,
  onSubmit,
  onGoogleSignIn,
}) {
  return (
    <main className="landing-main auth-shell">
      <div className="auth-card">
        <h2>
          {authMode === "register"
            ? "Create your account"
            : "Sign in to El Moultaqa"}
        </h2>
        <p>Authenticate to build and publish your custom conference system.</p>

        <div className="auth-social-row">
          <button
            type="button"
            className="secondary-button"
            onClick={onGoogleSignIn}
          >
            Continue with Google
          </button>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          <label>
            Email
            <input
              type="email"
              value={authEmail}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="your@email.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={authPassword}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Choose a strong password"
            />
          </label>
          {authError && <div className="auth-error">{authError}</div>}
          <div className="auth-actions">
            <button type="submit" className="hero-button">
              {authMode === "register" ? "Create account" : "Sign in"}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={onModeToggle}
            >
              {authMode === "register"
                ? "Already have an account?"
                : "Create a new account"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

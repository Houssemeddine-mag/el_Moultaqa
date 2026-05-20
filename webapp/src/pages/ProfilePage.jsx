import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell profile-layout">
      <section className="profile-panel">
        <span>Profile</span>
        <h1>Welcome back, {user?.displayName || "ElMoultaqa User"}</h1>
        <p>Manage your account details and access the conference experience.</p>
        <div className="section-grid">
          <div className="info-card">
            <h4>Email</h4>
            <p>{user?.email}</p>
          </div>
          <div className="info-card">
            <h4>Provider</h4>
            <p>{user?.provider || "Email"}</p>
          </div>
          <div className="info-card">
            <h4>Conference</h4>
            <p>ElMoultaqa 2026</p>
          </div>
        </div>
      </section>

      <section className="profile-panel">
        <span>Account</span>
        <h1>Session details</h1>
        <p>
          Use your profile page to sign out or review the event account linked
          to your login.
        </p>
        <div className="profile-actions">
          <button className="primary-button" type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";

const ErrorPage = () => (
  <div className="error-page">
    <div className="error-card glass-card">
      <h1>404</h1>
      <p>We couldn't find that admin page.</p>
      <Link className="button-secondary" to="/app/dashboard">
        Go back to Dashboard
      </Link>
    </div>
  </div>
);

export default ErrorPage;

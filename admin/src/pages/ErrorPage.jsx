import { Link, useParams } from "react-router-dom";

const ErrorPage = () => {
  const { orgSlug } = useParams();
  const slug = orgSlug || "demo";
  return (
    <div className="error-page">
      <div className="error-card glass-card">
        <h1>404</h1>
        <p>We couldn't find that admin page.</p>
        <Link className="button-secondary" to={`/c/${slug}/admin/app/dashboard`}>
          Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;

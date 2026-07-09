import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="sa-loading-shell">
          <div className="sa-access-card" style={{ textAlign: "center" }}>
            <h2>Something went wrong</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button className="sa-btn sa-btn-primary" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

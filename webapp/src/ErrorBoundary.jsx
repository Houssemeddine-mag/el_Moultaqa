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
        <div className="page-shell" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#121212", color: "#fff" }}>
          <div className="glass-card" style={{ maxWidth: "450px", padding: "3rem", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,68,68,0.2)", background: "rgba(255,68,68,0.02)" }}>
            <h2 style={{ color: "#fff", marginBottom: "1rem" }}>Something went wrong</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.5", fontSize: "0.95rem" }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              className="secondary-button"
              style={{ marginTop: "1.5rem", width: "100%", cursor: "pointer", padding: "0.75rem", borderRadius: "8px", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" }}
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import backend from "../backend.js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const WEBAPP_URL = import.meta.env.VITE_WEBAPP_URL || "http://localhost:5174";

// Status display config
const STATUS_CONFIG = {
  not_built: {
    label: "Not Built",
    color: "var(--text-muted, #888)",
    icon: "○",
    description: "No APK has been built yet for this conference.",
  },
  building: {
    label: "Building…",
    color: "#f59e0b",
    icon: "⟳",
    description: "Your APK is being compiled. This usually takes 5–10 minutes.",
  },
  ready: {
    label: "Ready",
    color: "#10b981",
    icon: "✓",
    description: "Your branded APK is ready to download and share with attendees.",
  },
  failed: {
    label: "Build Failed",
    color: "#ef4444",
    icon: "✗",
    description: "The build encountered an error. Check the log below and retry.",
  },
};

export default function ApplicationsPage() {
  const { orgSlug } = useParams();

  const [buildStatus, setBuildStatus] = useState(null); // raw DB object
  const [_currentBranding, setCurrentBranding] = useState(null);
  const [brandingChanged, setBrandingChanged] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const buildingRef = useRef(false);

  // Load current build status + check for branding drift
  async function loadStatus() {
    try {
      setLoading(true);
      setError("");

      const [status, orgInfo, events] = await Promise.all([
        backend.getMobileBuildStatus(orgSlug),
        backend.getOrgInfo(),
        backend.getEvents(),
      ]);

      setBuildStatus(status);
      buildingRef.current = status?.status === "building";

      // Build current branding snapshot
      const themeColor = events?.[0]?.settings?.themeColor || "#0d7e52";
      const branding = {
        name: orgInfo?.name || "",
        logoUrl: orgInfo?.logoUrl || "",
        themeColor,
      };
      setCurrentBranding(branding);

      // Compare with hash stored at last build time
      if (status?.config_hash && status?.status === "ready") {
        const currentHash = await backend.mobileConfigHash(
          branding.name,
          branding.logoUrl,
          branding.themeColor
        );
        setBrandingChanged(currentHash !== status.config_hash);
      } else {
        setBrandingChanged(false);
      }
    } catch (e) {
      console.error("[ApplicationsPage] loadStatus error:", e);
      setError("Failed to load build status.");
    } finally {
      setLoading(false);
    }
  }

  // Subscribe to Realtime changes so status flips live without a manual refresh
  useEffect(() => {
    loadStatus();

    // Supabase Realtime subscription on the organizations row
    // (subscription setup placeholder)

    // We access activeSupabase via a small workaround — the backend exposes
    // supabaseClient through the initialized instance
    if (typeof window !== "undefined") {
      // Use a simple polling fallback every 10s while building
      const pollId = setInterval(() => {
        if (buildingRef.current) {
          loadStatus();
        }
      }, 10_000);

      return () => clearInterval(pollId);
    }
  }, [orgSlug]);

  async function handleRestoreBuild() {
    try {
      setRestoring(true);
      setError("");
      setSuccess("");
      await backend.restoreMobileBuild(orgSlug);
      setSuccess("Restored previous build successfully!");
      await loadStatus();
    } catch (e) {
      const msg = e?.message || "Unknown error";
      setError(`Restore failed: ${msg}`);
    } finally {
      setRestoring(false);
    }
  }

  async function handleTriggerBuild() {
    try {
      setTriggering(true);
      setError("");
      setSuccess("");
      await backend.triggerMobileBuild(orgSlug);
      setSuccess("Build started! Status will update automatically.");
      // Refresh status immediately
      await loadStatus();
    } catch (e) {
      const msg = e?.message || "Unknown error";
      const friendlyMap = {
        already_building: "A build is already in progress. Please wait.",
        forbidden_not_admin: "You do not have admin permissions to trigger a build.",
        forbidden_org_mismatch: "Your session does not match this organization.",
        github_dispatch_failed: "Failed to contact GitHub. Check the GH_PAT secret.",
      };
      setError(friendlyMap[msg] ?? `Build trigger failed: ${msg}`);
    } finally {
      setTriggering(false);
    }
  }

  const status = buildStatus?.status ?? "not_built";
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.not_built;
  const isBuilding = status === "building";
  const isReady = status === "ready";
  const isFailed = status === "failed";
  const hasPrevBuild = isReady && !!buildStatus?.prev_app_url;

  const webappUrl = `${WEBAPP_URL}/c/${orgSlug}`;
  const apkUrl = buildStatus?.app_url;
  const qrUrl = apkUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(apkUrl)}&color=0d7e52`
    : null;

  return (
    <div className="page-card" style={{ maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 4 }}>Applications</h1>
      <p style={{ color: "var(--text-muted, #888)", marginBottom: 32 }}>
        Manage your web app link and build a branded Android mobile app for your attendees.
      </p>

      {/* ── Web App Link ──────────────────────────────────────────── */}
      <div className="settings-card" style={{ marginBottom: 24 }}>
        <div className="settings-card-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <div>
            <h2>Attendee Web App</h2>
            <p>Share this link with your attendees for the browser-based conference experience.</p>
          </div>
        </div>
        <div className="settings-card-body">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              readOnly
              value={webappUrl}
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "var(--bg-input, #1a1a2e)",
                border: "1px solid var(--border, rgba(255,255,255,0.1))",
                borderRadius: 8,
                color: "inherit",
                fontFamily: "monospace",
                fontSize: 13,
              }}
            />
            <button
              className="btn-secondary"
              onClick={() => {
                navigator.clipboard.writeText(webappUrl).catch(err => console.warn('Clipboard write failed:', err));
              }}
            >
              Copy
            </button>
            <a href={webappUrl} target="_blank" rel="noreferrer" className="btn-secondary">
              Open
            </a>
          </div>
        </div>
      </div>

      {/* ── Mobile App Build ──────────────────────────────────────── */}
      <div className="settings-card">
        <div className="settings-card-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
          </svg>
          <div>
            <h2>Mobile App (Android APK)</h2>
            <p>
              Build a branded Android application with your conference name, logo, and theme
              color pre-configured. Attendees scan a QR code to download it directly.
            </p>
          </div>
        </div>
        <div className="settings-card-body">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />
              <p>Loading build status…</p>
            </div>
          ) : (
            <>
              {/* Status badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "var(--bg-input, #1a1a2e)",
                  borderRadius: 10,
                  border: `1px solid ${statusCfg.color}33`,
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 20, color: statusCfg.color, minWidth: 24, textAlign: "center" }}>
                  {isBuilding ? (
                    <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⟳</span>
                  ) : (
                    statusCfg.icon
                  )}
                </span>
                <div>
                  <strong style={{ color: statusCfg.color }}>{statusCfg.label}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted, #888)" }}>
                    {statusCfg.description}
                  </p>
                  {buildStatus?.built_at && (
                    <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted, #888)" }}>
                      Last built: {new Date(buildStatus.built_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Branding changed warning */}
              {brandingChanged && isReady && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#f59e0b22",
                    border: "1px solid #f59e0b55",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 13,
                  }}
                >
                  ⚠️ <strong>Branding changed since last build.</strong> Consider rebuilding so
                  the APK reflects your latest name, logo, or theme color. The existing APK
                  remains available until the new one is ready.
                </div>
              )}

              {/* Failed error log */}
              {isFailed && buildStatus?.error && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "#ef444422",
                    border: "1px solid #ef444455",
                    borderRadius: 8,
                    marginBottom: 16,
                    fontSize: 12,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  <strong style={{ color: "#ef4444" }}>Build Error:</strong>
                  <br />
                  {buildStatus.error}
                </div>
              )}

              {/* Trigger build button */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
                <button
                  onClick={handleTriggerBuild}
                  disabled={isBuilding || triggering}
                  className="btn-primary"
                  style={{ minWidth: 160 }}
                >
                  {triggering
                    ? "Starting…"
                    : isBuilding
                    ? "Building…"
                    : isReady
                    ? brandingChanged
                      ? "⟳ Rebuild App"
                      : "⟳ Rebuild App"
                    : isFailed
                    ? "⟳ Retry Build"
                    : "▶ Build Mobile App"}
                </button>
                {hasPrevBuild && (
                  <button
                    onClick={handleRestoreBuild}
                    disabled={restoring}
                    className="btn-secondary"
                    style={{ minWidth: 160 }}
                    title="Roll back to the previously deployed APK build"
                  >
                    {restoring ? "Restoring…" : "↩ Restore Previous Build"}
                  </button>
                )}
                {isBuilding && (
                  <span style={{ alignSelf: "center", fontSize: 13, color: "var(--text-muted, #888)" }}>
                    Status updates automatically — no need to refresh.
                  </span>
                )}
              </div>

              {/* Sideload installation guide */}
              {isReady && apkUrl && (
                <div style={{
                  padding: "12px 16px",
                  background: "var(--bg-input, #1a1a2e)",
                  borderRadius: 10,
                  border: "1px solid var(--border, rgba(255,255,255,0.1))",
                  marginBottom: 16,
                  fontSize: 13,
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: "var(--text-muted, #888)" }}>📱 How to install on Android</strong>
                  <ol style={{ margin: "8px 0 0 0", paddingLeft: 20, color: "var(--text-muted, #888)" }}>
                    <li>Open the APK download link on the attendee's Android device (or scan the QR code).</li>
                    <li>If prompted about "Install from unknown sources" or "Play Protect", tap <strong>More details → Install anyway</strong>.</li>
                    <li>After installation, open the app. It will display your conference branding and content.</li>
                  </ol>
                  <p style={{ margin: "8px 0 0 0", fontSize: 12, color: "var(--text-muted, #888)" }}>
                    Build #{buildStatus?.build_number || "—"} &nbsp;·&nbsp; APK signed with your release key
                  </p>
                </div>
              )}

              {/* Success: Download link + QR code */}
              {isReady && apkUrl && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 24,
                    padding: 20,
                    background: "var(--bg-input, #1a1a2e)",
                    borderRadius: 12,
                    border: "1px solid #10b98133",
                    alignItems: "start",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: 15 }}>Download Link</h3>
                    <p style={{ margin: "0 0 12px 0", fontSize: 13, color: "var(--text-muted, #888)" }}>
                      Share this link or the QR code with your attendees so they can install
                      the branded app directly on their Android device.
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <input
                        readOnly
                        value={apkUrl}
                        style={{
                          flex: 1,
                          minWidth: 200,
                          padding: "8px 12px",
                          background: "var(--bg-alt, #111)",
                          border: "1px solid var(--border, rgba(255,255,255,0.1))",
                          borderRadius: 8,
                          color: "inherit",
                          fontFamily: "monospace",
                          fontSize: 12,
                        }}
                      />
                      <button
                        className="btn-secondary"
                        onClick={() => navigator.clipboard.writeText(apkUrl).catch(err => console.warn('Clipboard write failed:', err))}
                      >
                        Copy
                      </button>
                      <a href={apkUrl} target="_blank" rel="noreferrer" className="btn-primary">
                        Download APK
                      </a>
                    </div>
                  </div>
                  {qrUrl && (
                    <div style={{ textAlign: "center" }}>
                      <img
                        src={qrUrl}
                        alt="QR code to download the APK"
                        style={{ width: 140, height: 140, borderRadius: 8, background: "#fff", padding: 4 }}
                      />
                      <p style={{ margin: "6px 0 0 0", fontSize: 12, color: "var(--text-muted, #888)" }}>
                        Scan to download
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback banners */}
              {error && (
                <p style={{ color: "#ef4444", marginTop: 12, fontSize: 13 }}>⚠ {error}</p>
              )}
              {success && (
                <p style={{ color: "#10b981", marginTop: 12, fontSize: 13 }}>✓ {success}</p>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .btn-primary {
          padding: 8px 18px;
          background: var(--accent, #0d7e52);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: opacity 0.15s;
        }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
          padding: 8px 16px;
          background: transparent;
          color: inherit;
          border: 1px solid var(--border, rgba(255,255,255,0.15));
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          transition: background 0.15s;
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Eye, EyeOff, Globe, ShieldAlert, ShieldCheck, AlertCircle, ArrowLeft } from "lucide-react";
import backend from "../backend.js";

const CATEGORIES = [
  "computer_science", "agriculture", "physics", "mathematics",
  "medicine", "engineering", "social_sciences", "arts", "law",
  "economics", "literature", "biology", "chemistry", "education",
  "technology", "philosophy", "other",
];

export default function DiscoveryCardPage() {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState({
    title: "",
    description: "",
    category: "",
    start_date: "",
    end_date: "",
    start_time: "",
    location: "",
    logo_url: "",
    pricing: "free",
  });
  const [isSuperEnabled, setIsSuperEnabled] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cardExists, setCardExists] = useState(false);

  useEffect(() => {
    loadCard();
  }, [orgSlug]);

  useEffect(() => {
    if (!loading && cardExists && !isSuperEnabled) {
      navigate(`/c/${orgSlug}/admin/app/dashboard`, { replace: true });
    }
  }, [loading, cardExists, isSuperEnabled, orgSlug, navigate]);

  async function loadCard() {
    try {
      setLoading(true);
      setError("");
      const data = await backend.getDiscoveryCard(orgSlug);
      if (data) {
        setCardExists(true);
        setCard({
          title: data.title || "",
          description: data.description || "",
          category: data.category || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          start_time: data.start_time || "",
          location: data.location || "",
          logo_url: data.logo_url || "",
          pricing: data.pricing || "free",
        });
        setIsSuperEnabled(!!data.is_super_enabled);
        setIsPublished(!!data.is_org_published);
        setIsBlocked(!!data.is_super_blocked);
      }
    } catch (err) {
      console.error("[DiscoveryCardPage] load error:", err);
      setError("Failed to load discovery card: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  }

  function update(field, value) {
    setCard((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!card.title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await backend.saveDiscoveryCard(orgSlug, card);
      setSuccess("Card saved! Publish it to make it visible on the discovery page.");
      await loadCard();
    } catch (err) {
      setError("Failed to save: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  async function togglePublish() {
    try {
      setPublishing(true);
      setError("");
      setSuccess("");
      if (isPublished) {
        await backend.unpublishDiscoveryCard(orgSlug);
        setIsPublished(false);
        setSuccess("Card unpublished.");
      } else {
        await backend.publishDiscoveryCard(orgSlug);
        setIsPublished(true);
        setSuccess("Card published and visible on the discovery page!");
      }
    } catch (err) {
      setError("Failed to toggle publish: " + (err.message || "Unknown error"));
    } finally {
      setPublishing(false);
    }
  }

  if (loading) {
    return (
      <div className="page-card">
        <div className="loading-spinner" style={{ margin: "40px auto" }} />
      </div>
    );
  }

  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <h1>Discovery Card</h1>
          <p className="subtitle">
            Customize how your conference appears on the global discovery page
            at elmoultaqa.com/discovery.
          </p>
        </div>
      </div>

      {/* Status badges */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        {isSuperEnabled ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(13,126,82,.1)", color: "var(--primary)", fontSize: ".85rem", fontWeight: 600 }}>
            <ShieldCheck size={16} /> Discovery Enabled
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(107,114,128,.1)", color: "#6b7280", fontSize: ".85rem", fontWeight: 600 }}>
            <ShieldAlert size={16} /> Discovery Disabled
          </span>
        )}
        {isPublished ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(37,99,235,.1)", color: "#2563eb", fontSize: ".85rem", fontWeight: 600 }}>
            <Globe size={16} /> Published
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(107,114,128,.1)", color: "#6b7280", fontSize: ".85rem", fontWeight: 600 }}>
            <EyeOff size={16} /> Not Published
          </span>
        )}
        {isBlocked && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "rgba(220,38,38,.1)", color: "#dc2626", fontSize: ".85rem", fontWeight: 600 }}>
            <AlertCircle size={16} /> Blocked by Super Admin
          </span>
        )}
      </div>

      {error && (
        <div style={{ padding: "12px 16px", marginBottom: 16, background: "rgba(239,68,68,.08)", color: "#ef4444", borderRadius: 10, border: "1px solid rgba(239,68,68,.15)", display: "flex", alignItems: "center", gap: 10, fontSize: ".9rem" }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {success && (
        <div style={{ padding: "12px 16px", marginBottom: 16, background: "rgba(13,126,82,.08)", color: "var(--primary)", borderRadius: 10, border: "1px solid rgba(13,126,82,.15)", fontSize: ".9rem" }}>
          {success}
        </div>
      )}

      {!isSuperEnabled && (
        <div style={{ padding: "16px", marginBottom: 24, background: "rgba(245,158,11,.08)", borderRadius: 12, border: "1px solid rgba(245,158,11,.2)", color: "#92400e", fontSize: ".9rem" }}>
          <strong>Discovery not enabled.</strong> A super admin must enable discovery for your organization before you can publish a card.
        </div>
      )}

      <form onSubmit={handleSave} className="settings-form" style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label>
            Conference Title *
            <input type="text" value={card.title} onChange={(e) => update("title", e.target.value)} placeholder="ElMoultaqa Summit 2026" required />
          </label>
          <label>
            Category
            <select value={card.category} onChange={(e) => update("category", e.target.value)}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Description
          <textarea value={card.description} onChange={(e) => update("description", e.target.value)} placeholder="Brief description of your conference..." rows={3} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <label>
            Start Date
            <input type="date" value={card.start_date} onChange={(e) => update("start_date", e.target.value)} />
          </label>
          <label>
            End Date
            <input type="date" value={card.end_date} onChange={(e) => update("end_date", e.target.value)} />
          </label>
          <label>
            Start Time
            <input type="time" value={card.start_time} onChange={(e) => update("start_time", e.target.value)} />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <label>
            Location
            <input type="text" value={card.location} onChange={(e) => update("location", e.target.value)} placeholder="Algiers, Algeria" />
          </label>
          <label>
            Logo URL
            <input type="url" value={card.logo_url} onChange={(e) => update("logo_url", e.target.value)} placeholder="https://.../logo.png" />
          </label>
        </div>

        <label>
          Pricing
          <select value={card.pricing} onChange={(e) => update("pricing", e.target.value)}>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </select>
        </label>

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button type="submit" className="primary-button" disabled={saving} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Save size={18} /> {saving ? "Saving..." : "Save Card"}
          </button>
          {isSuperEnabled && (
            <button type="button" className={`primary-button ${isPublished ? "secondary-button" : ""}`} onClick={togglePublish} disabled={publishing} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
              {publishing ? "..." : isPublished ? "Unpublish" : "Publish"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

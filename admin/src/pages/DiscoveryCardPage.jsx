import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, Eye, EyeOff, Globe, ShieldAlert, ShieldCheck, AlertCircle, ArrowLeft, MessageCircle, ExternalLink, Link2, Users, Camera } from "lucide-react";
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
  const SOCIAL_PLATFORMS = [
    { key: "linkedin", label: "LinkedIn", icon: Link2, color: "#0a66c2" },
    { key: "facebook", label: "Facebook", icon: Users, color: "#1877f2" },
    { key: "instagram", label: "Instagram", icon: Camera, color: "#e4405f" },
    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25d366" },
  ];

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
    official_website_url: "",
  });
  const [socialLinks, setSocialLinks] = useState({});
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

  // Previously auto-redirected when !isSuperEnabled — removed to allow org admin to see disabled banner and contact SuperAdmin. Keep card accessible for save before enable.
  useEffect(() => {
    // no-op: intentionally keep page visible even when discovery not yet enabled
  }, [loading, cardExists, isSuperEnabled, orgSlug]);

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
          official_website_url: data.official_website_url || "",
        });
        setSocialLinks(data.social_links || {});
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

  function updateSoc(platformKey, field, value) {
    setSocialLinks((prev) => ({
      ...prev,
      [platformKey]: { ...(prev[platformKey] || {}), [field]: value },
    }));
  }

  function getSocialValue(platformKey, field) {
    const soc = socialLinks[platformKey] || {};
    return soc[field] || "";
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!card.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!card.official_website_url.trim()) {
      setError("Official Website URL is required.");
      return;
    }

    for (const platform of SOCIAL_PLATFORMS) {
      const soc = socialLinks[platform.key] || {};
      if (soc.active && !soc.url?.trim()) {
        setError(`${platform.label} is activated but no URL is provided. Please enter the URL or deactivate it.`);
        return;
      }
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await backend.saveDiscoveryCard(orgSlug, { ...card, social_links: socialLinks });
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
          Official Website URL *
          <input type="url" value={card.official_website_url} onChange={(e) => update("official_website_url", e.target.value)} placeholder="https://conference-website.com" required />
        </label>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
          <h3 style={{ margin: "0 0 4px 0", fontSize: "1rem", fontWeight: 600 }}>Social Media Links</h3>
          <p style={{ margin: "0 0 16px 0", fontSize: ".85rem", color: "#6b7280" }}>
            Activate the platforms your conference uses and enter the corresponding URLs.
            Activated fields are required.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {SOCIAL_PLATFORMS.map((platform) => {
              const PlatformIcon = platform.icon;
              const isActive = socialLinks[platform.key]?.active || false;
              const urlValue = getSocialValue(platform.key, "url");
              return (
                <div key={platform.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", minWidth: 120, fontWeight: 500 }}>
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => updateSoc(platform.key, "active", e.target.checked)}
                    />
                    <PlatformIcon size={18} style={{ color: isActive ? platform.color : "#9ca3af" }} />
                    {platform.label}
                  </label>
                  {isActive ? (
                    <input
                      type="url"
                      value={urlValue}
                      onChange={(e) => updateSoc(platform.key, "url", e.target.value)}
                      placeholder={`https://${platform.key}.com/your-page`}
                      required
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <span style={{ flex: 1, color: "#9ca3af", fontSize: ".85rem", fontStyle: "italic" }}>
                      Not activated
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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

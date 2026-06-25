import { useState, useEffect } from "react";
import * as api from "../backend.js";

function featuresList(features) {
  if (!features || typeof features !== "object") return [];
  return Object.entries(features)
    .filter(([, v]) => v)
    .map(([k]) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
}

function PlanModal({ plan, onClose, onSave }) {
  const [name, setName] = useState(plan?.name || "");
  const [displayName, setDisplayName] = useState(plan?.display_name || "");
  const [priceCents, setPriceCents] = useState(plan?.price_cents != null ? String(plan.price_cents) : "0");
  const [currency, setCurrency] = useState(plan?.currency || "DZD");
  const [maxEvents, setMaxEvents] = useState(plan?.max_events != null ? String(plan.max_events) : "1");
  const [maxSpeakers, setMaxSpeakers] = useState(plan?.max_speakers != null ? String(plan.max_speakers) : "5");
  const [maxSessions, setMaxSessions] = useState(plan?.max_sessions != null ? String(plan.max_sessions) : "10");
  const [featuresText, setFeaturesText] = useState(
    plan?.features ? featuresList(plan.features).join("\n") : ""
  );
  const [isActive, setIsActive] = useState(plan ? plan.is_active : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !displayName.trim()) {
      setError("Name and display name are required.");
      return;
    }
    setLoading(true);
    try {
      const featureLines = featuresText
        .split("\n")
        .map((l) => l.trim().toLowerCase().replace(/\s+/g, "_"))
        .filter(Boolean);
      const features = {};
      featureLines.forEach((f) => { features[f] = true; });

      await onSave({
        id: plan?.id || null,
        name: name.trim(),
        displayName: displayName.trim(),
        maxEvents: maxEvents === "-1" ? -1 : parseInt(maxEvents) || 1,
        maxSpeakers: maxSpeakers === "-1" ? -1 : parseInt(maxSpeakers) || 5,
        maxSessions: maxSessions === "-1" ? -1 : parseInt(maxSessions) || 10,
        priceCents: parseInt(priceCents) || 0,
        currency: currency,
        features,
        isActive,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal sa-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>{plan ? "Edit Plan" : "New Plan"}</h2>
          <button className="sa-modal-close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="sa-form-row">
            <label>
              Plan Key
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="pro" disabled={!!plan} />
            </label>
            <label>
              Display Name
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Pro" />
            </label>
          </div>
          <div className="sa-form-row">
            <label>
              Price (cents)
              <input type="number" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} placeholder="5000" />
            </label>
            <label>
              Currency
              <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} placeholder="DZD" />
            </label>
          </div>
          <div className="sa-form-row sa-form-row-3">
            <label>
              Max Events (-1 = ∞)
              <input type="number" value={maxEvents} onChange={(e) => setMaxEvents(e.target.value)} />
            </label>
            <label>
              Max Speakers (-1 = ∞)
              <input type="number" value={maxSpeakers} onChange={(e) => setMaxSpeakers(e.target.value)} />
            </label>
            <label>
              Max Sessions (-1 = ∞)
              <input type="number" value={maxSessions} onChange={(e) => setMaxSessions(e.target.value)} />
            </label>
          </div>
          <label>
            Features (one per line)
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              placeholder="live_streaming&#10;analytics&#10;custom_domain"
            />
          </label>
          <label className="sa-checkbox-label">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Active
          </label>
          {error && <p className="sa-login-error">{error}</p>}
          <div className="sa-modal-actions">
            <button type="button" className="sa-btn sa-btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="sa-btn sa-btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editPlan, setEditPlan] = useState(null);
  const [showNew, setShowNew] = useState(false);

  async function loadPlans() {
    try {
      setLoading(true);
      const data = await api.listPlans();
      setPlans(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadPlans(); }, []);

  const handleSave = async (data) => {
    await api.upsertPlan(data);
    await loadPlans();
  };

  const handleToggle = async (planId, currentActive) => {
    await api.togglePlan(planId, !currentActive);
    await loadPlans();
  };

  const handleDelete = async (planId) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    await api.deletePlan(planId);
    await loadPlans();
  };

  if (loading && plans.length === 0) {
    return (
      <div className="sa-loading-shell">
        <div className="sa-loading-container">
          <div className="sa-loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div>
          <h1>Pricing Plans</h1>
          <p>Manage subscription plans and pricing</p>
        </div>
        <button className="sa-btn sa-btn-primary" onClick={() => setShowNew(true)}>
          + Add Plan
        </button>
      </div>

      {error && <div className="sa-error-banner">{error}</div>}

      <div className="sa-plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`sa-plan-card ${!plan.is_active ? "sa-plan-inactive" : ""}`}>
            <div className="sa-plan-header">
              <h3>{plan.display_name}</h3>
              <div className="sa-plan-price">
                {plan.price_cents === 0 ? "Free" : `${(plan.price_cents / 100).toLocaleString()} ${plan.currency}`}
              </div>
            </div>
            <div className="sa-plan-meta">
              <span>{plan.max_events === -1 ? "∞" : plan.max_events} events</span>
              <span>{plan.max_speakers === -1 ? "∞" : plan.max_speakers} speakers</span>
              <span>{plan.max_sessions === -1 ? "∞" : plan.max_sessions} sessions</span>
            </div>
            <ul className="sa-plan-features">
              {featuresList(plan.features).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <div className="sa-plan-actions">
              <label className="sa-toggle">
                <input
                  type="checkbox"
                  checked={plan.is_active}
                  onChange={() => handleToggle(plan.id, plan.is_active)}
                />
                <span className="sa-toggle-slider" />
                <span className="sa-toggle-label">{plan.is_active ? "Active" : "Inactive"}</span>
              </label>
              <div className="sa-plan-btns">
                <button className="sa-btn sa-btn-sm" onClick={() => setEditPlan(plan)}>Edit</button>
                <button className="sa-btn sa-btn-sm sa-btn-danger" onClick={() => handleDelete(plan.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showNew && (
        <PlanModal plan={null} onClose={() => setShowNew(false)} onSave={handleSave} />
      )}
      {editPlan && (
        <PlanModal plan={editPlan} onClose={() => setEditPlan(null)} onSave={handleSave} />
      )}
    </div>
  );
}

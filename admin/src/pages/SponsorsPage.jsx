import React, { useState, useEffect } from "react";
import { Building2, Plus, User, Edit3, Trash2 } from "lucide-react";
import backend from "../backend.js";
import "../styles/keynote-speakers.css";
import ExportButton from "../Components/ExportButton.jsx";

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    logoData: "",
    order: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    loadSponsors();
  }, []);

  const loadSponsors = async () => {
    try {
      setLoading(true);
      const list = await backend.getSponsors();
      setSponsors(list || []);
    } catch (err) {
      console.error("Error loading sponsors:", err);
      setSponsors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    if (imageFile.size > 1024 * 1024) {
      alert("Image too large (max 1MB)");
      return null;
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Please enter a sponsor name");
      return;
    }
    try {
      setLoading(true);
      let logoData = editingSponsor?.logoData || "";
      if (imageFile) {
        const base64 = await uploadImage();
        if (!base64) return;
        logoData = base64;
      }
      const payload = {
        ...formData,
        logoData,
        order: parseInt(formData.order) || 0,
      };
      if (editingSponsor) {
        await backend.updateSponsor(editingSponsor.id, payload);
      } else {
        await backend.addSponsor(payload);
      }
      await loadSponsors();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error("Error saving sponsor:", err);
      alert("Failed to save sponsor");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setEditingSponsor(s);
    setFormData({
      name: s.name || "",
      website: s.website || "",
      logoData: s.logoData || "",
      order: s.order || 0,
    });
    setImagePreview(s.logoData || "");
    setShowModal(true);
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete sponsor ${s.name}?`)) return;
    try {
      setLoading(true);
      await backend.deleteSponsor(s.id);
      await loadSponsors();
    } catch (err) {
      console.error(err);
      alert("Failed to delete sponsor");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", website: "", logoData: "", order: 0 });
    setImageFile(null);
    setImagePreview("");
    setEditingSponsor(null);
  };

  return (
    <div className="keynote-speakers-container">
      <div className="speakers-header">
        <div className="header-content">
          <h1 className="page-title">Sponsors</h1>
          <p className="page-subtitle">
            Manage sponsor names and logos for the conference.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ExportButton
            data={sponsors.map((s) => ({
              Name: s.name,
              Website: s.website,
              Order: s.order,
              "Has Logo": s.logoData ? "Yes" : "No",
            }))}
            filename="sponsors"
            variant="secondary"
          />
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={18} /> Add New Sponsor
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading sponsors...</p>
        </div>
      ) : (
        <div className="speakers-grid">
          {sponsors.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Building2 size={48} /></div>
              <h3>No sponsors yet</h3>
              <p className="subtitle">
                Add sponsors so they appear in the public app and admin
                listings.
              </p>
            </div>
          ) : (
            sponsors.map((s) => (
              <div key={s.id} className="speaker-card">
                <div className="speaker-image-container">
                  {s.logoData ? (
                    <img
                      src={s.logoData}
                      alt={s.name}
                      className="speaker-image"
                    />
                  ) : (
                    <div className="speaker-placeholder">
                      <User size={28} />
                    </div>
                  )}
                  <div className="speaker-order">#{s.order || 0}</div>
                </div>
                <div className="speaker-info">
                  <h3 className="speaker-name">{s.name}</h3>
                  {s.website && (
                    <p className="speaker-institution">
                      <a href={s.website} target="_blank" rel="noreferrer">
                        {s.website}
                      </a>
                    </p>
                  )}
                </div>
                <div className="speaker-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => handleEdit(s)}
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(s)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSponsor ? "Edit Sponsor" : "Add New Sponsor"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="speaker-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, website: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Logo</label>
                  <div className="image-upload-container">
                    <label className="file-input">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      Choose logo image
                    </label>
                    {imagePreview && (
                      <div className="image-preview">
                        <img src={imagePreview} alt="preview" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, order: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    resetForm();
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorsPage;

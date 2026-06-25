import { useEffect, useState } from "react";
import "../style/ProfilePage.css";
import { fetchUserProfile, updateUserProfile } from "../services/localService";
import { useAuth } from "../context/AuthContext.jsx";
import { useClerk } from "@clerk/clerk-react";

const COUNTRIES = [
  "Algeria", "Tunisia", "Libya", "France", "Italy",
  "Germany", "Spain", "Russia", "USA", "Turkey",
];

const WILAYAS = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa",
  "Biskra", "Béchar", "Blida", "Bouïra", "Tamanrasset", "Tébessa",
  "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel",
  "Sétif", "Saïda", "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma",
  "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara", "Ouargla",
  "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès",
  "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma",
  "Aïn Témouchent", "Ghardaïa", "Relizane",
  "El M'Ghair", "El Meniaâ", "Ouled Djellal", "Bordj Badji Mokhtar",
  "Béni Abbès", "Timimoun", "Touggourt", "Djanet", "In Guezzam", "In Salah",
];

function formatDate(value) {
  if (!value) return null;
  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  }
  if (value?.toDate) {
    return value.toDate().toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  if (value instanceof Date) {
    return value.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return null;
}

function getInitials(name) {
  if (!name) return "G";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function computeCompletion(profile) {
  if (!profile) return 0;

  const fields = [
    profile.displayName,
    profile.university,
    profile.schoolLevel,
    profile.country,
    profile.province,
    profile.gender,
    profile.phoneNumber || profile.phone,
    profile.bio,
  ];
  const filled = fields.filter(
    (value) => value && value.toString().trim() !== "",
  ).length;
  return Math.round((filled / fields.length) * 100);
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { signOut } = useClerk();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    displayName: "",
    university: "",
    schoolLevel: "",
    phone: "",
    gender: "male",
    country: "Algeria",
    province: "",
    bio: ""
  });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    setSuccessMessage("");
    const userEmail = profile?.email || user?.email || "";
    try {
      const updated = await updateUserProfile(user.uid, profile.id, { ...formValues, email: userEmail });
      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile modifications.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;

    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const profileRecord = await fetchUserProfile(user.uid, user.email, user.displayName);
        if (!active) return;
        setProfile(profileRecord);
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Unable to load profile data.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user, authLoading]);

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
      setError("Sign out failed.");
    }
  }

  if (authLoading) {
    return (
      <div className="page-shell">
        <div className="status-panel">Loading profile…</div>
      </div>
    );
  }

  const displayName =
    user?.displayName ||
    profile?.displayName ||
    user?.email?.split("@")[0] ||
    "Guest";
  const email = profile?.email || user?.email || "guest@elmoultaqa.com";
  const university =
    profile?.university ||
    profile?.school ||
    "Not set";
  const role = profile?.schoolLevel || "Not set";
  const completion = computeCompletion(profile);
  const photoUrl =
    profile?.photoURL ||
    user?.photoURL ||
    profile?.avatar ||
    profile?.photo ||
    null;
  const createdAt =
    formatDate(profile?.createdAt || profile?.created_at) ||
    formatDate(user?.metadata?.creationTime);

  const contactPhone =
    profile?.phoneNumber || profile?.phone || profile?.mobile || "Not set";
  const aboutText =
    profile?.bio ||
    profile?.about ||
    profile?.summary ||
    "No personal summary has been provided yet.";

  const personalInfoFields = [
    { label: "Gender", value: profile?.gender ? (profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)) : "Not set" },
    { label: "Country", value: profile?.country || "Algeria" },
    { label: "Province", value: profile?.province || "Not set" },
  ];

  const profileFields = [
    { label: "Email Address", value: email },
    { label: "Phone Number", value: contactPhone },
    { label: "Institution / University", value: university },
    { label: "Degree / School Level", value: role },
    { label: "Member Since", value: createdAt || "Not set" }
  ];

  return (
    <div className="page-shell profile-page">
      <div className="profile-hero">
        <div className="hero-backdrop" />
        <div className="hero-overlay" />
        <div className="hero-card">
          <div className="hero-avatar-block">
            <div className="hero-avatar">
              {photoUrl ? (
                <img src={photoUrl} alt={displayName} />
              ) : (
                <span>{getInitials(displayName)}</span>
              )}
            </div>
            <div className="hero-actions-avatar">
              {user ? (
                loading ? (
                  <button className="primary-button small-button" disabled>
                    Loading…
                  </button>
                ) : (
                <>
                  <button
                    className="primary-button small-button edit-toggle-btn"
                    onClick={() => {
                      if (!isEditing && profile) {
                        setFormValues({
                          displayName: profile.displayName || "",
                          university: profile.university || "",
                          schoolLevel: profile.schoolLevel || "",
                          phone: profile.phone || profile.phoneNumber || "",
                          gender: profile.gender || "male",
                          country: profile.country || "Algeria",
                          province: profile.province || "",
                          bio: profile.bio || ""
                        });
                      }
                      setIsEditing(!isEditing);
                    }}
                  >
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                  <button
                    className="secondary-button small-button signout-btn"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </button>
                </>
              )
            ) : null}
            </div>
          </div>

          <div className="hero-content">
            <span className="hero-badge">Attendee profile</span>
            <h1>{displayName}</h1>
            <p className="hero-subtitle">
              {role !== "Not set" ? role : "Attendee"} · {university !== "Not set" ? university : "No Institution"}
            </p>
            <div className="hero-overview-tags">
              <span>{email}</span>
              {profile?.province && <span>{profile.province}, {profile.country || "Algeria"}</span>}
            </div>
            <div className="hero-summary">
              <p>{aboutText}</p>
            </div>
            <div className="hero-detail-grid">
              <div className="hero-detail-item">
                <span>Degree:</span>
                <strong>{role}</strong>
              </div>
              <div className="hero-detail-item">
                <span>Institution:</span>
                <strong>{university}</strong>
              </div>
              <div className="hero-detail-item">
                <span>Gender:</span>
                <strong>{profile?.gender ? (profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)) : "Not set"}</strong>
              </div>
              <div className="hero-detail-item">
                <span>Country:</span>
                <strong>{profile?.country || "Algeria"}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="profile-error">{error}</div>}
      {successMessage && <div className="profile-success">{successMessage}</div>}

      {isEditing ? (
        <form onSubmit={handleSave} className="profile-details-grid edit-form-container">
          <section className="profile-info-panel edit-form-panel">
            <div className="panel-title">
              <span className="panel-eyebrow">Complete Profile</span>
              <h2>Update your personal information</h2>
            </div>
            
            <div className="form-fields-grid">
              <label className="form-label">
                Full Name
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formValues.displayName}
                  onChange={(e) => setFormValues({ ...formValues, displayName: e.target.value })}
                />
              </label>

              <label className="form-label">
                University / Institution
                <input
                  type="text"
                  className="form-input"
                  value={formValues.university}
                  onChange={(e) => setFormValues({ ...formValues, university: e.target.value })}
                />
              </label>

              <label className="form-label">
                School Level / Degree
                <input
                  type="text"
                  className="form-input"
                  value={formValues.schoolLevel}
                  onChange={(e) => setFormValues({ ...formValues, schoolLevel: e.target.value })}
                  placeholder="Master's Degree, PhD, etc."
                />
              </label>

              <label className="form-label">
                Phone Number
                <input
                  type="text"
                  className="form-input"
                  value={formValues.phone}
                  onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                />
              </label>

              <label className="form-label">
                Gender
                <select
                  className="form-select"
                  value={formValues.gender}
                  onChange={(e) => setFormValues({ ...formValues, gender: e.target.value })}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>

              <label className="form-label">
                Country
                <select
                  className="form-select"
                  value={formValues.country}
                  onChange={(e) => {
                    const newCountry = e.target.value;
                    setFormValues({
                      ...formValues,
                      country: newCountry,
                      province: newCountry === "Algeria" ? "" : formValues.province,
                    });
                  }}
                >
                  <option value="">Select a country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="form-label">
                {formValues.country === "Algeria" ? "Wilaya" : "Province"}
                {formValues.country === "Algeria" ? (
                  <select
                    className="form-select"
                    value={formValues.province}
                    onChange={(e) => setFormValues({ ...formValues, province: e.target.value })}
                  >
                    <option value="">Select a wilaya</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-input"
                    value={formValues.province}
                    onChange={(e) => setFormValues({ ...formValues, province: e.target.value })}
                    placeholder={formValues.country ? "Enter your province/region" : "Select a country first"}
                  />
                )}
              </label>
            </div>

            <label className="form-label bio-label">
              Bio / About You
              <textarea
                className="form-textarea"
                value={formValues.bio}
                onChange={(e) => setFormValues({ ...formValues, bio: e.target.value })}
                rows="4"
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={saving}>
                {saving ? "Saving Details..." : "Save Details"}
              </button>
              <button 
                className="secondary-button" 
                type="button" 
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </section>
        </form>
      ) : (
        <div className="profile-details-grid">
          <section className="profile-info-panel">
            <div className="panel-title">
              <span>Profile details</span>
              <h2>All stored attendee information</h2>
            </div>
            <div className="profile-data-grid">
              {profileFields.map((item) => (
                <div key={item.label} className="profile-data-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <div className="profile-sidebar-panels">
            <section className="profile-completion-panel">
              <div className="panel-title">
                <span>Completeness</span>
                <h2>Profile Progress</h2>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-label">
                  <span>Progress</span>
                  <strong>{completion}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
                </div>
                {completion < 100 ? (
                  <p className="progress-recommendation">
                    Tip: Complete your profile by filling all details in the editor.
                  </p>
                ) : (
                  <p className="progress-recommendation complete">
                    🎉 Your profile is 100% complete!
                  </p>
                )}
              </div>
            </section>

            <section className="profile-extra-panel">
              <div className="panel-title">
                <span>Personal info</span>
                <h2>Personal information</h2>
              </div>
              <div className="profile-extra-list">
                {personalInfoFields.map((item) => (
                  <div key={item.label} className="profile-data-item">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}


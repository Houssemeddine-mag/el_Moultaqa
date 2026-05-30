import { useEffect, useState } from "react";
import "../style/ProfilePage.css";
import {
  fetchUserProfile,
  signInWithGooglePopup,
  signOutUser,
  subscribeAuthState,
} from "../services/localService";

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

function getProviderLabel(user) {
  if (!user?.providerData?.length) return "Email";
  return user.providerData
    .map((item) => {
      if (item.providerId === "google.com") return "Google";
      if (item.providerId === "password") return "Email";
      if (item.providerId === "phone") return "Phone";
      return item.providerId;
    })
    .join(", ");
}

function formatProfileValue(key, value) {
  if (value == null) return "Not set";
  if (
    typeof value === "object" &&
    "seconds" in value &&
    "nanoseconds" in value
  ) {
    return formatDate(
      new Date(value.seconds * 1000 + Math.round(value.nanoseconds / 1e6)),
    );
  }
  if (typeof value === "string") {
    const timestampMatch = value.match(
      /^Timestamp\(seconds=(\d+), nanoseconds=(\d+)\)$/,
    );
    if (timestampMatch) {
      return formatDate(
        new Date(
          Number(timestampMatch[1]) * 1000 +
            Math.round(Number(timestampMatch[2]) / 1e6),
        ),
      );
    }
    if (key.toLowerCase().includes("birth")) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }
  }
  return value.toString();
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
    profile.jobTitle || profile.occupation,
    profile.organization || profile.company,
    profile.bio || profile.about,
  ];
  const filled = fields.filter(
    (value) => value && value.toString().trim() !== "",
  ).length;
  return Math.round((filled / fields.length) * 100);
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeAuthState(async (currentUser) => {
      setUser(currentUser);
      setLoading(true);
      setError("");

      if (currentUser) {
        try {
          const profileRecord = await fetchUserProfile(currentUser.uid);
          setProfile(profileRecord);
        } catch (err) {
          console.error(err);
          setError("Unable to load profile data from the template backend.");
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleSignIn() {
    try {
      setLoading(true);
      await signInWithGooglePopup();
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      await signOutUser();
      setProfile(null);
      setUser(null);
    } catch (err) {
      console.error(err);
      setError("Sign out failed.");
    }
  }

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Guest";
  const email = profile?.email || user?.email || "guest@elmoultaqa.com";
  const university =
    profile?.university ||
    profile?.school ||
    "University of Constantine 2 Abdelhamid Mehri";
  const role = profile?.schoolLevel || "Master's Degree";
  const completion = profile?.isProfileComplete
    ? 100
    : computeCompletion(profile);
  const providerName = getProviderLabel(user);
  const photoUrl =
    profile?.photoURL ||
    user?.photoURL ||
    profile?.avatar ||
    profile?.photo ||
    null;
  const createdAt =
    formatDate(profile?.createdAt || profile?.created_at) ||
    formatDate(user?.metadata?.creationTime);
  const lastSignIn =
    formatDate(user?.metadata?.lastSignInTime) ||
    formatDate(profile?.lastSignedIn);
  const profileStatus = profile
    ? "Synced with the template backend"
    : user
      ? "Missing backend record"
      : "Not signed in";

  const contactPhone =
    profile?.phoneNumber || profile?.phone || profile?.mobile || "Not set";
  const jobTitle =
    profile?.jobTitle || profile?.occupation || profile?.position || "Not set";
  const organization =
    profile?.organization || profile?.company || profile?.school || "Not set";
  const aboutText =
    profile?.bio ||
    profile?.about ||
    profile?.summary ||
    "No personal summary has been provided yet.";

  const extraProfileFields = profile
    ? Object.entries(profile)
        .filter(
          ([key, value]) =>
            value != null &&
            ![
              "displayName",
              "email",
              "university",
              "school",
              "schoolLevel",
              "country",
              "province",
              "gender",
              "phoneNumber",
              "phone",
              "jobTitle",
              "occupation",
              "position",
              "organization",
              "company",
              "bio",
              "about",
              "summary",
              "photoURL",
              "avatar",
              "photo",
              "id",
              "uid",
              "createdAt",
              "created_at",
              "updatedAt",
              "lastSignedIn",
            ].includes(key),
        )
        .map(([key, value]) => ({
          label: key,
          value: formatProfileValue(key, value),
        }))
    : [];

  const profileFields = [
    { label: "Email", value: email },
    { label: "Province", value: profile?.province || "Not set" },
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
              {loading ? (
                <button className="primary-button small-button" disabled>
                  Loading…
                </button>
              ) : user ? (
                <button
                  className="secondary-button small-button"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              ) : (
                <button
                  className="primary-button small-button"
                  onClick={handleSignIn}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>

          <div className="hero-content">
            <span>Conference profile</span>
            <h1>{displayName}</h1>
            <p className="hero-subtitle">
              {role} · {organization}
            </p>
            <div className="hero-overview-tags">
              <span>{email}</span>
            </div>
            <div className="hero-summary">
              <p>{aboutText}</p>
            </div>
            <div className="hero-detail-grid">
              <div className="hero-detail-item">
                <span>Role:</span>
                <strong>{role}</strong>
              </div>
              <div className="hero-detail-item">
                <span>University:</span>
                <strong>{university}</strong>
              </div>
              <div className="hero-detail-item">
                <span>Gender:</span>
                <strong>{profile?.gender || "male"}</strong>
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

        <section className="profile-extra-panel">
          <div className="panel-title">
            <span>Additional data</span>
            <h2>Other profile values</h2>
          </div>
          {extraProfileFields.length ? (
            <div className="profile-extra-list">
              {extraProfileFields.map((item) => (
                <div key={item.label} className="profile-data-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="profile-note">
              No extra profile metadata was found. Everything available is shown
              in the main details panel.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
  </svg>
);

const ZapIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const GridIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const DollarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"></path>
  </svg>
);

const sections = [
  { id: "overview", label: "Overview", icon: <HomeIcon /> },
  { id: "getting-started", label: "Getting Started", icon: <ZapIcon /> },
  { id: "apps", label: "Apps", icon: <GridIcon /> },
  { id: "admin-dashboard", label: "Admin", icon: <SettingsIcon /> },
  { id: "features", label: "Features", icon: <StarIcon /> },
  { id: "security", label: "Security", icon: <ShieldIcon /> },
  { id: "pricing", label: "Pricing", icon: <DollarIcon /> },
];

export default function DocumentationPage() {
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    els.forEach((el) => observer.observe(el));
    return () => els.forEach((el) => observer.unobserve(el));
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <main className="landing-main" style={{ position: "relative" }}>
      <div className="section-header">
        <h2>Documentation</h2>
        <p>Everything you need to know about ElMoultaqa</p>
      </div>

      <nav className="doc-bubble-nav">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`doc-bubble${activeId === s.id ? " active" : ""}`}
            onClick={() => scrollTo(s.id)}
            title={s.label}
          >
            <span className="doc-bubble-icon">{s.icon}</span>
            <span className="doc-bubble-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="doc-content">

        <section id="overview" className="doc-section">
          <h3 className="doc-section-title">Overview</h3>
          <p className="doc-section-desc">
            ElMoultaqa is a full-stack conference management platform built for Algerian digital events. It provides four integrated surfaces — a landing page for marketing, a responsive web app for attendees, a progressive web app for mobile access, and an admin dashboard for organizers — all driven by a shared Supabase backend and Clerk authentication.
          </p>
          <div className="feature-grid" style={{ marginTop: "1.5rem" }}>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Three apps, one platform</h3>
              <p>
                The <strong>Web app</strong> serves as the attendee portal with program, speakers, and registration. The <strong>Mobile PWA</strong> mirrors the web app with push notifications and offline access. The <strong>Admin dashboard</strong> gives organizers full CRUD control over every entity — sessions, speakers, users, sponsors, notifications, and more.
              </p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Multi-tenant by design</h3>
              <p>
                Each conference is a separate organization in Clerk with an isolated database schema in Supabase. Attendee data, sessions, speakers, and settings are scoped per event. Organizers authenticate via email/password or Google SSO and are automatically provisioned into their organization.
              </p>
            </article>
          </div>
        </section>

        <section id="getting-started" className="doc-section">
          <h3 className="doc-section-title">Getting Started</h3>
          <p className="doc-section-desc">Your conference goes from idea to live in under 5 minutes — no technical skills needed</p>

          <div className="feature-rows" style={{ marginBottom: "2rem" }}>
            <article className="feature-row" style={{ animation: "none", cursor: "default" }}>
              <div className="feature-row-body">
                <p className="feature-row-desc" style={{ fontSize: "1.05rem", lineHeight: "1.9" }}>
                  Unlike traditional conference platforms that require weeks of setup, developer hours, and complicated infrastructure decisions, ElMoultaqa is designed for speed. Our guided wizard handles everything — from branding to database provisioning — so you can focus on what matters: your content and your attendees. No coding, no hosting setup, no hidden complexity.
                </p>
              </div>
            </article>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>1. Create your conference</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Sign in with your email or Google account — no credit card required. Give your event a name, pick your brand colors from the color picker, and set the dates. Everything you configure is saved as you go, so you can move through the steps at your own pace. The entire process is designed to be finished over a cup of coffee.
              </p>
              <ul className="feature-row-list">
                <li>Sign in with email/password or Google — 10 seconds</li>
                <li>Name your conference and set dates — 30 seconds</li>
                <li>Pick your brand accent color — 15 seconds</li>
                <li>Configure registration (public or code-protected) — 20 seconds</li>
                <li>Add optional collaborators and sponsors — 45 seconds</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>2. Add your content</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Populate your conference with speakers and sessions. Each speaker gets a profile with bio, photo, and social links. Sessions are scheduled with time slots, venues, tracks, and speaker assignments. Add sponsors with logos and tier levels. Everything is editable later — nothing is final until you say it is.
              </p>
              <ul className="feature-row-list">
                <li>Add speakers with bios, photos, and social profiles</li>
                <li>Build the session schedule with time slots and venues</li>
                <li>Organize sessions by tracks and days</li>
                <li>Upload sponsor logos with tier classification</li>
                <li>All content editable anytime before or during the event</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>3. Go live instantly</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "2rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                With one click, your entire conference ecosystem launches. A dedicated web app goes live at your unique URL, a mobile PWA becomes accessible via QR code, and your admin dashboard opens for real-time management. No deployment pipelines, no waiting for DNS propagation, no IT tickets. Your attendees can start registering immediately.
              </p>
              <ul className="feature-row-list">
                <li>Web app live instantly at your dedicated URL</li>
                <li>Mobile PWA accessible via QR code — no app store</li>
                <li>Admin dashboard ready for real-time management</li>
                <li>Attendees can register and explore right away</li>
                <li>Everything works on desktop, tablet, and mobile</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>What happens behind the scenes</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                When you launch, ElMoultaqa automatically creates a dedicated organization for your conference with isolated data storage — your event's data never mixes with another organizer's. Registration settings are saved, and you are immediately redirected to your admin dashboard. The entire process is automatic and takes just a few seconds. You never need to touch a server, configure a database, or deploy code.
              </p>
            </div>
          </div>

          <div style={{ marginTop: "2rem", padding: "24px 28px", background: "rgba(13, 126, 82, 0.06)", borderRadius: "20px", border: "1px solid rgba(13, 126, 82, 0.12)" }}>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: "1.8", fontSize: "1rem" }}>
              <strong style={{ color: "var(--primary)" }}>No commitment needed.</strong> Start with the free Starter plan — no credit card, no time limit. If your event grows, upgrade to Professional or Enterprise at any time. All your data, settings, and branding carry over automatically.
            </p>
          </div>
        </section>

        <section id="apps" className="doc-section">
          <h3 className="doc-section-title">Apps</h3>
          <p className="doc-section-desc">Two attendee experiences that work together seamlessly</p>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Mobile App (PWA)</h4>
          <div className="feature-rows">
            <article className="feature-row" style={{ animation: "none", cursor: "default" }}>
              <div className="feature-row-body">
                <p className="feature-row-desc">
                  A progressive web app that works like a native app on any device. Installable on the home screen — no app store needed. Attendees access real-time schedules, speaker bios, push notifications, live Q&A, session ratings, and QR code tickets.
                </p>
                <ul className="feature-row-list">
                  <li>Multi-day program with filtering by day and track</li>
                  <li>Speaker profiles with bios, photos, and social links</li>
                  <li>Push notifications sent directly from the admin panel</li>
                  <li>Live Q&A — attendees submit questions during sessions</li>
                  <li>Session ratings after each talk</li>
                  <li>Sponsor and exhibitor listing pages</li>
                  <li>QR code ticket for fast on-site check-in</li>
                  <li>Keynote pages with rich content</li>
                </ul>
              </div>
            </article>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Web App (Attendee Portal)</h4>
          <div className="feature-rows">
            <article className="feature-row" style={{ animation: "none", cursor: "default" }}>
              <div className="feature-row-body">
                <p className="feature-row-desc">
                  Fully responsive attendee portal that works on desktop, tablet, and mobile. Attendees register, browse the program, bookmark sessions, explore speaker profiles, and manage their profile — all from the browser.
                </p>
                <ul className="feature-row-list">
                  <li>Session bookmarking to build a personal schedule</li>
                  <li>Secure registration with public or access-code modes</li>
                  <li>Profile management with country and Algerian wilaya selection</li>
                  <li>Live program updates — changes reflect instantly</li>
                  <li>Keynote and special event pages</li>
                  <li>Sponsor and exhibitor pages</li>
                  <li>Integrated with the mobile PWA for seamless switching</li>
                </ul>
              </div>
            </article>
          </div>
        </section>

        <section id="admin-dashboard" className="doc-section">
          <h3 className="doc-section-title">Admin Dashboard</h3>
          <p className="doc-section-desc">Full command center for conference organizers</p>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Dashboard</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                The dashboard provides an overview of your conference with stat cards showing total sessions, speakers, sponsors, presentations, ratings, notifications, questions, and registered users. A quick-action toolbar lets you navigate to any management section. The event banner displays your conference logo and name with a gradient accent.
              </p>
              <ul className="feature-row-list">
                <li>Stat cards with count summaries for every entity type</li>
                <li>Quick action buttons for common tasks</li>
                <li>Event banner with logo and branding</li>
                <li>Glass-morphism design with responsive layout</li>
                <li>Fade-in animations and hover lift effects</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Sessions & Speakers</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Full CRUD for sessions and speakers with reordering support. Each session can be assigned a speaker, a date/time slot, a venue, and a track. Speakers have bios, photos, and social links. Sessions can be marked as canceled or checked in.
              </p>
              <ul className="feature-row-list">
                <li>Create, edit, delete sessions and speakers</li>
                <li>Reorder sessions by drag or up/down buttons</li>
                <li>Assign speakers to sessions</li>
                <li>Set session date, time, venue, and track</li>
                <li>Cancel or restore sessions</li>
                <li>Check-in tracking for speakers</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Users & Analytics</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                View and manage registered users with built-in analytics. A pure SVG donut chart visualizes user distribution by gender, country, or wilaya — toggle between the three views. User profiles include name, email, phone, country, and wilaya.
              </p>
              <ul className="feature-row-list">
                <li>User list with search and filtering</li>
                <li>Donut chart analytics by gender, country, and wilaya</li>
                <li>Zero external chart dependencies — pure SVG</li>
                <li>User profile details with contact information</li>
                <li>Registration date tracking</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Event Manager</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                The event manager provides a calendar-style overview of all sessions. See what is scheduled on each day, filter by track, and manage sessions directly from the calendar view.
              </p>
              <ul className="feature-row-list">
                <li>Calendar view of all sessions across conference days</li>
                <li>Filter sessions by track or day</li>
                <li>Direct edit and check-in from calendar</li>
                <li>Visual time slots for each session</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Presentations</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Manage presentation files and materials for each session. Upload slides, handouts, or other resources that attendees can access.
              </p>
              <ul className="feature-row-list">
                <li>Upload presentation files per session</li>
                <li>Organize materials by session and speaker</li>
                <li>Attendee-accessible from web and mobile apps</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Database Management</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Clean up your conference data with granular control. Each entity type (sessions, speakers, presentations, ratings, notifications, questions) can be cleared individually with a confirmation modal. The "Clear Everything" option removes all data except users, events, and tickets.
              </p>
              <ul className="feature-row-list">
                <li>Individual clear buttons for each data type</li>
                <li>Modal confirmation with code-typing verification</li>
                <li>Clear Everything option for full reset</li>
                <li>Protected — users, events, and tickets are never deleted</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="features" className="doc-section">
          <h3 className="doc-section-title">Features</h3>
          <p className="doc-section-desc">Everything from ticketing to branding — all built in</p>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Registration & Ticketing</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Two registration modes per conference. <strong>Public</strong> lets anyone register freely. <strong>Code-protected</strong> requires an access code you distribute to approved attendees. QR code tickets are generated for each attendee. Registration settings (mode, code) are stored per-event in the admin settings panel.
              </p>
              <ul className="feature-row-list">
                <li>Public registration — open to all</li>
                <li>Code-protected registration — invite-only</li>
                <li>QR code generation for each attendee ticket</li>
                <li>Attendee collects name, email, phone, country, wilaya</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Push Notifications</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Compose and send push notifications to all registered attendees from the admin panel. Add a title, body, and optional image. Notifications appear in-app and as push alerts on mobile. History with timestamps, pinning, and read/unread tracking.
              </p>
              <ul className="feature-row-list">
                <li>Compose with title, body, and optional image</li>
                <li>Instant delivery to all attendees</li>
                <li>In-app notification center + mobile push alerts</li>
                <li>History with pinning and read tracking</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Sponsors</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Manage sponsors with logo uploads, tier levels (Platinum, Gold, Silver, Bronze), and website links. Displayed across web app, mobile app, and landing page with tier badges.
              </p>
              <ul className="feature-row-list">
                <li>CRUD with logo image upload</li>
                <li>Platinum / Gold / Silver / Bronze tiers</li>
                <li>Website URL linking</li>
                <li>Displayed on web, mobile, and landing</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Q&A / Questions</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Attendees submit questions during sessions from mobile or web. Organizers moderate — approve to display or dismiss. Session-scoped, real-time, with answered-badge tracking.
              </p>
              <ul className="feature-row-list">
                <li>Submit questions from mobile and web apps</li>
                <li>Admin moderation — approve or dismiss</li>
                <li>Session-scoped with real-time updates</li>
                <li>Answered badge tracking</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Ratings</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default", marginBottom: "1rem" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                After each session, attendees rate the talk. Ratings aggregate in the admin dashboard for session performance insights and stat card tracking.
              </p>
              <ul className="feature-row-list">
                <li>Post-session rating from attendees</li>
                <li>Aggregated in admin dashboard</li>
                <li>Session performance insights</li>
              </ul>
            </div>
          </div>

          <h4 style={{ margin: "1.5rem 0 1rem", color: "var(--text)", fontSize: "1.1rem" }}>Settings & Branding</h4>
          <div className="feature-row" style={{ animation: "none", cursor: "default" }}>
            <div className="feature-row-body">
              <p className="feature-row-desc">
                Every conference has per-event settings in the database. Configure name, acronym, tagline, description, accent color, logo, and cover image. Registration mode and code are managed here. Changes reflect instantly across all surfaces.
              </p>
              <ul className="feature-row-list">
                <li>Name, acronym, tagline, description</li>
                <li>Accent color picker — customizes UI theme</li>
                <li>Logo on landing, web, mobile, and admin</li>
                <li>Cover image for hero section</li>
                <li>Registration mode and code management</li>
                <li>Per-event — not global, stored in Supabase</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="security" className="doc-section">
          <h3 className="doc-section-title">Security</h3>
          <p className="doc-section-desc">Your data and events are protected at every layer</p>
          <div className="feature-grid">
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>End-to-end encryption</h3>
              <p>All data transmitted between servers and users is encrypted using TLS 1.3. Sensitive data is encrypted at rest using AES-256.</p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Authentication & access control</h3>
              <p>Clerk provides secure authentication with email/password and Google SSO. Role-based access control ensures only authorized organizers can manage conference settings.</p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Data isolation</h3>
              <p>Each conference operates in an isolated database schema. Your event data is completely separate from other organizations. No cross-tenant data leakage.</p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Multi-tenant architecture</h3>
              <p>Clerk organizations map to Supabase schemas. Each conference has its own set of tables for sessions, speakers, users, and settings. The platform is designed with tenant isolation from day one.</p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>GDPR compliance</h3>
              <p>We follow GDPR best practices for data handling. Attendees can request data export or account deletion at any time. Personal data is collected transparently.</p>
            </article>
            <article className="feature-card">
              <h3 style={{ marginTop: 0 }}>Infrastructure security</h3>
              <p>Hosted on trusted cloud providers with DDoS protection, network firewalls, and 24/7 monitoring to ensure platform availability. Regular security audits are performed.</p>
            </article>
          </div>
        </section>

        <section id="pricing" className="doc-section">
          <h3 className="doc-section-title">Pricing</h3>
          <p className="doc-section-desc">Choose the plan that fits your event</p>
          <div className="pricing-grid">
            <article className="pricing-card">
              <h3>Starter</h3>
              <div className="pricing-amount"><strong>Free</strong></div>
              <p>Perfect for small meetups and community events.</p>
              <ul>
                <li>Up to 100 attendees</li>
                <li>Basic web app</li>
                <li>Session scheduling</li>
                <li>Speaker management</li>
                <li>Email support</li>
              </ul>
              <button className="hero-button">Get started</button>
            </article>
            <article className="pricing-card highlighted">
              <span className="pricing-badge">Most popular</span>
              <h3>Professional</h3>
              <div className="pricing-amount"><strong>$29</strong><span>/month</span></div>
              <p>Ideal for mid-size conferences and workshops.</p>
              <ul>
                <li>Up to 500 attendees</li>
                <li>Web + mobile apps</li>
                <li>Push notifications</li>
                <li>Real-time analytics</li>
                <li>Sponsor management</li>
                <li>Priority support</li>
              </ul>
              <button className="hero-button">Get started</button>
            </article>
            <article className="pricing-card">
              <h3>Enterprise</h3>
              <div className="pricing-amount"><strong>$99</strong><span>/month</span></div>
              <p>For large-scale events and multi-track conferences.</p>
              <ul>
                <li>Unlimited attendees</li>
                <li>Full white-label branding</li>
                <li>Custom domain</li>
                <li>API access</li>
                <li>Advanced analytics</li>
                <li>Dedicated support</li>
              </ul>
              <button className="hero-button">Get started</button>
            </article>
          </div>
        </section>

      </div>
    </main>
  );
}

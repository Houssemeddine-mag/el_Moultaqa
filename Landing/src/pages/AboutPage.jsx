import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
    <path d="M16 3.13a4 4 0 010 7.75"></path>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <polyline points="22,7 12,13 2,7"></polyline>
  </svg>
);

const sections = [
  { id: "about", label: "About Us", icon: <UsersIcon /> },
  { id: "contact", label: "Contact", icon: <MailIcon /> },
];

export default function AboutPage() {
  const { hash } = useLocation();
  const [activeId, setActiveId] = useState("about");

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [hash]);

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
        <h2>About Us</h2>
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
        <section id="about" className="doc-section">
          <h3 className="doc-section-title">Who We Are</h3>

          <div className="feature-rows">
            <article className="feature-row" style={{ animation: "none", cursor: "default", animationDelay: "0.1s" }}>
              <div className="feature-row-body">
                <p className="feature-row-desc" style={{ fontSize: "1.05rem", lineHeight: "1.9" }}>
                  ElMoultaqa was built to solve a simple problem: organizing a conference in Algeria should not require weeks of setup, technical expertise, or expensive infrastructure. We created a platform where anyone — from a university club to a professional event organizer — can launch a fully branded conference experience in minutes.
                </p>
              </div>
            </article>
          </div>

          <div className="feature-grid">
            <article className="feature-card" style={{ animationDelay: "0.15s" }}>
              <h3 style={{ marginTop: 0 }}>Our Mission</h3>
              <p>
                We believe that great conferences should be accessible to everyone. Our mission is to remove the technical barriers that prevent organizers from focusing on what matters: creating meaningful experiences for their attendees. ElMoultaqa handles the complexity so you can focus on content, community, and connection.
              </p>
            </article>
            <article className="feature-card" style={{ animationDelay: "0.2s" }}>
              <h3 style={{ marginTop: 0 }}>What We Offer</h3>
              <p>
                A complete conference ecosystem: a responsive web app for attendees, a progressive mobile app with push notifications, and a powerful admin dashboard for organizers. All three surfaces are branded with your identity, connected to your data, and ready to use the moment you launch.
              </p>
            </article>
            <article className="feature-card" style={{ animationDelay: "0.25s" }}>
              <h3 style={{ marginTop: 0 }}>Our Values</h3>
              <p>
                Simplicity, reliability, and accessibility. We design every feature to be intuitive and every interaction to be smooth. We respect your data with industry-standard security and tenant isolation. We build for the Algerian digital community first, with local needs like wilaya-based profiles and Arabic-friendly interfaces.
              </p>
            </article>
          </div>

          <div className="feature-rows" style={{ marginTop: "1.5rem" }}>
            <article className="feature-row" style={{ animation: "none", cursor: "default", animationDelay: "0.3s" }}>
              <div className="feature-row-body">
                <h3 style={{ marginBottom: "0.5rem" }}>Why the name ElMoultaqa?</h3>
                <p className="feature-row-desc">
                  "ElMoultaqa" (الملتقى) means "the gathering" or "the meeting point" in Arabic. It reflects our purpose: bringing people together around ideas, knowledge, and shared experiences. Every conference hosted on our platform is a gathering that matters, and we are proud to be part of it.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="contact" className="doc-section">
          <h3 className="doc-section-title">Get in Touch</h3>
          <p className="doc-section-desc">We would love to hear from you</p>

          <div className="feature-rows">
            <article className="feature-row" style={{ animation: "none", cursor: "default", animationDelay: "0.15s" }}>
              <div className="feature-row-icon" style={{ width: "56px", height: "56px", padding: "14px", background: "rgba(13, 126, 82, 0.1)", borderRadius: "16px" }}>
                <MailIcon />
              </div>
              <div className="feature-row-body">
                <h3>Email</h3>
                <p className="feature-row-desc" style={{ fontSize: "1.05rem" }}>
                  <a href="mailto:el.moultaqa2026@gmail.com" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
                    el.moultaqa2026@gmail.com
                  </a>
                </p>
                <p className="feature-row-desc">
                  For general inquiries, partnerships, support requests, or anything else — send us an email and we will get back to you as soon as possible.
                </p>
              </div>
            </article>
          </div>

          <div style={{ marginTop: "2rem", padding: "32px", background: "rgba(255, 255, 255, 0.96)", borderRadius: "28px", border: "1px solid rgba(13, 126, 82, 0.1)", boxShadow: "0 24px 70px rgba(13, 71, 50, 0.08)", animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
            <h3 style={{ margin: "0 0 1.5rem", color: "var(--text)", fontSize: "1.2rem" }}>Send us a message</h3>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <input type="text" placeholder="Your name" style={{ padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(13, 126, 82, 0.15)", background: "#f8fafc", fontFamily: "inherit", fontSize: "0.95rem" }} />
                <input type="email" placeholder="Your email" style={{ padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(13, 126, 82, 0.15)", background: "#f8fafc", fontFamily: "inherit", fontSize: "0.95rem" }} />
              </div>
              <input type="text" placeholder="Subject" style={{ padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(13, 126, 82, 0.15)", background: "#f8fafc", fontFamily: "inherit", fontSize: "0.95rem" }} />
              <textarea placeholder="Your message" rows="5" style={{ padding: "14px 16px", borderRadius: "14px", border: "1px solid rgba(13, 126, 82, 0.15)", background: "#f8fafc", fontFamily: "inherit", fontSize: "0.95rem", resize: "vertical" }}></textarea>
              <button type="submit" className="hero-button" style={{ alignSelf: "flex-start" }}>Send message</button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

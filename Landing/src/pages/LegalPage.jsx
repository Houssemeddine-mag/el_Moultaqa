import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path>
    <line x1="12" y1="9" x2="12" y2="13"></line>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const sections = [
  { id: "privacy", label: "Privacy Policy", icon: <ShieldIcon /> },
  { id: "terms", label: "Terms of Service", icon: <FileIcon /> },
  { id: "cookies", label: "Cookie Policy", icon: <InfoIcon /> },
  { id: "disclaimer", label: "Disclaimer", icon: <AlertIcon /> },
];

export default function LegalPage() {
  const { hash } = useLocation();
  const [activeId, setActiveId] = useState("privacy");

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

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [hash]);

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
        <h2>Legal Terms</h2>
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
        <section id="privacy" className="doc-section">
          <h3 className="doc-section-title">Privacy Policy</h3>
          <p className="doc-section-desc">Last updated: June 2026</p>

          <div className="legal-block">
            <h4>1. Introduction</h4>
            <p>
              ElMoultaqa ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our conference management platform, including the landing page, web app, mobile app, and admin dashboard (collectively, the "Platform").
            </p>
            <p>
              By accessing or using the Platform, you agree to the collection and use of information in accordance with this policy. If you do not agree, please do not use the Platform.
            </p>

            <h4>2. Information We Collect</h4>
            <p>We collect information that you provide directly to us, including:</p>
            <ul className="feature-row-list">
              <li><strong>Account information</strong> — name, email address, and password when you register via Clerk authentication</li>
              <li><strong>Profile information</strong> — phone number, country, and wilaya (state) when you complete your attendee profile</li>
              <li><strong>Conference data</strong> — session schedules, speaker bios, sponsor details, and other content you upload as an organizer</li>
              <li><strong>Communications</strong> — questions submitted during sessions and any correspondence you send to us</li>
            </ul>
            <p>We also collect certain information automatically:</p>
            <ul className="feature-row-list">
              <li><strong>Usage data</strong> — pages visited, features used, time spent, and interactions within the Platform</li>
              <li><strong>Device information</strong> — browser type, operating system, device type, and IP address</li>
              <li><strong>Cookies and tracking</strong> — see our Cookie Policy below for details</li>
            </ul>

            <h4>3. How We Use Your Information</h4>
            <p>We use the collected information for the following purposes:</p>
            <ul className="feature-row-list">
              <li>To provide, maintain, and improve the Platform and its features</li>
              <li>To process registrations and manage conference attendance</li>
              <li>To send push notifications and important updates about conferences</li>
              <li>To communicate with you about your account, including support requests</li>
              <li>To analyze usage patterns and optimize the user experience</li>
              <li>To detect, prevent, and address technical issues and security threats</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>

            <h4>4. Data Storage and Security</h4>
            <p>
              Your data is stored securely on Supabase servers with encryption at rest (AES-256) and in transit (TLS 1.3). Each conference operates in an isolated database schema, ensuring that your data is never mixed with other organizations. We implement industry-standard security measures, including access controls, network firewalls, and regular security audits.
            </p>

            <h4>5. Data Sharing and Disclosure</h4>
            <p>We do not sell your personal information. We may share your data in the following circumstances:</p>
            <ul className="feature-row-list">
              <li><strong>Service providers</strong> — with trusted third-party services (Clerk for authentication, Supabase for database hosting) that are contractually bound to protect your data</li>
              <li><strong>Legal requirements</strong> — if required by law, regulation, or legal process, such as a court order or subpoena</li>
              <li><strong>With your consent</strong> — we may share information when you have given us explicit permission</li>
            </ul>

            <h4>6. Your Rights</h4>
            <p>Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="feature-row-list">
              <li><strong>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong>Rectification</strong> — request correction of inaccurate or incomplete data</li>
              <li><strong>Deletion</strong> — request deletion of your personal data, subject to certain legal exceptions</li>
              <li><strong>Portability</strong> — request transfer of your data to another service provider</li>
              <li><strong>Objection</strong> — object to the processing of your data for certain purposes</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <strong>privacy@elmoultaqa.com</strong>.</p>

            <h4>7. Data Retention</h4>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide the Platform. Conference data is retained until the conference organizer requests deletion via the database management tools in the admin dashboard. When you request account deletion, we will delete your personal data within 30 days, subject to legal retention requirements.
            </p>

            <h4>8. International Data Transfers</h4>
            <p>
              Your information may be transferred to and processed in countries other than your own. We ensure that appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
            </p>

            <h4>9. Changes to This Policy</h4>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
            </p>

            <h4>10. Contact</h4>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at <strong>privacy@elmoultaqa.com</strong>.
            </p>
          </div>
        </section>

        <section id="terms" className="doc-section">
          <h3 className="doc-section-title">Terms of Service</h3>
          <p className="doc-section-desc">Last updated: June 2026</p>

          <div className="legal-block">
            <h4>1. Acceptance of Terms</h4>
            <p>
              By accessing or using ElMoultaqa ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to all the terms, you may not access or use the Platform. These terms apply to all visitors, users, and others who access or use the Platform.
            </p>

            <h4>2. Description of Service</h4>
            <p>
              ElMoultaqa provides a conference management platform that enables organizers to create and manage conferences, including attendee registration, session scheduling, speaker management, push notifications, Q&A, ratings, and sponsor management. The Platform includes a web app, mobile progressive web app, admin dashboard, and landing page.
            </p>

            <h4>3. Account Registration</h4>
            <p>
              To use the Platform, you must create an account through Clerk authentication. You agree to:
            </p>
            <ul className="feature-row-list">
              <li>Provide accurate, current, and complete account information</li>
              <li>Maintain and update your account information as needed</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>

            <h4>4. User Responsibilities</h4>
            <p>As a user of the Platform, you agree not to:</p>
            <ul className="feature-row-list">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws</li>
              <li>Upload or share content that is defamatory, obscene, or infringes on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Interfere with or disrupt the integrity or performance of the Platform</li>
              <li>Use automated means (bots, scrapers, etc.) without our express permission</li>
              <li>Impersonate another person or entity</li>
            </ul>

            <h4>5. Conference Content</h4>
            <p>
              You retain all ownership rights to the content you upload to your conference, including session descriptions, speaker bios, sponsor logos, and other materials. By uploading content, you grant us a non-exclusive, worldwide, royalty-free license to host, store, and display that content solely for the purpose of providing the Platform.
            </p>

            <h4>6. Payment and Billing</h4>
            <p>
              ElMoultaqa offers free and paid subscription plans. Paid plans are billed monthly in advance. You agree to pay all fees associated with your chosen plan. Fees are non-refundable except as expressly stated in our refund policy. We may change our fees with 30 days notice. Continued use after the fee change constitutes acceptance of the new fees.
            </p>

            <h4>7. Cancellation and Termination</h4>
            <p>
              You may cancel your account at any time from the admin dashboard. Upon cancellation, your conference data will be retained for 30 days before permanent deletion. We may terminate or suspend your account if you violate these Terms or engage in conduct that harms the Platform or other users. Upon termination, your right to use the Platform ceases immediately.
            </p>

            <h4>8. Intellectual Property</h4>
            <p>
              The ElMoultaqa name, logo, and Platform interface are proprietary. You may not copy, modify, distribute, sell, or lease any part of the Platform without our written permission. The Platform is protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h4>9. Limitation of Liability</h4>
            <p>
              To the maximum extent permitted by law, ElMoultaqa shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform. Our total liability for any claims under these terms shall not exceed the amount you have paid us in the twelve months preceding the claim.
            </p>

            <h4>10. Indemnification</h4>
            <p>
              You agree to indemnify and hold ElMoultaqa harmless from any claims, damages, losses, liabilities, and expenses arising out of your use of the Platform, your violation of these Terms, or your violation of any third-party rights.
            </p>

            <h4>11. Changes to Terms</h4>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of material changes via email or Platform notification. Your continued use of the Platform after changes take effect constitutes acceptance of the new Terms.
            </p>

            <h4>12. Governing Law</h4>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the People's Democratic Republic of Algeria. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Algeria.
            </p>

            <h4>13. Contact</h4>
            <p>
              For questions about these Terms, please contact us at <strong>legal@elmoultaqa.com</strong>.
            </p>
          </div>
        </section>

        <section id="cookies" className="doc-section">
          <h3 className="doc-section-title">Cookie Policy</h3>
          <p className="doc-section-desc">Last updated: June 2026</p>

          <div className="legal-block">
            <h4>1. What Are Cookies</h4>
            <p>
              Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners. This Cookie Policy explains what cookies we use, why we use them, and how you can control them.
            </p>

            <h4>2. How We Use Cookies</h4>
            <p>We use cookies for the following purposes:</p>
            <ul className="feature-row-list">
              <li><strong>Essential cookies</strong> — required for the Platform to function properly, including authentication and session management. These cannot be disabled.</li>
              <li><strong>Authentication cookies</strong> — used by Clerk to remember your login session so you do not have to log in repeatedly</li>
              <li><strong>Preference cookies</strong> — remember your settings and preferences, such as language and theme choices</li>
              <li><strong>Analytics cookies</strong> — help us understand how users interact with the Platform so we can improve it</li>
            </ul>

            <h4>3. Third-Party Cookies</h4>
            <p>We use the following third-party services that may set cookies:</p>
            <ul className="feature-row-list">
              <li><strong>Clerk</strong> — authentication and session management</li>
              <li><strong>Supabase</strong> — database and real-time functionality</li>
            </ul>
            <p>These third parties have their own privacy and cookie policies governing the use of your information.</p>

            <h4>4. Managing Cookies</h4>
            <p>
              Most web browsers allow you to control cookies through browser settings. You can typically:
            </p>
            <ul className="feature-row-list">
              <li>View cookies stored on your device and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific websites</li>
              <li>Set your browser to notify you when a cookie is set</li>
            </ul>
            <p>
              Please note that disabling essential cookies may affect the functionality of the Platform, and some features may not work as intended.
            </p>

            <h4>5. Changes to This Policy</h4>
            <p>
              We may update this Cookie Policy from time to time. We encourage you to review this page periodically for any changes.
            </p>

            <h4>6. Contact</h4>
            <p>
              If you have questions about our use of cookies, please contact us at <strong>privacy@elmoultaqa.com</strong>.
            </p>
          </div>
        </section>

        <section id="disclaimer" className="doc-section">
          <h3 className="doc-section-title">Disclaimer</h3>
          <p className="doc-section-desc">Last updated: June 2026</p>

          <div className="legal-block">
            <h4>1. General Disclaimer</h4>
            <p>
              The information and services provided by ElMoultaqa are offered on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, regarding the operation, availability, or suitability of the Platform for your specific needs.
            </p>

            <h4>2. No Warranty</h4>
            <p>
              To the fullest extent permitted by applicable law, ElMoultaqa disclaims all warranties, whether express, implied, or statutory, including but not limited to:
            </p>
            <ul className="feature-row-list">
              <li>Implied warranties of merchantability, fitness for a particular purpose, and non-infringement</li>
              <li>Warranties that the Platform will be uninterrupted, error-free, or secure</li>
              <li>Warranties that defects will be corrected or that the Platform is free of viruses or other harmful components</li>
            </ul>

            <h4>3. Service Availability</h4>
            <p>
              While we strive to maintain high availability, we do not guarantee that the Platform will be available at all times. We may experience downtime for maintenance, updates, or due to factors beyond our control. We are not liable for any loss or inconvenience caused by service interruptions.
            </p>

            <h4>4. Third-Party Links and Services</h4>
            <p>
              The Platform may contain links to third-party websites or services that are not owned or controlled by ElMoultaqa. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>

            <h4>5. Conference Content</h4>
            <p>
              ElMoultaqa is a platform that hosts content provided by conference organizers. We do not endorse, verify, or assume responsibility for the accuracy, completeness, or legality of any content uploaded by organizers, including session descriptions, speaker information, and sponsor materials.
            </p>

            <h4>6. Limitation of Liability</h4>
            <p>
              In no event shall ElMoultaqa, its directors, employees, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of the Platform, including but not limited to:
            </p>
            <ul className="feature-row-list">
              <li>Loss of data, revenue, or business opportunities</li>
              <li>Service interruptions or system failures</li>
              <li>Unauthorized access to or alteration of your data</li>
              <li>Conduct of any third party on the Platform</li>
            </ul>

            <h4>7. No Professional Advice</h4>
            <p>
              The information provided on the Platform is for general informational purposes only and does not constitute professional advice. You should consult appropriate professionals for advice specific to your situation.
            </p>

            <h4>8. Changes to This Disclaimer</h4>
            <p>
              We reserve the right to modify this Disclaimer at any time. Changes will be effective immediately upon posting to the Platform. Your continued use of the Platform after changes constitutes acceptance of the updated Disclaimer.
            </p>

            <h4>9. Contact</h4>
            <p>
              For questions about this Disclaimer, please contact us at <strong>legal@elmoultaqa.com</strong>.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

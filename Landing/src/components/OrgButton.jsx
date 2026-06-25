import { useState, useEffect } from "react";
import { useClerkSupabase } from "@global/supabase";

export default function OrgButton() {
  const [orgs, setOrgs] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = useClerkSupabase();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("organizations")
          .select("id, name, slug, clerk_org_id")
          .limit(100);

        if (error) {
          console.error("Failed to fetch orgs:", error);
          setOrgs([]);
        } else {
          setOrgs(data || []);
        }
      } catch (e) {
        console.error("Error fetching organizations:", e);
        setOrgs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgs();
  }, [supabase]);

  if (loading || !orgs?.length) return null;

  const webappUrl = import.meta.env.VITE_WEBAPP_URL || "http://localhost:5174";
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5175";

  return (
    <div className="org-button-wrapper">
      <button
        className="org-button"
        onClick={() => setOpen(!open)}
        title={`${orgs.length} Conference${orgs.length !== 1 ? 's' : ''}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
        {orgs.length}
      </button>

      {open && (
        <div className="org-dropdown">
          {orgs.map((org) => {
            const slug = org.slug || org.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "conference";
            return (
              <div key={org.id} className="org-item">
                <div className="org-name">{org.name}</div>
                <div className="org-links">
                  <a href={`${webappUrl}/c/${slug}`} target="_blank" rel="noreferrer">
                    Web
                  </a>
                  <a href={`${adminUrl}/c/${slug}/admin`} target="_blank" rel="noreferrer">
                    Admin
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

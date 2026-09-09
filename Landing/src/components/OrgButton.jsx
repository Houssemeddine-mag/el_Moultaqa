import { useState, useEffect } from "react";
import { useClerkSupabase } from "@global/supabase";
import { useOrganizationList, useUser } from "@clerk/clerk-react";

export default function OrgButton() {
  const [orgs, setOrgs] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = useClerkSupabase();
  const { userMemberships, isLoaded } = useOrganizationList({ infinite: true });
  const { user, isLoaded: userLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !userLoaded) return;
    let cancelled = false;
    const fetchOrgs = async () => {
      try {
        // 1) Prefer Clerk memberships — shows all orgs where user is member (3, 10, etc.)
        if (userMemberships && userMemberships.length > 0) {
          const clerkOrgs = userMemberships.map(m => m.organization).filter(Boolean);
          if (supabase) {
            const { data: dbOrgs } = await supabase.from("organizations").select("id, name, slug, clerk_org_id, blocked_at").in("clerk_org_id", clerkOrgs.map(o => o.id));
            if (cancelled) return;
            const blockedMap = new Map((dbOrgs || []).map(o => [o.clerk_org_id, o]));
            const filtered = clerkOrgs.filter(co => {
              const db = blockedMap.get(co.id);
              if (!db) return true;
              return !db.blocked_at;
            }).map(co => {
              const db = blockedMap.get(co.id);
              return {
                id: db?.id || co.id,
                name: db?.name || co.name,
                slug: db?.slug || co.slug || co.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "conference",
                clerk_org_id: co.id,
              };
            });
            setOrgs(filtered);
          } else {
            if (cancelled) return;
            setOrgs(clerkOrgs.map(co => ({
              id: co.id, name: co.name, slug: co.slug || co.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "conference", clerk_org_id: co.id
            })));
          }
        } else if (supabase && user?.id) {
          // 2) Fallback: Clerk list empty (e.g. not yet synced) — query Supabase directly by owner
          //    This restores original behavior but correctly fetches ALL owned orgs, filtered disabled
          const { data: owned } = await supabase.from("organizations").select("id, name, slug, clerk_org_id, blocked_at").eq("owner_clerk_id", user.id).limit(100);
          if (cancelled) return;
          const filtered = (owned || []).filter(o => !o.blocked_at);
          if (filtered.length) {
            setOrgs(filtered);
          } else {
            // Last fallback: any org (original limit 100) filtered disabled — for superadmin view
            const { data: fallback } = await supabase.from("organizations").select("id, name, slug, clerk_org_id, blocked_at").limit(100);
            if (cancelled) return;
            setOrgs((fallback || []).filter(o => !o.blocked_at).slice(0, 20));
          }
        } else {
          if (cancelled) return;
          setOrgs([]);
        }
      } catch (e) {
        if (cancelled) return;
        console.error("Error fetching organizations:", e);
        setOrgs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchOrgs();
    return () => { cancelled = true; };
  }, [isLoaded, userLoaded, userMemberships?.length]);

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

// admin/src/backend.js — Supabase Tenant Database Adaptor
import { queryOrgTable } from "@global/supabase";

const generateId = () =>
  `local-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

let activeSupabase = null;
let activeSchemaName = null;

const backend = {
  initializeService(supabase, schemaName) {
    activeSupabase = supabase;
    activeSchemaName = schemaName;
    console.log("[admin backend] Initialized with schema:", schemaName);
  },

  // Programs / Sessions
  async getPrograms() {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const data = await queryOrgTable(activeSupabase, activeSchemaName, "sessions");
    return data.map((s) => {
      let date = "";
      let start = "";
      let end = "";
      let endDate = "";
      
      if (s.start_time) {
        date = s.start_time.split("T")[0];
        start = s.start_time.split("T")[1]?.substring(0, 5) || "";
      }
      if (s.end_time) {
        endDate = s.end_time.split("T")[0];
        end = s.end_time.split("T")[1]?.substring(0, 5) || "";
      }

      const meta = s.metadata || {};

      return {
        id: s.id,
        type: s.session_type || "session",
        title: s.title,
        date: date,
        start: start,
        end: end,
        endDate: endDate === date ? "" : endDate,
        room: s.room || "",
        chairs: meta.chairs || [],
        keynote: meta.keynote || { name: "", affiliation: "", bio: "", image: "" },
        keynoteDescription: meta.keynoteDescription || s.description || "",
        conferences: meta.conferences || [],
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      };
    });
  },

  async addProgram(program) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) {
      throw new Error("No event found. Please create an event first before adding programs.");
    }
    const eventId = events[0].id;

    const startTime = program.date && program.start 
      ? `${program.date}T${program.start}:00Z` 
      : null;
    const endTime = (program.endDate || program.date) && program.end 
      ? `${program.endDate || program.date}T${program.end}:00Z` 
      : null;

    // Validate and map session_type to allowed values
    const validSessionTypes = ['talk', 'workshop', 'panel', 'keynote', 'break', 'networking'];
    let sessionType = program.type || 'talk';
    sessionType = sessionType.toLowerCase();
    if (!validSessionTypes.includes(sessionType)) {
      console.warn(`Invalid session type "${program.type}". Using "talk" instead.`);
      sessionType = 'talk';
    }

    const dbPayload = {
      event_id: eventId,
      title: program.title,
      description: program.keynoteDescription || program.description || "",
      speaker_id: null,
      start_time: startTime,
      end_time: endTime,
      room: program.room || "",
      track: program.track || "",
      session_type: sessionType,
      status: program.status || "scheduled",
      metadata: {
        chairs: program.chairs || [],
        keynote: program.keynote || { name: "", affiliation: "", bio: "", image: "" },
        keynoteDescription: program.keynoteDescription || "",
        conferences: program.conferences || [],
      },
    };
    
    const { data, error } = await activeSupabase.rpc("org_insert", {
      p_schema_name: activeSchemaName,
      p_table_name: "sessions",
      p_data: dbPayload,
    });

    if (error) throw error;

    let resDate = "";
    let resStart = "";
    let resEnd = "";
    let resEndDate = "";
    
    if (data.start_time) {
      resDate = data.start_time.split("T")[0];
      resStart = data.start_time.split("T")[1]?.substring(0, 5) || "";
    }
    if (data.end_time) {
      resEndDate = data.end_time.split("T")[0];
      resEnd = data.end_time.split("T")[1]?.substring(0, 5) || "";
    }

    const resMeta = data.metadata || {};

    return {
      id: data.id,
      type: data.session_type,
      title: data.title,
      date: resDate,
      start: resStart,
      end: resEnd,
      endDate: resEndDate === resDate ? "" : resEndDate,
      room: data.room,
      chairs: resMeta.chairs || [],
      keynote: resMeta.keynote || { name: "", affiliation: "", bio: "", image: "" },
      keynoteDescription: resMeta.keynoteDescription || data.description || "",
      conferences: resMeta.conferences || [],
    };
  },

  async updateProgram(id, data) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const startTime = data.date && data.start 
      ? `${data.date}T${data.start}:00Z` 
      : null;
    const endTime = (data.endDate || data.date) && data.end 
      ? `${data.endDate || data.date}T${data.end}:00Z` 
      : null;

    const dbPayload = {
      title: data.title,
      description: data.keynoteDescription || data.description || "",
      start_time: startTime,
      end_time: endTime,
      room: data.room || "",
      session_type: data.type || "session",
      metadata: {
        chairs: data.chairs || [],
        keynote: data.keynote || { name: "", affiliation: "", bio: "", image: "" },
        keynoteDescription: data.keynoteDescription || "",
        conferences: data.conferences || [],
      },
    };

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "sessions",
      p_id: id,
      p_data: dbPayload,
    });

    if (error) throw error;
    return true;
  },

  async deleteProgram(id) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const { error } = await activeSupabase.rpc("org_delete", {
      p_schema_name: activeSchemaName,
      p_table_name: "sessions",
      p_id: id,
    });
    if (error) throw error;
    return true;
  },

  // Keynote Speakers
  async getKeynoteSpeakers() {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const data = await queryOrgTable(activeSupabase, activeSchemaName, "speakers");
    return data.map((s) => ({
      id: s.id,
      name: s.full_name,
      bio: s.bio || "",
      title: s.title || "",
      company: s.company || "",
      photo: s.photo_url || "",
      socials: s.social_links || {},
    }));
  },

  async addKeynoteSpeaker(speaker) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const dbPayload = {
      full_name: speaker.name,
      bio: speaker.bio || "",
      title: speaker.title || "",
      company: speaker.company || "",
      photo_url: speaker.photo || "",
      social_links: speaker.socials || {},
    };

    const { data, error } = await activeSupabase.rpc("org_insert", {
      p_schema_name: activeSchemaName,
      p_table_name: "speakers",
      p_data: dbPayload,
    });

    if (error) throw error;
    return {
      id: data.id,
      name: data.full_name,
      bio: data.bio,
      title: data.title,
      company: data.company,
      photo: data.photo_url,
      socials: data.social_links,
    };
  },

  async updateKeynoteSpeaker(id, speaker) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const dbPayload = {};
    if (speaker.name !== undefined) dbPayload.full_name = speaker.name;
    if (speaker.bio !== undefined) dbPayload.bio = speaker.bio;
    if (speaker.title !== undefined) dbPayload.title = speaker.title;
    if (speaker.company !== undefined) dbPayload.company = speaker.company;
    if (speaker.photo !== undefined) dbPayload.photo_url = speaker.photo;
    if (speaker.socials !== undefined) dbPayload.social_links = speaker.socials;

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "speakers",
      p_id: id,
      p_data: dbPayload,
    });

    if (error) throw error;
    return true;
  },

  async deleteKeynoteSpeaker(id) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const { error } = await activeSupabase.rpc("org_delete", {
      p_schema_name: activeSchemaName,
      p_table_name: "speakers",
      p_id: id,
    });
    if (error) throw error;
    return true;
  },

  // Sponsors
  async getSponsors() {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (events && events.length > 0) {
      return events[0].settings?.sponsors || [];
    }
    return [];
  },

  async addSponsor(sponsor) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) throw new Error("No event found to update sponsors");
    const event = events[0];
    const sponsors = event.settings?.sponsors || [];
    const newSponsor = { id: generateId(), ...sponsor };
    sponsors.push(newSponsor);

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "events",
      p_id: event.id,
      p_data: { settings: { ...event.settings, sponsors } },
    });

    if (error) throw error;
    return newSponsor;
  },

  async updateSponsor(id, data) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) throw new Error("No event found");
    const event = events[0];
    const sponsors = event.settings?.sponsors || [];
    const idx = sponsors.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error("Sponsor not found");
    sponsors[idx] = { ...sponsors[idx], ...data };

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "events",
      p_id: event.id,
      p_data: { settings: { ...event.settings, sponsors } },
    });

    if (error) throw error;
    return true;
  },

  async deleteSponsor(id) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) throw new Error("No event found");
    const event = events[0];
    const sponsors = (event.settings?.sponsors || []).filter((s) => s.id !== id);

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "events",
      p_id: event.id,
      p_data: { settings: { ...event.settings, sponsors } },
    });

    if (error) throw error;
    return true;
  },

  // Registration & Access settings
  async getRegistrationSettings(slug) {
    if (activeSupabase && slug) {
      try {
        // Query organizations table directly; RLS policy permits members to view their own org row
        const { data, error } = await activeSupabase
          .from("organizations")
          .select("registration_mode, registration_code")
          .eq("slug", slug)
          .single();
        if (error) throw error;
        return {
          registrationMode: data.registration_mode || "public",
          registrationCode: data.registration_code || "",
        };
      } catch (e) {
        console.error("[admin backend] getRegistrationSettings error:", e);
      }
    }
    return {
      registrationMode: "public",
      registrationCode: "",
    };
  },

  async updateRegistrationSettings(slug, mode, code) {
    if (activeSupabase && slug) {
      const { data, error } = await activeSupabase.rpc("update_registration_settings", {
        p_slug: slug,
        p_registration_mode: mode,
        p_registration_code: code,
      });
      if (error) throw error;
      return {
        registrationMode: data.registration_mode,
        registrationCode: data.registration_code,
      };
    }
    return {
      registrationMode: mode,
      registrationCode: code,
    };
  },

  generateQRCode(url) {
    console.log("[admin backend] QR generation not yet implemented for:", url);
    return null;
  },

  // =========================================================================
  // Organization Information
  // =========================================================================
  // Retrieves the current organization metadata from the shared
  // public.organizations registry using the tenant-aware Supabase client.
  async getOrgInfo() {
    if (!activeSupabase || !activeSchemaName) {
      return null;
    }

    try {
      const { data, error } = await activeSupabase
        .from("organizations")
        .select("id, clerk_org_id, name, slug, schema_name, logo_url, domain, owner_clerk_id, created_at, updated_at")
        .eq("schema_name", activeSchemaName)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return {
          schemaName: activeSchemaName,
        };
      }

      return {
        id: data.id,
        clerkOrgId: data.clerk_org_id,
        name: data.name,
        slug: data.slug,
        schemaName: data.schema_name || activeSchemaName,
        logoUrl: data.logo_url || "",
        domain: data.domain || "",
        ownerClerkId: data.owner_clerk_id || "",
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (e) {
      console.error("[admin backend] getOrgInfo error:", e);
      return {
        schemaName: activeSchemaName,
      };
    }
  },

  // =========================================================================
  // Users Management
  // =========================================================================
  // Fetches the list of users registered in this organization.
  // Only org members can view the users table.
  
  async getUsers() {
    if (activeSupabase && activeSchemaName) {
      try {
        const data = await queryOrgTable(activeSupabase, activeSchemaName, "users");
        return data.map((u) => ({
          id: u.id,
          clerkUserId: u.clerk_user_id,
          email: u.email,
          displayName: u.full_name || "",
          role: u.role || "attendee",
          createdAt: u.created_at,
          updatedAt: u.updated_at,
          university: u.institution || "",
          phone: u.phone || "",
          bio: u.bio || "",
          schoolLevel: u.metadata?.schoolLevel || "Master's Degree",
          gender: u.metadata?.gender || "",
          country: u.metadata?.country || "",
          province: u.metadata?.province || "",
          isProfileComplete: Boolean(
            u.full_name && 
            u.institution && 
            u.metadata?.schoolLevel && 
            u.metadata?.country && 
            u.metadata?.province && 
            u.phone && 
            u.bio
          ),
        }));
      } catch (e) {
        console.error("[admin backend] getUsers error:", e);
        throw e;
      }
    }
    return [];
  },

  // Update user role (admin-only operation)
  async updateUserRole(userId, newRole) {
    if (activeSupabase && activeSchemaName) {
      if (!["attendee", "speaker", "moderator", "admin"].includes(newRole)) {
        throw new Error("Invalid role: must be one of attendee, speaker, moderator, admin");
      }

      const { data, error } = await activeSupabase.rpc("org_update", {
        p_schema_name: activeSchemaName,
        p_table_name: "users",
        p_id: userId,
        p_data: { role: newRole },
      });

      if (error) throw error;
      return {
        id: data.id,
        role: data.role,
        updatedAt: data.updated_at,
      };
    }
    throw new Error("Supabase not initialized");
  },

  // =========================================================================
  // Dashboard Metrics
  // =========================================================================
  // Fetches aggregated metrics for the admin dashboard.
  // Counts: total users, total events, total sessions, upcoming sessions.
  
  async getDashboardMetrics() {
    if (activeSupabase && activeSchemaName) {
      try {
        const [users, events, sessions] = await Promise.all([
          queryOrgTable(activeSupabase, activeSchemaName, "users", { limit: 1000 }),
          queryOrgTable(activeSupabase, activeSchemaName, "events", { limit: 100 }),
          queryOrgTable(activeSupabase, activeSchemaName, "sessions", { limit: 1000 }),
        ]);

        const totalUsers = users?.length || 0;
        const totalEvents = events?.length || 0;
        const totalSessions = sessions?.length || 0;
        
        // Count upcoming sessions (start_time in future)
        const now = new Date().toISOString();
        const upcomingSessions = (sessions || []).filter(
          (s) => s.start_time && s.start_time > now
        ).length;

        // Count users by role
        const usersByRole = {
          attendees: (users || []).filter((u) => u.role === "attendee").length,
          speakers: (users || []).filter((u) => u.role === "speaker").length,
          moderators: (users || []).filter((u) => u.role === "moderator").length,
          admins: (users || []).filter((u) => u.role === "admin").length,
        };

        return {
          totalUsers,
          totalEvents,
          totalSessions,
          upcomingSessions,
          usersByRole,
        };
      } catch (e) {
        console.error("[admin backend] getDashboardMetrics error:", e);
        return {
          totalUsers: 0,
          totalEvents: 0,
          totalSessions: 0,
          upcomingSessions: 0,
          usersByRole: { attendees: 0, speakers: 0, moderators: 0, admins: 0 },
        };
      }
    }
    return {
      totalUsers: 0,
      totalEvents: 0,
      totalSessions: 0,
      upcomingSessions: 0,
      usersByRole: { attendees: 0, speakers: 0, moderators: 0, admins: 0 },
    };
  },

  // Get top speakers/presenters by creation order (for dashboard)
  async getTopPresenters(limit = 5) {
    if (activeSupabase && activeSchemaName) {
      try {
        const speakers = await queryOrgTable(activeSupabase, activeSchemaName, "speakers", {
          limit,
          orderBy: "created_at",
          orderDir: "DESC",
        });
        return speakers.map((s) => ({
          id: s.id,
          name: s.full_name || "Unknown Speaker",
          title: s.title || "",
          company: s.company || "",
          photo: s.photo_url || "",
        }));
      } catch (e) {
        console.error("[admin backend] getTopPresenters error:", e);
        return [];
      }
    }
    return [];
  },

  // =========================================================================
  // Events Management
  // =========================================================================
  // Fetches all events in the organization.
  
  async getEvents() {
    if (activeSupabase && activeSchemaName) {
      try {
        const data = await queryOrgTable(activeSupabase, activeSchemaName, "events");
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description || "",
          short_name: e.short_name || "",
          start_date: e.start_date || "",
          end_date: e.end_date || "",
          location: e.location || "",
          venue: e.venue || "",
          cover_image_url: e.cover_image_url || "",
          status: e.status || "draft",
          settings: e.settings || {},
          createdAt: e.created_at,
          updatedAt: e.updated_at,
        }));
      } catch (e) {
        console.error("[admin backend] getEvents error:", e);
        throw e;
      }
    }
    return [];
  },

  async addEvent(event) {
    if (activeSupabase && activeSchemaName) {
      const dbPayload = {
        title: event.title,
        description: event.description || "",
        short_name: event.short_name || "",
        start_date: event.start_date || null,
        end_date: event.end_date || null,
        location: event.location || "",
        venue: event.venue || "",
        cover_image_url: event.cover_image_url || "",
        status: event.status || "draft",
        settings: event.settings || {},
      };

      const { data, error } = await activeSupabase.rpc("org_insert", {
        p_schema_name: activeSchemaName,
        p_table_name: "events",
        p_data: dbPayload,
      });

      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        short_name: data.short_name,
        start_date: data.start_date,
        end_date: data.end_date,
        location: data.location,
        venue: data.venue,
        status: data.status,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
    throw new Error("Supabase not initialized");
  },

  async updateEvent(eventId, event) {
    if (activeSupabase && activeSchemaName) {
      const dbPayload = {};
      if (event.title !== undefined) dbPayload.title = event.title;
      if (event.description !== undefined) dbPayload.description = event.description;
      if (event.short_name !== undefined) dbPayload.short_name = event.short_name;
      if (event.start_date !== undefined) dbPayload.start_date = event.start_date;
      if (event.end_date !== undefined) dbPayload.end_date = event.end_date;
      if (event.location !== undefined) dbPayload.location = event.location;
      if (event.venue !== undefined) dbPayload.venue = event.venue;
      if (event.status !== undefined) dbPayload.status = event.status;
      if (event.cover_image_url !== undefined) dbPayload.cover_image_url = event.cover_image_url;
      if (event.settings !== undefined) dbPayload.settings = event.settings;

      const { error } = await activeSupabase.rpc("org_update", {
        p_schema_name: activeSchemaName,
        p_table_name: "events",
        p_id: eventId,
        p_data: dbPayload,
      });

      if (error) throw error;
      return true;
    }
    throw new Error("Supabase not initialized");
  },

  async deleteEvent(eventId) {
    if (activeSupabase && activeSchemaName) {
      const { error } = await activeSupabase.rpc("org_delete", {
        p_schema_name: activeSchemaName,
        p_table_name: "events",
        p_id: eventId,
      });

      if (error) throw error;
      return true;
    }
    throw new Error("Supabase not initialized");
  },

  // Merge partial settings into the event's settings JSONB column
  async updateEventSettings(eventId, settings) {
    if (activeSupabase && activeSchemaName) {
      try {
        // Fetch current event to merge settings (preserves sponsors, etc.)
        const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
        const event = events.find((e) => e.id === eventId);
        if (!event) throw new Error("Event not found");

        const merged = { ...(event.settings || {}), ...settings };

        const { error } = await activeSupabase.rpc("org_update", {
          p_schema_name: activeSchemaName,
          p_table_name: "events",
          p_id: eventId,
          p_data: { settings: merged },
        });

        if (error) throw error;
        return true;
      } catch (e) {
        console.error("[admin backend] updateEventSettings error:", e);
        throw e;
      }
    }
    throw new Error("Supabase not initialized");
  },

  // =========================================================================
  // Live Streams Management (admin manages, attendees watch)
  // =========================================================================

  async getStreams() {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (events && events.length > 0) {
      return events[0].settings?.streams || [];
    }
    return [];
  },

  async addStream(stream) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) throw new Error("No event found to update streams");
    const event = events[0];
    const streams = event.settings?.streams || [];
    const newStream = { id: generateId(), ...stream };
    streams.push(newStream);

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "events",
      p_id: event.id,
      p_data: { settings: { ...event.settings, streams } },
    });

    if (error) throw error;
    return newStream;
  },

  async deleteStream(id) {
    if (!activeSupabase || !activeSchemaName) {
      throw new Error("Supabase not initialized");
    }
    const events = await queryOrgTable(activeSupabase, activeSchemaName, "events");
    if (!events || events.length === 0) throw new Error("No event found");
    const event = events[0];
    const streams = (event.settings?.streams || []).filter((s) => s.id !== id);

    const { error } = await activeSupabase.rpc("org_update", {
      p_schema_name: activeSchemaName,
      p_table_name: "events",
      p_id: event.id,
      p_data: { settings: { ...event.settings, streams } },
    });

    if (error) throw error;
    return true;
  },

  // =========================================================================
  // Notifications Management (admin sends, attendees read)
  // =========================================================================

  async getNotifications() {
    if (activeSupabase && activeSchemaName) {
      try {
        const data = await queryOrgTable(activeSupabase, activeSchemaName, "notifications", {
          orderBy: "created_at",
          orderDir: "DESC",
          limit: 100,
        });
        return data.map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          type: n.type || "info",
          isPinned: n.is_pinned || false,
          createdAt: n.created_at,
        }));
      } catch (e) {
        console.error("[admin backend] getNotifications error:", e);
        throw e;
      }
    }
    throw new Error("Supabase not initialized");
  },

  async addNotification(notification) {
    if (activeSupabase && activeSchemaName) {
      const dbPayload = {
        title: notification.title,
        message: notification.message,
        type: notification.type || "info",
        is_pinned: notification.isPinned || false,
      };

      const { data, error } = await activeSupabase.rpc("org_insert", {
        p_schema_name: activeSchemaName,
        p_table_name: "notifications",
        p_data: dbPayload,
      });

      if (error) throw error;
      return {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.type,
        isPinned: data.is_pinned,
        createdAt: data.created_at,
      };
    }
    throw new Error("Supabase not initialized");
  },

  async deleteNotification(notificationId) {
    if (activeSupabase && activeSchemaName) {
      const { error } = await activeSupabase.rpc("org_delete", {
        p_schema_name: activeSchemaName,
        p_table_name: "notifications",
        p_id: notificationId,
      });
      if (error) throw error;
      return true;
    }
    throw new Error("Supabase not initialized");
  },

  // =========================================================================
  // Questions Management (attendees submit, admins review)
  // =========================================================================

  async getQuestions() {
    if (activeSupabase && activeSchemaName) {
      try {
        const data = await queryOrgTable(activeSupabase, activeSchemaName, "questions", {
          orderBy: "created_at",
          orderDir: "DESC",
          limit: 200,
        });
        return data.map((q) => ({
          id: q.id,
          authorName: q.author_name || "Attendee",
          message: q.message,
          isAnswered: q.is_answered || false,
          isPinned: q.is_pinned || false,
          createdAt: q.created_at,
        }));
      } catch (e) {
        console.error("[admin backend] getQuestions error:", e);
        throw e;
      }
    }
    throw new Error("Supabase not initialized");
  },

  async markQuestionAnswered(questionId, answered = true) {
    if (activeSupabase && activeSchemaName) {
      const { data, error } = await activeSupabase.rpc("org_update", {
        p_schema_name: activeSchemaName,
        p_table_name: "questions",
        p_id: questionId,
        p_data: { is_answered: answered },
      });
      if (error) throw error;
      return { id: data.id, isAnswered: data.is_answered };
    }
    throw new Error("Supabase not initialized");
  },

  async deleteQuestion(questionId) {
    if (activeSupabase && activeSchemaName) {
      const { error } = await activeSupabase.rpc("org_delete", {
        p_schema_name: activeSchemaName,
        p_table_name: "questions",
        p_id: questionId,
      });
      if (error) throw error;
      return true;
    }
    throw new Error("Supabase not initialized");
  },

  // =========================================================================
  // Discovery Card Management (org admin customizes & publishes)
  // =========================================================================

  async getDiscoveryCard(orgSlug) {
    if (activeSupabase && orgSlug) {
      try {
        const { data, error } = await activeSupabase.rpc("org_get_discovery_card", {
          p_org_slug: orgSlug,
        });
        if (error) throw error;
        if (!data || data.length === 0) return null;
        return data[0];
      } catch (e) {
        console.error("[admin backend] getDiscoveryCard error:", e);
        return null;
      }
    }
    return null;
  },

  async saveDiscoveryCard(orgSlug, card) {
    if (activeSupabase && orgSlug) {
      const { data, error } = await activeSupabase.rpc("org_save_discovery_card", {
        p_org_slug: orgSlug,
        p_title: card.title,
        p_description: card.description || null,
        p_category: card.category || null,
        p_start_date: card.start_date || null,
        p_end_date: card.end_date || null,
        p_start_time: card.start_time || null,
        p_location: card.location || null,
        p_logo_url: card.logo_url || null,
        p_pricing: card.pricing || "free",
        p_official_website_url: card.official_website_url || null,
        p_social_links: card.social_links || {},
      });
      if (error) throw error;
      return data;
    }
    throw new Error("Supabase not initialized");
  },

  async publishDiscoveryCard(orgSlug) {
    if (activeSupabase && orgSlug) {
      const { data, error } = await activeSupabase.rpc("org_publish_discovery_card", {
        p_org_slug: orgSlug,
      });
      if (error) throw error;
      return data;
    }
    throw new Error("Supabase not initialized");
  },

  async unpublishDiscoveryCard(orgSlug) {
    if (activeSupabase && orgSlug) {
      const { data, error } = await activeSupabase.rpc("org_unpublish_discovery_card", {
        p_org_slug: orgSlug,
      });
      if (error) throw error;
      return data;
    }
    throw new Error("Supabase not initialized");
  },

  // =========================================================================
  // Database Stats (real row counts for DatabaseManagerPage)
  // =========================================================================

  async getDatabaseStats() {
    if (activeSupabase && activeSchemaName) {
      try {
        const [_users, _events, _sessions, _speakers, _tickets, _notifications, _questions] =
          await Promise.all([
            queryOrgTable(activeSupabase, activeSchemaName, "users", { limit: 1 }),
            queryOrgTable(activeSupabase, activeSchemaName, "events", { limit: 1 }),
            queryOrgTable(activeSupabase, activeSchemaName, "sessions", { limit: 1 }),
            queryOrgTable(activeSupabase, activeSchemaName, "speakers", { limit: 1 }),
            queryOrgTable(activeSupabase, activeSchemaName, "tickets", { limit: 1 }),
            queryOrgTable(activeSupabase, activeSchemaName, "notifications", { limit: 1 })
              .catch(() => []),
            queryOrgTable(activeSupabase, activeSchemaName, "questions", { limit: 1 })
              .catch(() => []),
          ]);

        // Fetch full counts
        const [usersAll, eventsAll, sessionsAll, speakersAll, ticketsAll, notifsAll, questionsAll] =
          await Promise.all([
            queryOrgTable(activeSupabase, activeSchemaName, "users", { limit: 10000 }),
            queryOrgTable(activeSupabase, activeSchemaName, "events", { limit: 10000 }),
            queryOrgTable(activeSupabase, activeSchemaName, "sessions", { limit: 10000 }),
            queryOrgTable(activeSupabase, activeSchemaName, "speakers", { limit: 10000 }),
            queryOrgTable(activeSupabase, activeSchemaName, "tickets", { limit: 10000 }),
            queryOrgTable(activeSupabase, activeSchemaName, "notifications", { limit: 10000 })
              .catch(() => []),
            queryOrgTable(activeSupabase, activeSchemaName, "questions", { limit: 10000 })
              .catch(() => []),
          ]);

        return {
          users: usersAll.length,
          events: eventsAll.length,
          sessions: sessionsAll.length,
          speakers: speakersAll.length,
          tickets: ticketsAll.length,
          notifications: notifsAll.length,
          questions: questionsAll.length,
        };
      } catch {
        return { users: 0, events: 0, sessions: 0, speakers: 0, tickets: 0, notifications: 0, questions: 0 };
      }
    }
    return { users: 0, events: 0, sessions: 0, speakers: 0, tickets: 0, notifications: 0, questions: 0 };
  },

  // =========================================================================
  // Mobile App Build Management
  // =========================================================================
  async getMobileBuildStatus(orgSlug) {
    if (!activeSupabase) throw new Error("Supabase not initialized");
    const { data, error } = await activeSupabase.rpc("get_mobile_build_status", {
      p_org_slug: orgSlug,
    });
    if (error) throw error;
    return data;
  },

  async triggerMobileBuild(orgSlug) {
    if (!activeSupabase) throw new Error("Supabase not initialized");
    const { data, error } = await activeSupabase.functions.invoke(
      "trigger-mobile-build",
      { body: { org_slug: orgSlug } }
    );
    if (error) throw error;
    if (data?.ok === false) throw new Error(data.error);
    return data;
  },

  async restoreMobileBuild(orgSlug) {
    if (!activeSupabase) throw new Error("Supabase not initialized");
    const { data, error } = await activeSupabase.rpc("restore_mobile_build", {
      p_org_slug: orgSlug,
    });
    if (error) throw error;
    if (data?.ok === false) throw new Error(data.error);
    return data;
  },

  async mobileConfigHash(name, logoUrl, themeColor) {
    const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const jsonStr = `{"name": "${esc(name)}", "logo_url": "${esc(logoUrl)}", "theme_color": "${esc(themeColor)}"}`;
    const encoded = new TextEncoder().encode(jsonStr);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  },
};


export default backend;


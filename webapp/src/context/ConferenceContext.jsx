import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { defaultConferenceConfig } from "../conferenceConfig";
import { fetchConferenceConfig, initializeService } from "../services/localService";
import { useClerkSupabase, resolveOrgSlug } from "@global/supabase";

const ConferenceContext = createContext(defaultConferenceConfig);

function parseHexColor(color) {
  if (!color || typeof color !== "string") {
    return null;
  }

  const hex = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
    return null;
  }

  const value = parseInt(hex, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function darkenColor(color, amount = 0.2) {
  const rgb = parseHexColor(color);
  if (!rgb) return color;
  return `rgb(${clamp(Math.round(rgb.r * (1 - amount)), 0, 255)}, ${clamp(
    Math.round(rgb.g * (1 - amount)),
    0,
    255,
  )}, ${clamp(Math.round(rgb.b * (1 - amount)), 0, 255)})`;
}

function alphaColor(color, alpha = 0.18) {
  const rgb = parseHexColor(color);
  if (!rgb) return `rgba(13, 126, 82, ${alpha})`;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "EM";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function applyThemeVariables(config) {
  const root = document.documentElement;
  const accent = config.themeColor || defaultConferenceConfig.primaryColor;
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--accent-dark", darkenColor(accent, 0.2));
  root.style.setProperty("--border", alphaColor(accent, 0.18));
  root.style.setProperty(
    "--brand-primary",
    config.themeColor || defaultConferenceConfig.primaryColor,
  );
}

export function ConferenceProvider({ children }) {
  const [config, setConfig] = useState(defaultConferenceConfig);
  const supabase = useClerkSupabase();
  const location = useLocation();

  // Parse the slug from the URL pathname, e.g. /c/algeria-tech/home -> algeria-tech
  const match = location.pathname.match(/^\/c\/([^\/]+)/);
  const orgSlug = match ? match[1] : null;

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      if (!orgSlug) {
        console.log("[ConferenceProvider] No org slug found in path.");
        return;
      }

      try {
        console.log("[ConferenceProvider] Resolving org slug:", orgSlug);
        const orgDetails = await resolveOrgSlug(supabase, orgSlug);
        if (!active) return;

        if (orgDetails) {
          console.log("[ConferenceProvider] Resolved schema:", orgDetails.schema_name);
          initializeService(supabase, orgDetails.schema_name);

          const storedConfig = await fetchConferenceConfig();
          if (!active) return;

          setConfig({
            ...defaultConferenceConfig,
            id: orgSlug,
            brand: orgDetails.name || defaultConferenceConfig.brand,
            brandInitials: getInitials(orgDetails.name || defaultConferenceConfig.brand),
            name: storedConfig?.name || orgDetails.name || defaultConferenceConfig.name,
            themeColor: storedConfig?.themeColor || orgDetails.themeColor || defaultConferenceConfig.primaryColor,
            logoUrl: storedConfig?.logo || orgDetails.logo_url || defaultConferenceConfig.logoUrl,
          });
        }
      } catch (error) {
        console.error("Unable to load conference configuration", error);
      }
    }

    if (supabase) {
      loadConfig();
    }

    return () => {
      active = false;
    };
  }, [supabase, orgSlug]);


  useEffect(() => {
    applyThemeVariables(config);
  }, [config]);

  return (
    <ConferenceContext.Provider value={config}>
      {children}
    </ConferenceContext.Provider>
  );
}

export function useConferenceConfig() {
  return useContext(ConferenceContext);
}

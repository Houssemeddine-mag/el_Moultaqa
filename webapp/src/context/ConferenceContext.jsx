import { createContext, useContext, useEffect, useState } from "react";
import { defaultConferenceConfig } from "../conferenceConfig";
import {
  fetchConferenceConfig,
  subscribeConferenceConfig,
} from "../services/localService";

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

  useEffect(() => {
    let active = true;

    async function loadConfig() {
      try {
        const storedConfig = await fetchConferenceConfig();
        if (!active) return;
        if (storedConfig) {
          setConfig({
            ...defaultConferenceConfig,
            ...storedConfig,
            brand: storedConfig.shortName || defaultConferenceConfig.brand,
            brandInitials:
              storedConfig.brandInitials ||
              getInitials(
                storedConfig.shortName || defaultConferenceConfig.brand,
              ),
            name: storedConfig.name || defaultConferenceConfig.name,
            logoUrl: storedConfig.logo || defaultConferenceConfig.logoUrl,
          });
        }
      } catch (error) {
        console.error("Unable to load conference configuration", error);
      }
    }

    loadConfig();

    const unsubscribe = subscribeConferenceConfig((storedConfig) => {
      if (!active || !storedConfig) return;
      setConfig({
        ...defaultConferenceConfig,
        ...storedConfig,
        brand: storedConfig.shortName || defaultConferenceConfig.brand,
        brandInitials:
          storedConfig.brandInitials ||
          getInitials(storedConfig.shortName || defaultConferenceConfig.brand),
        name: storedConfig.name || defaultConferenceConfig.name,
        logoUrl: storedConfig.logo || defaultConferenceConfig.logoUrl,
      });
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

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

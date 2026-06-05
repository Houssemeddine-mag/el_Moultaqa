import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const landingRoot = fileURLToPath(new URL("./", import.meta.url));
const globalDir = fileURLToPath(new URL("../global", import.meta.url));
const logoFile = fileURLToPath(new URL("../global/logo.png", import.meta.url));
const iconFile = fileURLToPath(new URL("../global/icon.png", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    fs: {
      allow: [landingRoot, globalDir],
    },
  },
  resolve: {
    alias: {
      "@logo": logoFile,
      "@icon": iconFile,
      "@global": globalDir,
      "@supabase/supabase-js": fileURLToPath(new URL("./node_modules/@supabase/supabase-js", import.meta.url)),
      "@clerk/clerk-react": fileURLToPath(new URL("./node_modules/@clerk/clerk-react", import.meta.url)),
    },
  },
});

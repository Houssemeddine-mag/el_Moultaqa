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
      "react": fileURLToPath(new URL("./node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(new URL("./node_modules/react-dom", import.meta.url)),
      "@supabase/supabase-js": fileURLToPath(new URL("./node_modules/@supabase/supabase-js", import.meta.url)),
      "@clerk/clerk-react": fileURLToPath(new URL("./node_modules/@clerk/clerk-react", import.meta.url)),
    },
  },
  optimizeDeps: {
    // Exclude the shared @global module (outside node_modules) from pre-bundling.
    // Vite cannot reliably cache files outside node_modules and generates stale
    // "Outdated Optimize Dep" 504 errors when it tries to do so.
    exclude: ["@global/supabase"],
    // Explicitly include the npm packages that @global/supabase imports so Vite
    // pre-bundles them correctly from THIS app's node_modules.
    include: [
      "@supabase/supabase-js",
      "@clerk/clerk-react",
      "react",
      "react-dom",
      "react-router-dom",
    ],
  },
});

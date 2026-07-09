import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const adminRoot = fileURLToPath(new URL("./", import.meta.url));
const globalDir = fileURLToPath(new URL("../global", import.meta.url));
const logoFile = fileURLToPath(new URL("../global/logo.png", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [adminRoot, globalDir],
    },
  },
  resolve: {
    alias: {
      "@logo": logoFile,
      "@global": globalDir,
      "react": fileURLToPath(new URL("./node_modules/react", import.meta.url)),
      "react-dom": fileURLToPath(new URL("./node_modules/react-dom", import.meta.url)),
      "@supabase/supabase-js": fileURLToPath(new URL("./node_modules/@supabase/supabase-js", import.meta.url)),
      "@clerk/clerk-react": fileURLToPath(new URL("./node_modules/@clerk/clerk-react", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ["@global/supabase"],
    include: [
      "@supabase/supabase-js",
      "@clerk/clerk-react",
      "react",
      "react-dom",
      "react-router-dom",
    ],
  },
});


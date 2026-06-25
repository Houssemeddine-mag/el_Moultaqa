import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL("./", import.meta.url));
const globalDir = fileURLToPath(new URL("../global", import.meta.url));
const logoFile = fileURLToPath(new URL("../global/logo.png", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [root, globalDir],
    },
  },
  resolve: {
    alias: {
      "@logo": logoFile,
      "@global": globalDir,
      "@supabase/supabase-js": fileURLToPath(new URL("./node_modules/@supabase/supabase-js", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: [
      "@supabase/supabase-js",
      "react",
      "react-dom",
      "react-router-dom",
    ],
  },
});

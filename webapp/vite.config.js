import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@global": path.resolve(__dirname, "../global"),
      "@supabase/supabase-js": path.resolve(__dirname, "./node_modules/@supabase/supabase-js"),
      "@clerk/clerk-react": path.resolve(__dirname, "./node_modules/@clerk/clerk-react"),
      "react": path.resolve(__dirname, "./node_modules/react"),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, "..")],
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
      "hls.js",
    ],
  },
});


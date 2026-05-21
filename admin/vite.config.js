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
    },
  },
});

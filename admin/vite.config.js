import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const globalDir = fileURLToPath(new URL("../global", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [globalDir],
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const webappRoot = fileURLToPath(new URL("./", import.meta.url));
const globalDir = fileURLToPath(new URL("../global", import.meta.url));
const logoFile = fileURLToPath(new URL("../global/logo.png", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4174,
    fs: {
      allow: [webappRoot, globalDir],
    },
  },
  resolve: {
    alias: {
      "@logo": logoFile,
    },
  },
});

/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Relative base so the production build works when Electron loads it via file://
  base: "./",
  plugins: [react(), tsconfigPaths()],
  server: {
    // Match the URL Electron loads in dev (electron.js -> http://localhost:3000)
    port: 3000,
  },
  build: {
    // Keep the CRA output folder so electron.js (../build/index.html) keeps working
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});

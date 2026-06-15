/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative base so the production build works when Electron loads it via file://
  base: "./",
  plugins: [react()],
  resolve: {
    // Resolve the tsconfig "baseUrl: src" absolute imports (built into Vite 8+).
    tsconfigPaths: true,
  },
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

/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  // Absolute base: the build is served from the web root by the LaserAPI backend.
  // (Use "./" instead only if loading via file:// in Electron.)
  base: "/",
  // basicSsl serves the dev server over https (self-signed) — Spotify requires a
  // secure redirect URL. react() must come first.
  plugins: [react(), basicSsl()],
  resolve: {
    // Resolve the tsconfig "baseUrl: src" absolute imports (built into Vite 8+).
    tsconfigPaths: true,
  },
  // Pre-bundle Emotion/MUI explicitly so the dev dep optimizer produces a clean,
  // single graph (avoids "init_emotion_react... is not defined" runtime errors).
  optimizeDeps: {
    include: ["@emotion/react", "@emotion/styled", "@mui/material", "@mui/icons-material"],
  },
  server: {
    // Bind to the loopback IP (not "localhost") so the dev URL is https://127.0.0.1:3000.
    // Spotify's OAuth no longer accepts "localhost" redirect URIs, only 127.0.0.1.
    host: "127.0.0.1",
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

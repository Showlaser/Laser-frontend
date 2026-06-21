/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";
import pkg from "./package.json";

export default defineConfig({
  // Absolute base: the build is served from the web root by the LaserAPI backend.
  base: "/",
  // Expose the package.json version to the app as the __APP_VERSION__ global so the
  // UI can display it without bundling the whole package.json.
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  // basicSsl serves the dev server over https (self-signed) — Spotify requires a
  // secure redirect URL. react() must come first.
  plugins: [react(), basicSsl()],
  resolve: {
    // Resolve the tsconfig "baseUrl: src" absolute imports (built into Vite 8+).
    tsconfigPaths: true,
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
    server: {
      // MUI v9's Transition.mjs does a directory import of
      // react-transition-group/TransitionGroupContext, which Node's native ESM
      // resolver rejects. Inlining lets Vite transform and resolve it.
      deps: {
        inline: ["@mui/material"],
      },
    },
  },
});

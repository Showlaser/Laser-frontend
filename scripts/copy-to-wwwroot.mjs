// Copies the Vite build output into the LaserAPI backend's wwwroot so the API can
// serve the frontend (option A). Zero dependencies; cross-platform.
//
// Destination defaults to the sibling LaserAPI repo and can be overridden with the
// LASERAPI_WWWROOT environment variable.
import { rmSync, cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = resolve(projectRoot, "build");
const wwwroot = process.env.LASERAPI_WWWROOT
  ? resolve(process.env.LASERAPI_WWWROOT)
  : resolve(projectRoot, "../LaserAPI/LaserAPI/wwwroot");
const laserApiDir = resolve(wwwroot, "..");

if (!existsSync(buildDir)) {
  console.error(`[copy-to-wwwroot] Build output not found at ${buildDir}. Run "vite build" first.`);
  process.exit(1);
}
if (!existsSync(laserApiDir)) {
  console.error(`[copy-to-wwwroot] LaserAPI project not found at ${laserApiDir}.`);
  console.error("  Set LASERAPI_WWWROOT to the backend's wwwroot path if it lives elsewhere.");
  process.exit(1);
}

rmSync(wwwroot, { recursive: true, force: true });
mkdirSync(wwwroot, { recursive: true });
cpSync(buildDir, wwwroot, { recursive: true });

console.log(`[copy-to-wwwroot] Copied ${buildDir} -> ${wwwroot}`);

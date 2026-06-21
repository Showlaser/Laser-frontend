/// <reference types="vite/client" />

// Injected at build time by Vite's `define` (see vite.config.mts) from package.json.
declare const __APP_VERSION__: string;

declare module "flatten-svg" {
  // flatten-svg ships no type declarations; the call site relies on the same loose
  // typing the previous require() gave it, so keep the return as any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function flattenSVG(svg: SVGSVGElement | string): any;
}

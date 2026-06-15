/// <reference types="vite/client" />

declare module "flatten-svg" {
  // flatten-svg ships no type declarations; the call site relies on the same loose
  // typing the previous require() gave it, so keep the return as any.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function flattenSVG(svg: SVGSVGElement | string): any;
}

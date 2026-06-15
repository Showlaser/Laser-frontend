import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  // Don't lint build output, deps, or Cypress
  { ignores: ["build", "node_modules", "cypress"] },
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Off by choice: this codebase co-locates React contexts with their provider
      // components. The rule only affects dev-time Fast Refresh, not correctness or
      // production output, so the co-location pattern is fine here.
      "react-refresh/only-export-components": "off",
      // Pre-existing tech debt: surface as warnings instead of blocking the build.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      // Off by choice: react-hooks v7 ships React Compiler readiness rules. This project
      // does not use the React Compiler, so they add little here. Re-enable (and fix the
      // flagged spots) if the compiler is adopted later.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      // Keep exhaustive-deps active to catch real issues in new code; existing intentional
      // cases are documented with targeted eslint-disable-next-line comments.
      "react-hooks/exhaustive-deps": "warn",
    },
  }
);

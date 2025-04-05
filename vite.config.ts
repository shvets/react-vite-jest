/// <reference types="vitest/config" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    sourcemap: true
  },
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    globals: true,
    environment: "jsdom"
  }
});

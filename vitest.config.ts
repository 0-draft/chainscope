import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx,astro}"],
      exclude: ["src/**/*.{test,spec}.{ts,tsx}", "src/env.d.ts"],
    },
  },
});

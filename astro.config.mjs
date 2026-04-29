// @ts-check

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://0-draft.github.io",
  base: "/chainscope",
  trailingSlash: "never",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});

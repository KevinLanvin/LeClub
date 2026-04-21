import { defaultLayout } from "astro-default-layout";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [defaultLayout],
    extendDefaultPlugins: true,
  },
});

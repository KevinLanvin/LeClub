import { defaultLayout } from "astro-default-layout";
import { defineConfig } from "astro/config";

// Dev only: the dev server doesn't serve the index of a `public/` folder, so /admin and
// /admin/ would 404 locally (Netlify serves them fine in production).
const adminIndex = {
  name: "admin-index",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.url === "/admin" || req.url === "/admin/") {
        req.url = "/admin/index.html";
      }
      next();
    });
  },
};

// https://astro.build/config
export default defineConfig({
  vite: { plugins: [adminIndex] },
  markdown: {
    remarkPlugins: [defaultLayout],
    extendDefaultPlugins: true,
  },
});

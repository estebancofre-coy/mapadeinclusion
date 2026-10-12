import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";

const app = new Hono<{ Bindings: HttpBindings }>();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Observa Aysén: servir la herramienta desde el servidor (el gateway del
// preview puede rechazar archivos .html grandes servidos como estáticos).
if (env.isProduction) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const oaPath = path.resolve(import.meta.dirname, "public/observa-aysen.html");
  app.get("/observa-aysen.html", (c) => {
    try {
      return c.html(fs.readFileSync(oaPath, "utf-8"));
    } catch {
      return c.text("Herramienta no disponible", 404);
    }
  });
  app.get("/observa", (c) => c.redirect("/observa-aysen.html"));
}

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { getArchivedUrl } from "./lib.ts";

const router = new Router();
router.get("/", async (context) => {
  const targetUrl = context.request.url.searchParams.get("url");
  if (!targetUrl) {
    context.response.status = 400;
    return;
  }

  const archivedUrl = await getArchivedUrl(targetUrl);
  context.response.body = { archivedUrl };
});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { getArchivedUrl } from "./lib/archive_url.ts";
import { config } from "./lib/config.ts";

const AUTH_HEADER = `Bearer ${config().SECRET_KEY}`;

const router = new Router();
router.get("/", async (context) => {
  const targetUrl = context.request.url.searchParams.get("url");
  if (!targetUrl) {
    context.response.status = 400;
    return;
  }

  const authHeader = context.request.headers.get("Authorization");
  if (authHeader !== AUTH_HEADER) {
    context.response.status = 401;
    return;
  }

  try {
    const archivedUrl = await getArchivedUrl(targetUrl);
    if (!archivedUrl) {
      throw new Error("did not get an archived url");
    }

    const shouldRedirect = context.request.url.searchParams.get("redirect");
    if (shouldRedirect === "1") {
      context.response.status = 302;
      context.response.headers.set("Location", archivedUrl);
    } else {
      context.response.body = archivedUrl;
    }
  } catch (error) {
    context.response.status = 500;
    context.response.body = { error };
  }
});

const app = new Application();

app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

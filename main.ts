import { load } from "https://deno.land/std/dotenv/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { getArchivedUrl } from "./lib/archive_url.ts";
import twilio from "npm:twilio";

await load({ export: true });

const router = new Router();
router.get("/", async (context) => {
  const targetUrl = context.request.url.searchParams.get("url");
  if (!targetUrl) {
    context.response.status = 400;
    return;
  }

  try {
    const archivedUrl = await getArchivedUrl(targetUrl);
    context.response.body = { archivedUrl };
  } catch (error) {
    context.response.status = 500;
    context.response.body = { error };
  }
});

router.post("/twilio", async (context) => {
  const resp = new twilio.twiml.MessagingResponse();

  const body = await context.request.body()?.value;
  const targetUrl = body.Body;

  try {
    const archivedUrl = await getArchivedUrl(targetUrl);
    if (!archivedUrl) throw new Error("Failed to get archived URL");

    resp.message(archivedUrl);
  } catch (e) {
    console.error(e);
    resp.message("Something went wrong!");
  }

  context.response.type = "text/xml";
  context.response.body = resp.toString();
});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

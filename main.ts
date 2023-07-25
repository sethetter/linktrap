import { load } from "https://deno.land/std@0.195.0/dotenv/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { getArchivedUrl } from "./lib/archive_url.ts";
import twilio from "npm:twilio";
import { isAdminNumber, isAllowedFromNumber } from "./lib/auth.ts";
import { config } from "./lib/config.ts";
import { addAllowedNumber } from "./lib/admin.ts";

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

  const msg = new URLSearchParams(await context.request.body()?.value);

  const from = msg.get("From");
  const body = msg.get("Body");
  const msid = msg.get("MessageSid");

  if (!from || !body || !msid) {
    context.response.status = 400;
    return;
  }

  console.log(`received from ${from} (SID: ${msid}): ${body}`);

  // TODO: split these into separate handlers
  if (body.toLowerCase().startsWith("add")) {
    if (!isAdminNumber(from)) {
      console.log(`number not in admin list: ${from}`);
      context.response.status = 403;
      return;
    }
    const newAllowedNumber = body.split(" ")[1];
    if (!newAllowedNumber || newAllowedNumber.length < 10) {
      resp.message("invalid number");
    } else {
      await addAllowedNumber(newAllowedNumber);
      resp.message(`Added ${newAllowedNumber}`);
    }
  } else {
    if (!(await isAllowedFromNumber(from))) {
      console.log(`number not in allowed list: ${from}`);
      context.response.status = 403;
      return;
    }

    try {
      const archivedUrl = await getArchivedUrl(body);
      if (!archivedUrl) throw new Error("Failed to get archived URL");

      resp.message(archivedUrl);
    } catch (e) {
      console.error(e);
      resp.message("Something went wrong!");
    }
  }

  context.response.type = "text/xml";
  context.response.body = resp.toString();
});

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });

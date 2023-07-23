import { Redis } from "https://deno.land/x/upstash_redis@v1.14.0/mod.ts";
import { config } from "./config.ts";

export const redisKey = (k: string) => `linktrap:${k}`;

export const redis = new Redis({
  url: config().UPSTASH_URL,
  token: config().UPSTASH_TOKEN,
});

import {
  connect,
  parseURL,
  type Redis,
} from "https://deno.land/x/redis@v0.31.0/mod.ts";
import { config } from "./config.ts";

const redisKey = (k: string) => `linktrap:${k}`;

export const redisKeys = {
  allowedNumbers: redisKey("allowed_numbers"),
};

let _redis: Redis;
export async function redis() {
  if (_redis) return _redis;
  _redis = await connect(parseURL(config().REDIS_URL));
  return _redis;
}

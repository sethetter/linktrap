import { redis, redisKey } from "./redis.ts";

export async function isAllowedFromNumber(num: string): Promise<boolean> {
  const r = await redis();
  return Boolean(await r.sismember(redisKey("allowed_numbers"), num));
}

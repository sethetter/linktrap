import { redis, redisKey } from "./redis.ts";

export async function isAllowedFromNumber(num: string): Promise<boolean> {
  return Boolean(await redis.sismember(redisKey("allowed_numbers"), num));
}

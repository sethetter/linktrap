import { redis, redisKeys } from "./redis.ts";

export async function addAllowedNumber(num: string) {
  const r = await redis();
  await r.sadd(redisKeys.allowedNumbers, num);
}

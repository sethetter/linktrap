import { config } from "./config.ts";
import { redis, redisKeys } from "./redis.ts";

export async function isAllowedFromNumber(num: string): Promise<boolean> {
  const r = await redis();
  return Boolean(await r.sismember(redisKeys.allowedNumbers, num));
}

export function isAdminNumber(num: string): boolean {
  return config().ADMIN_NUMBERS.includes(num);
}

import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const ConfigSchema = z.object({
  UPSTASH_URL: z.string(),
  UPSTASH_TOKEN: z.string(),
  ADMIN_NUMBERS: z.string().transform((s) => s.split(",")),
  PROXY: z.string().optional(),
});

type Config = z.infer<typeof ConfigSchema>;

let _config: Config | undefined;

export function config(): Config {
  if (_config) return _config;

  _config = ConfigSchema.parse({
    REDIS_URL: Deno.env.get("REDIS_URL"),
    ADMIN_NUMBERS: Deno.env.get("ADMIN_NUMBERS"),
    PROXY: Deno.env.get("PROXY"),
  });

  return _config;
}

import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

const ConfigSchema = z.object({
  PROXY: z.string().optional(),
  REDIS_URL: z.string(),
  ADMIN_NUMBERS: z.string().transform((s) => s.split(",")),
});

type Config = z.infer<typeof ConfigSchema>;

let _config: Config | undefined;

export function config(): Config {
  if (_config) return _config;

  _config = ConfigSchema.parse(
    Object.fromEntries(
      ConfigSchema.keyof().options.map((k) => [k, Deno.env.get(k)])
    )
  );

  return _config;
}

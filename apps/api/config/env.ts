import { z } from "zod";
import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const optionalPrice = z.preprocess(
  (value) =>
    value === "" || value === undefined || value === null
      ? undefined
      : Number(value),
  z.number().finite().nonnegative().optional(),
);

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-6-luna"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  AI_PROVIDER: z.enum(["mock", "openai", "gemini"]).default("mock"),
  AI_INPUT_USD_PER_MILLION: optionalPrice,
  AI_OUTPUT_USD_PER_MILLION: optionalPrice,
});

export const env = envSchema.parse(process.env);

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({
  path: path.resolve(process.cwd(), "../../.env.test"),
});process.env.AI_PROVIDER = "mock";

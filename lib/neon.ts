import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  // Surface the misconfiguration early at import time in the server runtime.
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

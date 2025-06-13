import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import env from './lib/env';

export default defineConfig({
  out: './lib/db/migrations',
  schema: './lib/db/schemas/index.ts',
  dialect: 'turso',
  dbCredentials: {
    url: env.DATABASE_URL,
    authToken: env.DATABASE_TOKEN,
  },
});

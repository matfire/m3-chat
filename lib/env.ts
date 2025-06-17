import { z } from "zod/v4";

const envSchema = z.object({
    "BETTER_AUTH_SECRET": z.string(),
    "BETTER_AUTH_URL": z.string(),
    "DATABASE_URL": z.string(),
    "DATABASE_TOKEN": z.string().optional(),
    "GITHUB_CLIENT_ID": z.string(),
    "GITHUB_CLIENT_SECRET": z.string(),
    "OPENROUTER_API_KEY": z.string(),
    "GOOGLE_API_KEY": z.string(),
    "PUSHER_KEY": z.string(),
    "PUSHER_SECRET": z.string(),
    "PUSHER_HOST": z.string().optional(),
    "PUSHER_PORT": z.string().optional(),
    "PUSHER_CLUSTER": z.string().optional(),
    "NUXT_PUBLIC_PUSHER_SECURE": z.coerce.boolean().optional().default(false),
    "PUSHER_APP": z.string(),
    "CHAT_BATCH_LENGTH": z.number().int().default(100),
    "REASON_BATCH_LENGTH": z.number().int().default(50)
})


export default envSchema.parse(process.env)
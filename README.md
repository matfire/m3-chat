# M3 Chat

> built for the t3-chat cloneathon

## Stack

- Nuxt
- Shadcn-vue
- Better-Auth
- Drizzle Orm with LibSql (i.e. you can use Turso)
- Pusher sdks
- Sockudo


## Requirements

There's a list of required and optional environment variables that are needed for M3-Chat to run

- BETTER_AUTH_SECRET: the secret used by better auth
- BETTER_AUTH_URL: basically the url of your application (i.e. chat.mgassend.sh)
- DATABASE_URL: url of your database (or your Turso instance)
- DATABASE_TOKEN: token for your database authentication (or your Turso instance) (optional)
- GITHUB_CLIENT_ID: github client id used for oauth
- GITHUB_CLIENT_SECRET: github client secret used for oauth
- OPENROUTER_API_KEY: api key used for free models on openrouter
- GOOGLE_API_KEY: api key used for free models on google

- PUSHER_HOST: host for pusher-compatible service (i.e. sockudo) (optional)
- PUSHER_PORT: port for pusher-compatible service (optional)
- PUSHER_CLUSTER: cluster for pusher-compatible service (optional) 
- PUSHER_KEY: key for pusher-compatible service
- PUSHER_SECRET: secret fro pusher-compatible service
- NUXT_PUBLIC_PUSHER_SECURE: "true" | "false" determines whether to use wss or ws protocol
- PUSHER_APP: app name for pusher-compatible service


## Running this

- npm install
- npm run dev

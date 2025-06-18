# M3 Chat
> not affiliated with T3Chat or T3Tools

## Stack

- Nuxt
- Shadcn-vue
- Better-Auth
- Drizzle Orm with LibSql (i.e. you can use Turso)
- Pusher sdks
- Sockudo


## Requirements

### Env

There's a list of required and optional environment variables that are needed for M3-Chat to run

- BETTER_AUTH_SECRET: the secret used by better auth
- BETTER_AUTH_URL: basically the url of your application (i.e. chat.mgassend.sh)

- DATABASE_URL: url of your database (or your Turso instance)
- DATABASE_TOKEN: token for your database authentication (or your Turso instance) (optional)

- GITHUB_CLIENT_ID: github client id used for oauth
- GITHUB_CLIENT_SECRET: github client secret used for oauth
- GOOGLE_CLIENT_ID: google client id used for oauth
- GOOGLE_CLIENT_SECRET: google client secret used for oauth


- OPENROUTER_API_KEY: api key used for free models on openrouter
- GOOGLE_API_KEY: api key used for free models on google

- PUSHER_HOST: host for pusher-compatible service (i.e. sockudo) (optional)
- PUSHER_PORT: port for pusher-compatible service (optional)
- PUSHER_CLUSTER: cluster for pusher-compatible service (optional) 
- PUSHER_KEY: key for pusher-compatible service
- PUSHER_SECRET: secret fro pusher-compatible service
- NUXT_PUBLIC_PUSHER_SECURE: "true" | "false" determines whether to use wss or ws protocol
- PUSHER_APP: app name for pusher-compatible service

### Programs

In development, the script tries to create a local libsql database. For this, you will need to install the [turso cli](https://docs.turso.tech/cli/introduction)

I would also advise using a local pusher-compatible websocket service. I used [sockudo](https://sockudo.app/) and it has worked really well.

## Running the application

### Migrations

To run the migrations, make sure the db is setup correctly (either on Turso or locally), then run:
```sh
(p)npm run db:migrate
```

### In development

simply run
```sh
(p)npm run dev
```

### In production

After building the application with

```sh
(p)npm run build
```

You can run it by using

```sh
node --env-file .env .output/server/index.mjs
```
This will load the .env file you created and run the built nitro server

### Docker

There's also a docker image at `ghcr.io/matfire/m3-chat`. It listens on port 80
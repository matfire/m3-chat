# Build Stage 1

FROM node:22 AS build
WORKDIR /app

ENV BETTER_AUTH_SECRET=change_this
ENV BETTER_AUTH_URL=change_this
ENV DATABASE_URL=change_this
ENV GITHUB_CLIENT_ID=change_this
ENV GITHUB_CLIENT_SECRET=change_this
ENV OPENROUTER_API_KEY=change_this
ENV GOOGLE_API_KEY=change_this
ENV PUSHER_HOST=change_this
ENV PUSHER_PORT=6001
ENV PUSHER_KEY=change_this
ENV PUSHER_SECRET=change_this
ENV PUSHER_SECURE=false
ENV PUSHER_APP=change_this
ENV GOOGLE_CLIENT_ID=change_this
ENV GOOGLE_CLIENT_SECRET=change_this

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# Build the project
RUN pnpm run build

# Build Stage 2

FROM node:22
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./

# Change the port and host
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]

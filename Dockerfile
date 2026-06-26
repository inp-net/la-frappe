FROM node:22-slim AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable

# Récupérer les dépendances de prod
FROM base AS prod
COPY package.json pnpm-lock.yaml /app/
RUN pnpm fetch --prod

# Build de l'app
FROM base AS builder
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# On copie tout le code source pour le build
COPY . /app

# Création del a DB
RUN node generate-hierachy.js

RUN pnpm svelte-kit sync
RUN pnpm run build

# Image finale
FROM base

COPY package.json /app
COPY pnpm-lock.yaml /app
COPY --from=prod /pnpm /pnpm
RUN pnpm install --no-frozen-lockfile --prod --ignore-scripts

# On récupère le build et le dossier static
COPY --from=builder /app/build /app/build
COPY --from=builder /app/static /app/static

CMD ["node", "build/index.js"]

FROM node:22-slim AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable

# Récupérer les dépendences
FROM base AS prod

COPY package.json pnpm-lock.yaml /app/
RUN pnpm fetch --prod

# Build de l'app et création de la DB
FROM base AS builder

COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --no-frozen-lockfile --ignore-scripts

COPY . /app
RUN pnpm svelte-kit sync
RUN pnpm run build

FROM base

COPY package.json /app
COPY pnpm-lock.yaml /app
COPY --from=prod /pnpm /pnpm
RUN pnpm install --no-frozen-lockfile --prod --ignore-scripts
COPY --from=builder /app/build /app/build
# Due à la modification des fichiers de generate-hierachy
COPY --from=builder /app/static /app/static
COPY generate-hierachy.js /app/generate-hierachy.js

CMD ["sh", "-c", "node generate-hierachy.js && node build/index.js"]

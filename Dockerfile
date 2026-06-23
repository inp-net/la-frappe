FROM node:22-slim AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY package.json pnpm-lock.yaml /app/
RUN corepack enable && corepack install

# Récupérer les dépendences
FROM base AS prod

COPY pnpm-lock.yaml /app
RUN pnpm fetch --prod

# Build de l'app et création de la DB
FROM base AS builder

COPY . /app
RUN pnpm install --frozen-lockfile
RUN node generate-hierachy.js
RUN pnpm svelte-kit sync
RUN pnpm run build

FROM base

COPY package.json /app
COPY pnpm-lock.yaml /app
COPY --from=prod /pnpm /pnpm
RUN pnpm install --frozen-lockfile --prod --ignore-scripts
COPY --from=builder /app/build /app/build

CMD ["node", "build/index.js"]

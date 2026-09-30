FROM node:22-slim AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Installer les dépendances
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Configurer pnpm 11+ pour autoriser l'exécution des scripts de build
RUN echo "allowBuilds:" > pnpm-workspace.yaml && \
    echo "  esbuild: true" >> pnpm-workspace.yaml && \
    echo "  fs-xattr: true" >> pnpm-workspace.yaml && \
    echo "  lefthook: true" >> pnpm-workspace.yaml

# Build de l'app
FROM base AS builder
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --no-frozen-lockfile

# On copie tout le code source pour le build
COPY . /app

RUN pnpm svelte-kit sync
RUN pnpm run build

# Image finale
FROM base

COPY package.json /app
COPY pnpm-lock.yaml /app
RUN pnpm install --no-frozen-lockfile --prod

# On récupère le build
COPY --from=builder /app/build /app/build
COPY --from=builder /app/static /app/static
COPY --from=builder /app/generate-hierachy.js /app/generate-hierachy.js

# On crée les dossiers pour la base de données
RUN mkdir -p /app/data/frappe_tree /app/data/logs /app/data/uploads

CMD ["sh", "-c", "node generate-hierachy.js && node build/index.js"]

FROM node:24-alpine AS builder

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier le fichier package
COPY package*.json pnpm-lock.yaml svelte.config.js vite.config.* tsconfig.json* ./

ENV PNPM_CONFIG_ONLY_BUILT_DEPENDENCIES=esbuild

# Installer les dépendences
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copier le code
COPY . .

# Générer la base de données
RUN node generate-hierachy.js

# Build l'application
RUN pnpm run build
RUN pnpm prune --prod

FROM node:24-alpine

WORKDIR /app

# Copier l'application buildé
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port 3000 pour SvelteKit
EXPOSE 3000

# Lancer le serveur
CMD ["node", "build/index.js"]

FROM node:20-alpine AS builder

WORKDIR /app

# Installer pnpm
RUN npm install -g pnpm

# Copier le fichier package
COPY package*.json pnpm-lock.yaml ./

# Installer les dépendences
RUN pnpm install --frozen-lockfile

# Copier le code
COPY . .

# Build l'application
RUN pnpm run build

FROM node:20-alpine

WORKDIR /app

# Copier l'application buildé
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port 3000 pour SvelteKit
EXPOSE 3000

# Lancer le serveur
CMD ["node", "build/index.js"]

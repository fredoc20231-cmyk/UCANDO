# --- Build stage ---
FROM node:22-slim AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# --- Production stage ---
FROM node:22-slim AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

# Cloud Run injects PORT at runtime; the app already reads process.env.PORT
EXPOSE 8080

CMD ["node", "dist/server/node-build.mjs"]

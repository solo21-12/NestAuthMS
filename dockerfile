# Build stage for all services
FROM node:18-alpine AS build

WORKDIR /app

# Install global dependencies
RUN npm install -g pnpm

# Copy the entire repo (could be optimized later if needed)
COPY . .

# Install dependencies for the entire monorepo
RUN pnpm install

# Build each service
RUN pnpm run build -- --project auth-service
RUN pnpm run build -- --project user-service
RUN pnpm run build -- --project user-api-gateway


# Repeat this for other services (user-service, user-api-gateway)
FROM node:18-alpine AS user-service
WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules /app/node_modules

# Copy the built user-service from the build stage
COPY --from=build /app/dist/apps/user-service /app

EXPOSE 3001
CMD ["node", "main.js"]

FROM node:18-alpine AS auth-service
WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules /app/node_modules

# Copy the built auth-service from the build stage
COPY --from=build /app/dist/apps/auth-service /app

EXPOSE 3002
CMD ["node", "main.js"]

FROM node:18-alpine AS user-api-gateway
WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules /app/node_modules

# Copy the built user-api-gateway from the build stage
COPY --from=build /app/dist/apps/user-api-gateway /app

EXPOSE 3000
CMD ["node", "main.js"]

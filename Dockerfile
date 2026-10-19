# Builds all four apps and serves them from one origin, each under its own path.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/container/package.json packages/container/
COPY packages/marketing/package.json packages/marketing/
COPY packages/auth/package.json packages/auth/
COPY packages/dashboard/package.json packages/dashboard/
COPY packages/react-mount/package.json packages/react-mount/
COPY packages/theme/package.json packages/theme/
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/container/dist /usr/share/nginx/html
COPY --from=build /app/packages/marketing/dist /usr/share/nginx/html/marketing
COPY --from=build /app/packages/auth/dist /usr/share/nginx/html/auth
COPY --from=build /app/packages/dashboard/dist /usr/share/nginx/html/dashboard
EXPOSE 80

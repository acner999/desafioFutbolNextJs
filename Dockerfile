FROM node:18-alpine
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm ci --production=false
COPY . .
RUN npm run build || true
EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start"]

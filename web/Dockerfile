FROM node:23-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --prefer-offline --no-audit

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:23-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
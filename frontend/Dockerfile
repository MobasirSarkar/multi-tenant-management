FROM node:25-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install && pnpm install @radix-ui/react-dropdown-menu @radix-ui/react-select

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev", "--host"]

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# install dependencies
RUN npm install --legacy-peer-deps

# copy source code
COPY . .

# Vite build (ignore TS errors)
RUN npm run build

# production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
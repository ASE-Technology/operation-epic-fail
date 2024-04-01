# Stage 1: Build Angular App
FROM node:18.13.0 as builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend .
RUN npm run build

# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist/frontend/browser/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

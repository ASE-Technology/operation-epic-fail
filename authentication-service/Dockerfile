FROM node:18.16.0
WORKDIR /app

COPY ./authentication-service/package*.json ./
RUN npm install

COPY ./authentication-service .
EXPOSE 3001
CMD ["node", "index.js"]

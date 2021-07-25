FROM node:14.17-alpine

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm ci --verbose
COPY . .

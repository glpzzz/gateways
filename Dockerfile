FROM node:14.17-alpine

ARG NODESCRIPT=start
ENV NODESCRIPT $NODESCRIPT

WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .

CMD ["npm run", "${NODESCRIPT}"]

# Stage 2 - the production environment
FROM keymetrics/pm2:latest-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . .

EXPOSE 80

CMD ["pm2-runtime", "start", "./build/index.js"]

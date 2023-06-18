FROM node:16-alpine3.17

EXPOSE 5100

WORKDIR /app

COPY /dist/src .

COPY /node_modules node_modules

COPY /package.json package.json

CMD ["node", "app.js"]
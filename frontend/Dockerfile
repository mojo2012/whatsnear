FROM node:14-alpine

LABEL authors="Matthias Fuchs, Thomas Rotter"
LABEL projectName="whatsnear-frontend"

WORKDIR /app

COPY package*.json /app/

RUN apk add --no-cache --virtual .gyp python make g++ && \
	npm install -g npm@latest @ionic/cli && \
	npm install && \
	apk del .gyp

COPY ./ /app/

ENV HOST_NAME frontend
ENV PORT 8100

CMD ["npm", "run", "start:prod"]


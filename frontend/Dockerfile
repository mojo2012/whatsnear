FROM node:14-alpine

LABEL authors="Matthias Fuchs, Thomas Rotter"
LABEL projectName="whatsnear-frontend"

WORKDIR /app
#COPY package*.json /app/

COPY package*.json /app/

RUN npm install -g npm@latest && \
	npm install -g @ionic/cli && \
	npm install

COPY ./ /app/

ENV HOST_NAME frontend
ENV PORT 8100

CMD ["npm", "run", "start:prod"]


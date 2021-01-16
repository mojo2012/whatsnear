# BUILDING
FROM node:14-alpine as build
WORKDIR /app
#COPY package*.json /app/

COPY package*.json /app/

RUN npm install -g npm@latest && \
	npm install -g @ionic/cli && \
	npm install

COPY ./ /app/

RUN ionic build

# RUNTIME CONTAINER
FROM nginx:alpine

COPY resources/docker/templates/default.conf.template /etc/nginx/templates/

LABEL authors="Matthias Fuchs, Thomas Rotter"
LABEL projectName="whatsnear-frontend"

RUN rm -rf /usr/share/nginx/html/*

ENV PORT 8080
ENV HOST_NAME localhost

COPY --from=build /app/dist/ /usr/share/nginx/html/
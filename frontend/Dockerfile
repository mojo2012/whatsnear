# BUILDING
FROM node:14-alpine as build
WORKDIR /app
#COPY package*.json /app/

COPY ./ /app/

RUN npm install -g npm@latest && \
	npm install -g @ionic/cli && \
	npm install

RUN ionic build

# RUNTIME CONTAINER
FROM nginx:alpine

LABEL authors="Matthias Fuchs, Thomas Rotter"
LABEL projectName="whatsnear-frontend"

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist/ /usr/share/nginx/html/
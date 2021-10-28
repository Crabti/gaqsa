FROM node:16
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock /app/frontend/
RUN yarn --network-timeout 1000000
COPY . /app/frontend
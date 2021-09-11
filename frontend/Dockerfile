FROM node:16
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json yarn.lock /app/frontend/
RUN yarn
COPY . /app/frontend
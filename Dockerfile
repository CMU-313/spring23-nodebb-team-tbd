FROM node:lts

RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

COPY --chown=node:node install/package.json /usr/src/app/package.json

USER node

RUN npm install --only=prod && \
    npm cache clean --force

RUN rm -r ./node_modules/nodebb-plugin-poll-modified 
COPY --chown=node:node ./nodebb-plugin-poll-modified ./node_modules/
COPY --chown=node:node . /usr/src/app

ENV NODE_ENV=production \
    daemon=false \
    silent=false

EXPOSE 4567

# CMD test -n "${SETUP}" && ./nodebb setup || node ./nodebb build; node ./nodebb start
CMD test -n "${SETUP}" && ./nodebb setup || node ./nodebb start

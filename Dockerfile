ARG NODE_HOME=/home/node

FROM node:18-alpine AS update
RUN npm install\
 --global\
 --loglevel error\
 npm@9

FROM update AS layout
ARG NODE_HOME
USER node
WORKDIR ${NODE_HOME}
COPY --chown=node:node ./config ./config
RUN mkdir -p ./workspace/public
COPY --chown=node:node ./public ./workspace/public
WORKDIR ${NODE_HOME}/workspace

FROM layout AS config
RUN FROM=../config;\
 for FILE in ${FROM}/* ${FROM}/.[!.]*;\
 do ln -s $FILE ./;\
 done

FROM config AS install
RUN npm install\
 --loglevel error\
 --no-optional\
 --ignore-scripts

FROM install AS development
# TODO

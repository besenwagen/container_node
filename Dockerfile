FROM node:14-alpine AS update
RUN npm install\
 --global\
 --loglevel error\
 npm@6

FROM update AS layout
USER node
WORKDIR /home/node
COPY --chown=node:node ./config ./config
RUN mkdir -p ./workspace/public
COPY --chown=node:node ./public ./workspace/public
WORKDIR ./workspace

FROM layout AS config
RUN for FILE in ../config/*;\
 do ln -s $FILE ./;\
 done &&\
 for FILE in ../config/.[!.]*;\
 do ln -s $FILE ./;\
 done

FROM config AS install
RUN npm install\
 --loglevel error\
 --no-optional\
 --ignore-scripts

FROM install AS development
# TODO

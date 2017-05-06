FROM node:7.9-alpine

ENV MAIN_SCRIPT /opt/app/server.js
ENV PORT 8080

# Pre-install
ADD opt/ /opt/
WORKDIR /opt

# Install
RUN yarn install \
 && yarn cache clean

CMD node ${MAIN_SCRIPT}
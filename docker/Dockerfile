FROM node:6.2.2-slim

ENV MAIN_SCRIPT /opt/app/server.js
ENV PORT 8080

# Pre-install
ADD opt/ /opt/
WORKDIR /opt

# Install
RUN apt-get update \
 && apt-get install -y vim --no-install-recommends \
 && rm -rf /var/lib/apt/lists/* \
 && npm install --production \
 && npm cache clean

CMD node ${MAIN_SCRIPT}
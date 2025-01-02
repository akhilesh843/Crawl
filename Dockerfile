FROM pull ghcr.io/puppeteer/puppeteer:23.10.1

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable


WORKDIR /user/src/app


COPY package*.json ./
RUN npm ci
COPY . .
CMD ["node","price.js"]
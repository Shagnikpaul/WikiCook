FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
# Install CLI ONCE
RUN npm install -g @better-auth/cli
COPY . .
EXPOSE 8001
COPY migration-script.sh /usr/src/app/migration-script.sh
RUN chmod +x /usr/src/app/migration-script.sh

ENTRYPOINT ["sh", "/usr/src/app/migration-script.sh"]
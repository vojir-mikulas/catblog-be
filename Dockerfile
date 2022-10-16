FROM node:16

WORKDIR /app

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY tsconfig.json file
COPY tsconfig.json ./

RUN npm install

# COPY
COPY . .



EXPOSE 3000
EXPOSE 3002

CMD ["npm", "start"]
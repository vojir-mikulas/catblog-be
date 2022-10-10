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

ENV PORT=8080
ENV DATABASE_URL="0.0.0.0:5432"
EXPOSE 8080


CMD ["npm", "start"]
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev
RUN mkdir -p logs

COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]

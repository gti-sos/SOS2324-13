# Base image
FROM node:18


# Move to app folder
WORKDIR /usr/src/app


# Install app dependencies
COPY package*.json ./


# Install app dependencies
RUN npm install


# Copy the app code to the image
COPY . .
EXPOSE 10000
CMD [ "npm", "start" ]
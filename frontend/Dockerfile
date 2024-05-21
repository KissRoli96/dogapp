# Use an official Node runtime as the base image
FROM node:latest

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json, package-lock.json (if available) and yarn.lock (if available) to the working directory
COPY package*.json yarn.lock ./

# Install any needed packages specified in package.json
RUN yarn install

# Copy the .env file
COPY .env ./

# Bundle app source
COPY . .

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run the app when the container launches
CMD ["yarn", "start"]
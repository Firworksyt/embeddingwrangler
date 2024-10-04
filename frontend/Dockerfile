# Use an official Node runtime as the parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build Tailwind CSS
RUN npm run build:css

# Build the app for production
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Set the command to start the app
CMD ["serve", "-s", "build", "-l", "3000"]
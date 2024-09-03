# Stage 1: Build the application
FROM node:20.11 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Run the application
FROM node:20.11

# Set the working directory
WORKDIR /app

# Copy the node_modules from the build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the built code from the build stage
COPY --from=build /app/dist ./dist

# Copy Prisma schema and client generation
COPY --from=build /app/prisma ./prisma

# Expose the application port (adjust if necessary)
EXPOSE 3333

# Define the command to start the application
CMD ["node", "dist/app.js"]

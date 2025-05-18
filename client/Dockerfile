# Stage 1: Build the application
FROM node:20.2.0 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the application
FROM node:20.2.0

WORKDIR /app

# Copy the build output from the previous stage
COPY --from=build /app/build ./build

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]

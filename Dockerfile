# ---------------------------------
# Development
# ---------------------------------
FROM node:12.16-alpine As development

WORKDIR /usr/src/app
# Copy package and package-lock files
COPY package*.json ./
# Install development dependencies
RUN npm install --only=development
# Copy the source code
COPY . .
# Build the application
RUN npm run build
# Run unit tests
RUN npm test

# ---------------------------------
# Production
# ---------------------------------
FROM node:12.16-alpine as production

# Arguments
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

WORKDIR /usr/src/app
# Copy package and package-lock files
COPY package*.json ./
# Install production dependencies
RUN npm install --only=production
# Copy the source code
COPY . .
# Copy build files from development stage
COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
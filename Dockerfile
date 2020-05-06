# ---------------------------------
# Development
# ---------------------------------
FROM node:12.16-alpine As development

WORKDIR /usr/src/app
# Copy package and package-lock files
COPY package*.json ./
# Install dependencies
RUN npm install
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

WORKDIR /usr/src/app
# Copy package and package-lock files
COPY package*.json ./
# Install production dependencies
RUN npm install --only=production
# Copy build files from development stage
COPY --from=development /usr/src/app/dist ./dist

ARG AWS_REGION=us-west-2
ENV AWS_REGION=${AWS_REGION}

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

CMD ["node", "dist/main"]
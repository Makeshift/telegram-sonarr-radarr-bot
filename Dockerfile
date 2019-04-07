# Basic multi-stage build - Use node:alpine for npm
FROM node:alpine as build
WORKDIR /app
RUN npm install

# Using distroless for actually running - Much smaller base image and smaller attack surface
FROM gcr.io/distroless/nodejs:latest
COPY --from=build /app /
CMD ["index.js"]
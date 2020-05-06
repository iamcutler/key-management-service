# Key Management Service

This service is used to handle envolope encryption within the platform. This service can generate Customer Master Keys (CMK) and Data Keys for encryption and decryption of data.

### Environment Variables
- PORT (Desired port for the application to run on. Default is 3000)
- AWS_REGION

##### Local development:
Copy the .env.sample file to a new .env file and set the required environment variables

### Install application dependencies
```sh
$ npm install
```

### Start the application in development mode
```sh
$ npm run start:dev
```
---
### Docker
---
This service is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 3000, so change this within the Dockerfile or dynamically if necessary. When ready, simply use the Dockerfile to build the image.

```sh
docker build -t key-management-service:latest .
```

```sh
docker run -d -p 3000:3000 key-management-service:latest
```

Verify the deployment by navigating to your server address in your preferred browser.

```sh
127.0.0.1:3000
```
---
### Quality
---
#### Run unit tests
```sh
npm test
```

#### Run code coverage report
```sh
npm run test:cov
```

---
### API Documentation
---
Navigate to the server address in your preferred browser.
```sh
127.0.0.1:3000/api-docs
```

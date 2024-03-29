#prettier-ignore
FROM node:16

# Create app directory 
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
ARG NODE_ENV
# RUN If [ "$NODE_ENV" = "development" ]; then npm install; else npm install --only=production; fi
# RUN if [ "$NODE_ENV" = "development" ]; then \
#     npm install; \
#     else \
#     npm install --only=production; \
#     fi
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000

CMD [ "npm" , "start" ]
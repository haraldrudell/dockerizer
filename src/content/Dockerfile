# as of 160711, argon is Node.js LTS
# babel no work less than Node.js 5
FROM node:5.12

LABEL alabel="abc"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3002
CMD [ "npm", "start" ]

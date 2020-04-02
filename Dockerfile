FROM fsharp

# Install node
RUN apt-get update
RUN apt-get -y install curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_10.x  | bash -
RUN apt-get -y install nodejs

WORKDIR app

COPY package*.json ./
RUN npm install
RUN npm install -g pm2

COPY analyser analyser
COPY dist dist

EXPOSE 8080:8080
# RUN pm2 start dist/index.js -i max
CMD [ "pm2-runtime","dist/index.js","-i","max" ]
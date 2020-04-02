FROM gitpod/workspace

RUN sudo apt-get update
RUN sudo apt-get install fsharp

# WORKDIR app

# COPY package*.json ./
# RUN npm install
# RUN npm install -g pm2

# COPY analyser analyser
# COPY dist dist

# EXPOSE 8080:8080
# # RUN pm2 start dist/index.js -i max
# CMD [ "pm2-runtime","dist/index.js","-i","max" ]

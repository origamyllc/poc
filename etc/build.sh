#!/bin/bash

. ~/.nvm/nvm.sh
nvm install v0.10.30
nvm use 0.10.30
echo "Node version: $(node --version)"

npm remove bower
npm remove bower -g

npm install

#Install bower
npm install bower
npm install bower -g

bower cache clean --allow-root
echo "Cleaning Bower local cache"
rm -fr .bower-cache
bower install angular --allow-root
bower update --allow-root
echo "Installing Gulp"
npm install gulp -g
npm install gulp

#Prepare the project to run on webserver
gulp dist

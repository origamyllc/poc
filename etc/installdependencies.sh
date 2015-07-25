#!/bin/bash

#TODO:  Add notes here on how to install NVM (Node Version Manager)
#Make sure the nvm is installed on the user account of every agent.
. ~/.nvm/nvm.sh
nvm install v0.10.30
nvm use 0.10.30
echo "Node version: $(node --version)"

npm install --production

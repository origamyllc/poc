#remove all non-running containers
docker rm $(docker ps -a -q)

#remove all untagged images
docker rmi $(docker images | grep "^<none>" | awk '{print $3}')

#docker rmi scarmod/contracts-nodejs

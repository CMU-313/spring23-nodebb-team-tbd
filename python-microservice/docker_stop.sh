{
    docker kill microservice-instance || true
    docker rm microservice-instance
} &> /dev/null

echo -e "\e[32mPython microservice stopped.\e[0m"
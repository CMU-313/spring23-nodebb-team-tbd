{
    docker kill microservice-instance || true
    docker rm microservice-instance
} &> /dev/null

echo -e "\e[32mStarting Python microservice on port 8000\e[0m"

docker run -it --name microservice-instance -p 8000:8000 python-microservice
ENVIRONMENT=$1

find ./k8s/$ENVIRONMENT -type f -exec sed -i -e "s/REGISTRY/$DOCKER_REGISTRY/g" {} \;
find ./k8s/$ENVIRONMENT -type f -exec sed -i -e "s/IMAGE_VERSION/$IMAGE_VERSION/g" {} \;

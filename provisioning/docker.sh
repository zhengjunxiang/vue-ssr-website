#!/bin/bash
#
###############################################################################
#              Docker Image build scripts
#
#    This script is useful for buildnig, cleaning, testing a new image.
#
#    Username and password of alicloud image registry service is required.
#
###############################################################################
#
#set -xue
set -x

PS4='+ $(date +"%F %T%z") ${BASH_SOURCE}:${LINENO}): ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'


RELEASE_TAG_PREFIX="release-v-"

AP_PROJECT="${AP_PROJECT:=apfrontend}"
AP_REGION="${AP_REGION:=cn-hongkong}"
AP_REGISTRY="${AP_REGISTRY:=registry.$AP_REGION.aliyuncs.com}"
AP_NAMESPACE="${AP_NAMESPACE:=XXXv3}"


cd "$(dirname $0)"
basedir="$(dirname $(pwd))"
cd ${basedir}


docker_login() {
    docker login ${AP_REGISTRY}
}

docker_clean() {
    local namespace="$1"
    local app="$2"

    namespace=${namespace:=$AP_NAMESPACE}
    app=${app:=$AP_PROJECT}
    local image=${AP_REGISTRY}/${namespace}/${app}

    docker ps -a  | grep ${image} | grep Exit && docker ps -a     | grep ${image} | grep Exit | awk '{print $1}'| xargs docker rm -f
    docker images | grep ${image}             && docker images    | grep ${image} | awk '{print $3}'| xargs docker rmi -f
    docker images | grep none                 && docker images    | grep none     | awk '{print $3}'| xargs docker rmi -f
    docker volume ls                          && docker volume ls | awk '{print $NF}' | xargs docker volume rm
    docker system prune <<< y
    # find ./ -type f -name *.log -delete
    # find ./ -type d -name target -exec rm -r {} \;
}

docker_build() {
    local app="$1"
    local namespace="$2"

    namespace=${namespace:=$AP_NAMESPACE}
    app=${app:=$AP_PROJECT}
    local image="${AP_REGISTRY}/${namespace}/${app}"

    # git tag , git push
    git log -n 1|head -3                     >  VERSION
    echo -e "Build:\t$(date '+%F %T')"       >> VERSION
    echo -e "Branch:\t$(git branch|grep ^*)" >> VERSION

    docker images|grep ${image}|awk '{print $3}'|xargs docker rmi  -f
    # docker-compose build
    docker build -f provisioning/Dockerfile -t ${image} .
}

docker_push() {
    local tag="$1"
    local app="$2"
    local namespace="$2"

    local tag="${tag:=$RELEASE_TAG_PREFIX$(git rev-parse --short HEAD)}"
    #local tag="${tag:=$RELEASE_TAG_PREFIX$(date +'%y%m%d%H%M%S')}"
    local app="${app:=$AP_PROJECT}"
    local namespace="${namespace:=$AP_NAMESPACE}"
    local image="${AP_REGISTRY}/${namespace}/${app}"

    for img in $(docker images | grep "${image}.*latest" | awk '{print $1}'); 
    do
        docker tag  ${img} ${img}:${tag};
        docker push ${img}:${tag};
        docker push ${img};
    done
}

docker_start() {
    echo "docker-compuse up -d"
}

docker_help() {
    set +x
    echo -e "\nUsage: $0 <login | clean | build | push | start | help>\n"
    echo -e "    $0 login	"
    echo -e "    $0 clean 	"
    echo -e "    $0 build	"
    echo -e "    $0 push    "
    echo -e "    $0 start   "
    echo -e "    $0 help 	"
    echo    ""
} 

if [ "${#}" -eq 0 ]; then
    docker_help && exit
else
    docker_"${@}"
fi

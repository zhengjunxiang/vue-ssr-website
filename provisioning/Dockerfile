# registry.cn-hongkong.aliyuncs.com/XXXv3/frontline
FROM node:10.16.0-alpine as build
run sed   -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g'  /etc/apk/repositories
COPY . /opt/frontline
WORKDIR /opt/frontline
RUN set -xue; \
#        yarn config set registry 'https://registry.npm.taobao.org' && \
        #npm run build
        yarn install && \
        yarn run build 


FROM node:10.16.0-alpine
RUN   sed   -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g'  /etc/apk/repositories; \
      set -xue; \
      apk update && apk add \
        curl \
        wget 
COPY --from=build /opt/frontline /opt/frontline
WORKDIR /opt/frontline
EXPOSE 8080
CMD ["npm", "run", "publish"]

# nginx:1.15.0-alpine
#FROM registry.cn-beijing.aliyuncs.com/ap-1001/nginx
#COPY --from=build /opt/frontline/dist /opt/frontline

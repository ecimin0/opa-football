FROM nginx:latest

EXPOSE 80

RUN rm -fr /usr/share/nginx/html/*

COPY ./www/ /usr/share/nginx/html/

COPY ./custom-default.conf /etc/nginx/conf.d/default.conf

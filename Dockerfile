FROM nginx:1.23.3

# Set the current working directory inside the image
WORKDIR /app

COPY dist/a-help-fe /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

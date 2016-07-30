md
===

Usage
=====

* create compose.yml
```
$ vim compose.yml
services:
  container_name: md
  image: localhost:49000/md:latest
  volumes:
    - /vagrant/md/app:/opt/app
  ports:
    - "18081:8080"
    - "3306:3306"
  environment:
    MAIN_SCRIPT: /opt/app/server.js
    PORT: 8080
    MYSQL_USER: user
    MYSQL_PASSWORD: password
```

* run the md container
```
$ docker-compose up -d
```
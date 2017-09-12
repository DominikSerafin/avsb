# avsb

AvsB is a little tool to vote between two images. You can use it to get feedback for your latest drawing/mockup/photo/UI/whatever.


## How it works

* 🎎 Single post (aka Comparison) consists of two images.
* 🎯 You can vote only one time for each Comparison.
* 🏆 You can add your own Comparison for each 10 votes given.
* 👀 You can see score of Comparison after you've voted on it.
* 🙅 No sign up required.



## How it works under the hood

* ES6 Modules syntax is used on the client code and CommonJS module syntax is used on server. It's mostly personal taste and the fact that Node doesn't support ES6 Modules syntax yet.
* Users are authenticated by their IP and saved to database on first entry.
* SQLite is used for database with the help of `Sequelize` an an ORM. For such a little tool SQLite should be sufficient (at least till AvsB won't gain significant traffic). There are 3 tables in the database: `users`, `comparisons` and `votes`.
* File validation is done via `mmmagic` package which reads the bytes of the file and detects the proper `Content-Type`.
* Image processing is done via `jimp` package which doesn't have any dependencies other than JavaScript. This means deploying it is easy but the image processing is slower than with the help of alternatives. In the case of AvsB (resizing image) the performance of it is sufficient. Originally I've used `sharp` package (which is blazing fast) but it couldn't compile on my $5 VPS where the AvsB is deployed due to insufficient RAM.
* Weirdly sounding slugs of Comparison are created with the help of `Moniker` package.


## Technologies / Requirements

* Node 7.6+ (need to support async/await)
* Express 4+
* Sequelize.js
* React
* React-Router
* Redux
* Webpack
* Babel
* Sass



## Server (API) structure

* `application/config/`: development and production config
* `application/extract/`: extractors (deserializers) of data queried from database
* `application/middleware/`: custom middlewares (users auth and creation is here)
* `application/migrations/`: sequelize.js migrations
* `application/models/`: sequelize.js initializations and models (to keep things simple everything is in single file - `/index.js`)
* `application/resources/`: miscellaneous resources (static, images, files)
* `application/test/`: mocha tests (not much needed really in such a small application - so it only tests if the config is alright)
* `application/util/`: utilities, helpers & abstractions
* `application/views/`: views for the routes declared in `application/index.js`



## Todo (contributions welcome)

* Implement Autotrack for Google Analytics (https://github.com/googleanalytics/autotrack)
* Infinite scroll for "Explore" page.
* Center vertically with `vertical-align` method (for IE<11) instead of Flexbox.
* If the tool will get more traction then save users to database only before they vote for first time. That will prevent database getting spammed with all the visitors not interacting with site.
* If the SQLite will be slow switch to PostgreSQL.





# Deployment

AvsB instance on serafin.io uses both server and client on the same subdomain. Server API probably should be on its own subdomain but I wanted to keep things simple in this case. Sever API is served from `/api/` subdirectory (https://avsb.serafin.io/api/) and the client from `/` (https://avsb.serafin.io/).

Also - I like to use 9xxx ports because they are most of the time unused. So in this case AvsB is deployed on 9550 port.



## Folder Structure

I like to keep things portable and in a single place. That's why repository, database, logs and media are in a single folder.


```
/somedir/avsb
│
└───log
│
└───media (all uploaded media)
│
└───public (repository root)
│   │
│   └───client
│   │   │
│   │   └───src
│   │   │
│   │   └───dist
│   │
│   └───server
│       │
│       └───application
│       │
│       └───database
│       │
│       └───temp
│       │
│       └───media
│
```



## Systemd config (`etc/systemd/system/avsb.service`)

```
[Unit]
Description=avsb
Requires=nginx.service
Before=nginx.service
After=network.target

[Service]
WorkingDirectory=/somedir/avsb/public/server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node application/index.js
Restart=always

[Install]
WantedBy=multi-user.target

```



## Nginx custom log format (for sites behind Cloudflare) (`etc/nginx/nginx.conf`)

```
log_format cloudflare '[$time_local] - $remote_user - '
	                  '$remote_addr ($http_x_forwarded_for / $http_cf_connecting_ip) - '
                      '"$request" $status $bytes_sent ($gzip_ratio) - '
                      '"$http_user_agent" "$http_referer"';
```


## Server & client combined Nginx config (`/etc/nginx/sites-.../avsb.config`)

```

# redirect from www
server {
    listen 80;
    server_name www.avsb.serafin.io;
    return 301 $scheme://avsb.serafin.io$request_uri;
}

server {

    listen 80;
    server_name avsb.serafin.io;
    index index.html;
    client_max_body_size 5m;

    access_log /somedir/avsb/log/nginx_access.log cloudflare;
    error_log /somedir/avsb/log/nginx_error.log;

    # redirect from http to https (Cloudflare specific)
    if ($http_x_forwarded_proto = "http") {
        return 301 https://avsb.serafin.io$request_uri;
    }

    location /favicon {
        alias /somedir/avsb/public/client/dist/assets/favicon;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        expires 30d;
    }

    location /favicon.ico {
        alias /somedir/avsb/public/client/dist/assets/favicon/favicon.ico;
    }

    # proxy API and rewrite to root directory
    location /api {
        rewrite ^/api(/.*)$ $1 break;
        proxy_pass http://127.0.0.1:9550;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # serve media files
    location /api/media {
        alias /somedir/avsb/public/server/media/;
        add_header Pragma public;
        add_header Cache-Control "public, must-revalidate, proxy-revalidate";
        expires 30d;
    }

    # serve single page application client
    location / {
        root /somedir/avsb/public/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # enable gzip
    gzip on;
    gzip_disable "msie6";
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_buffers 16 8k;
    gzip_http_version 1.1;
    gzip_types
        text/plain
        text/xml
        text/html
        text/css
        text/javascript
        application/json
        application/xhtml+xml
        application/xml
        application/xml+rss
        application/x-javascript
        application/octet-stream
        font/otf
        font/ttf
        font/eot
        font/woff
        font/woff2
        image/x-icon
        image/webp
        image/svg+xml
        image/jpeg
        image/jpg
        image/gif
        image/png;

}



```

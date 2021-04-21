
# Thori-dal
> Accounts and passwords management tool based on client-side encryption

- Mobile friendly
- Client Side Encryption(AES-256-CBC)
- TOTP(2FA, Google Authenticator) Support

## Deploy

### As Stack

Requirements:
 - docker
 - docker-compose

Start service

```
$ cd deploy
$ sudo docker-compose -p thoridal up -d
```

Stop service

```
$ cd deploy
$ sudo docker-compose -p thoridal down
```

### Standalone

Requirements:
 - docker
 - Externel mongoDB instance

Edit `./deploy/config.credential.js`

```
$ sudo docker pull nihiue/thoridal
$ sudo docker run -d -p 3000:3000 --restart=always --name thoridal -v ./deploy/config.credential.js:/server/app/config/credential.js:ro nihiue/thoridal
```

### Usage

Open http://localhost:3000/ in browser, login with `root` `root_pwd`


## Screenshots

![screenshot_1](https://user-images.githubusercontent.com/5763301/115579049-61b87600-a2f8-11eb-8cfe-1536a0a74dd8.png)

![screenshot_2](https://user-images.githubusercontent.com/5763301/115579059-641ad000-a2f8-11eb-8589-d402abfa4967.png)

![screenshot_3](https://user-images.githubusercontent.com/5763301/115579065-65e49380-a2f8-11eb-9b32-4c33776b979d.png)

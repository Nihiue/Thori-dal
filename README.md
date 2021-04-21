
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

![login screen](https://user-images.githubusercontent.com/5763301/39082960-3faa3316-458e-11e8-8207-165f38f25a18.png)

![records list](https://user-images.githubusercontent.com/5763301/39082968-5f95f638-458e-11e8-9e54-ec60560cd680.png)

![add new record](https://user-images.githubusercontent.com/5763301/39082963-47229264-458e-11e8-9a9a-fc5e857dae91.png)

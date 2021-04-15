
# Thori-dal
> Accounts and passwords management tool based on client-side encryption


## Client-Web

- Vue.js
- Mobile friendly
- Protect data with AES-256-CBC
- TOTP(2FA, Google Authenticator) Support

## Server

- Koa & Mongodb
- Only transfer encrypted data to server, you data is safe even if server is compromised

### Config db

- Rename `server/app/config/credential.example.js` to `credential.js`
- Edit it

### Create Root User

- Edit `server/app/createRootUser.js`
- Run it


### Deploy client-web

```
cd client-web
node build/build.js
cd ./dist
mv -f * ../../server/public/
```

## Screenshots

![login screen](https://user-images.githubusercontent.com/5763301/39082960-3faa3316-458e-11e8-8207-165f38f25a18.png)

![records list](https://user-images.githubusercontent.com/5763301/39082968-5f95f638-458e-11e8-9e54-ec60560cd680.png)

![add new record](https://user-images.githubusercontent.com/5763301/39082963-47229264-458e-11e8-9a9a-fc5e857dae91.png)

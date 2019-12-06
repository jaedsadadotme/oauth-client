# Middleware Oauth

## How to start 
### แต่ละ App install npm package ตัวนี้
> จากนั้น app.use()

### App ( เข่น AppA )
```sh
$ node index.js \
--callback_url <url_AppA>/callbackAuthorization \
--oauth_url <url oauth> \
--client_id <name> \ 
--client_secret <client_secret>
--success_url <url ที่จะให้ redirect ไปเมื่อ valid ผ่าน>
```

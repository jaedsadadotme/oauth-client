const app           = require("express")()
const md5           = require('md5');
const http          = require('http');
const cookieParser  = require('cookie-parser');
const fetch         = require('node-fetch');
const args          = require('minimist')(process.argv.slice(2)) 

const cilent_id         = md5(`${args['cilent_id']}`) // รับ ชื่อ มาจาก script เพราะ เดี่ยวอาจเอา set นี้ ไปเป็น middleware สำหรับทุก app
const callback_url      = args['callback_url'] // รับ url oauth จาก script
const oauth_url         = args['oauth_url'] // รับ url oauth จาก script
const success_url       = args['success_url'] // รับ url oauth จาก script
const develop           = args['dev']
app.use(cookieParser())
app.get('/callbackAuthorization',(req,res)=>{
    // จะได้ authorize_code 
    // จากนั้น เอา client_id + authorize_code http post ไปขอ token ต่างๆ 
    if(develop || develop == true){
        const cookieConfig = {
            httpOnly: true,
            maxAge: (3600 * 1000) ,// 1ชม
            signed: false
        };
        res.cookie('access_token', 'access_123213', cookieConfig);
        res.cookie('refresh_token', 'refresh_123213', cookieConfig);

        res.redirect(`${success_url}`)
    }else{
        fetch(`${oauth_url}/authorize`, {
            method: 'post',
            body:    JSON.stringify({ authorize_code: req.query.authorize_code,cilent_id: cilent_id }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(async (response) => {
            const cookieConfig = {
                httpOnly: true,
                maxAge: (3600 * 1000) ,// 1ชม
                signed: false
            };
            res.cookie('access_token', response.json().access_token, cookieConfig);
            res.cookie('refresh_token', response.json().refresh_token, cookieConfig);
    
            res.redirect(`${success_url}`)
    
        }).catch((error)=> res.json('authorize_code invalid'))
    }

})

// module.exports = 
app.use((req,res,next)=>{
    if( !req.cookies.access_token ){ // check ว่า มี access_token หรือไม่
        // redirect ผ่าน browser ไปยัง oauth-server แล้ว oauth server จะ redirect มาที่ url callback พร้อม แนบ authorize_code มาด้วย
        res.redirect(`${oauth_url}/checkToken?client_id=${cilent_id}&callbackurl=${callback_url}`)
    }
    next();
})

module.exports = app
// // app.listen(3000);
